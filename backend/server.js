require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const Turf = require('./models/Turf');
const Booking = require('./models/Booking');
const authRoutes = require('./routes/auth');
const initEmailScheduler = require('./jobs/emailScheduler');
const { sendBookingConfirmation, sendCancellationEmail } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize Scheduler (Only if not on Vercel)
if (!process.env.VERCEL) {
  initEmailScheduler();
} else {
  console.log('Vercel environment detected: Email scheduler disabled.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log every request in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);

// Get all turfs
app.get('/api/turfs', async (req, res) => {
  try {
    const { sport, search } = req.query;
    console.log('Fetching turfs with query:', { sport, search });

    let query = { isActive: true };

    if (sport && sport !== 'all') {
      query.sport = sport;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const turfs = await Turf.find(query).sort({ rating: -1 });
    console.log(`Found ${turfs.length} turfs`);
    res.json(turfs);
  } catch (error) {
    console.error('Fetch turfs error:', error);
    res.status(500).json({ error: 'Failed to fetch turfs', details: error.message });
  }
});

// Health check and DB status
app.get('/api/health', async (req, res) => {
  try {
    // Basic status info
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    // Detailed stats
    let turfCount = 0;
    try {
      if (dbState === 1) {
        turfCount = await Turf.countDocuments();
      }
    } catch (e) {
      console.error('Count check failed:', e);
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        readyState: dbState,
        status: dbStatusMap[dbState] || 'unknown',
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      counts: {
        turfs: turfCount,
      },
      environment: {
        node_env: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        has_mongo_uri: !!process.env.MONGODB_URI,
        has_jwt_secret: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Extra debug route to check environment (SAFE - only shows presence, not values)
app.get('/api/debug-env', (req, res) => {
  res.json({
    MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || 'NOT SET (Defaulting to 30d internally)',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    MONGODB_URI_PREFIX: process.env.MONGODB_URI ? process.env.MONGODB_URI.split(':')[0] : 'N/A'
  });
});

// Get single turf
app.get('/api/turfs/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }

    res.json(turf);
  } catch (error) {
    console.error('Fetch turf error:', error);
    res.status(500).json({ error: 'Failed to fetch turf' });
  }
});

// Get availability for a turf on a specific date
app.get('/api/turfs/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }

    const bookings = await Booking.find({
      turf: req.params.id,
      date,
      status: { $ne: 'cancelled' }
    });

    // Generate time slots from open to close time
    const slots = [];
    const [openHour] = turf.openTime.split(':').map(Number);
    const [closeHour] = turf.closeTime.split(':').map(Number);

    for (let hour = openHour; hour < closeHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const isBooked = bookings.some(b => b.timeSlot === timeSlot);
      slots.push({
        time: timeSlot,
        available: !isBooked
      });
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { turfId, date, timeSlot, customerName, customerEmail, customerPhone } = req.body;

    // Validation
    if (!turfId || !date || !timeSlot || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }

    // Check if slot is already booked (Mongoose unique index also handles this, but explicit check is better for UX)
    const existingBooking = await Booking.findOne({
      turf: turfId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create new booking
    const newBooking = new Booking({
      turf: turfId,
      turfName: turf.name,
      sport: turf.sport,
      date,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      price: turf.pricePerHour,
      status: 'confirmed'
    });

    await newBooking.save();

    // Send Confirmation Email
    // The 'turf' variable is already available from earlier in the function
    if (turf) {
      sendBookingConfirmation(newBooking, turf).catch(err => console.error('Confirmation email failed:', err));
    }

    res.status(201).json(newBooking);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;

    let query = {};
    if (email) {
      query.customerEmail = email;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if it's too late to cancel (e.g., 2 hours before)
    // For simplicity, we just mark as cancelled here
    booking.status = 'cancelled';
    await booking.save();

    // Send Cancellation Email
    const turf = await Turf.findById(booking.turf);
    if (turf) {
      sendCancellationEmail(booking, turf).catch(err => console.error('Cancellation email failed:', err));
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get sports statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [totalTurfs, totalBookings, confirmedBookings, turfsBySport] = await Promise.all([
      Turf.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Turf.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$sport', count: { $sum: 1 } } }
      ])
    ]);

    const sportsStats = {};
    turfsBySport.forEach(item => {
      sportsStats[item._id] = item.count;
    });

    const stats = {
      totalTurfs,
      totalBookings,
      activeBookings: confirmedBookings,
      sports: {
        cricket: sportsStats.cricket || 0,
        badminton: sportsStats.badminton || 0,
        tennis: sportsStats.tennis || 0,
        football: sportsStats.football || 0
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


// EMERGENCY SEED ROUTE (To bypass local network blocks)
app.get('/api/seed-force', async (req, res) => {
  try {
    const turfs = [
      {
        name: 'Smash & Dash Badminton',
        sport: 'badminton',
        location: 'Koramangala, Bangalore',
        pricePerHour: 400,
        capacity: 4,
        image: 'https://images.unsplash.com/photo-1626224583764-847890e0e966?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Professional wooden courts with excellent lighting and ventilation.',
        openTime: '06:00',
        closeTime: '23:00',
        isActive: true,
        rating: 4.8
      },
      {
        name: 'Greenfield Cricket Ground',
        sport: 'cricket',
        location: 'Marathahalli, Bangalore',
        pricePerHour: 1200,
        capacity: 22,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Full-sized cricket ground with natural turf wicket and pavilion.',
        openTime: '06:00',
        closeTime: '18:00',
        isActive: true,
        rating: 4.5
      },
      {
        name: 'Ace Tennis Academy',
        sport: 'tennis',
        location: 'Indiranagar, Bangalore',
        pricePerHour: 800,
        capacity: 4,
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Synthetic hard courts with floodlights for night play.',
        openTime: '05:00',
        closeTime: '22:00',
        isActive: true,
        rating: 4.7
      },
      {
        name: 'Kickoff Football Arena',
        sport: 'football',
        location: 'Whitefield, Bangalore',
        pricePerHour: 1500,
        capacity: 14,
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'FIFA standard aritificial turf suitable for 5-a-side and 7-a-side games.',
        openTime: '06:00',
        closeTime: '23:59',
        isActive: true,
        rating: 4.9
      }
    ];

    await Turf.deleteMany({});
    await Turf.insertMany(turfs);
    res.json({ success: true, message: 'Database seeded successfully via remote force!', count: turfs.length });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed', details: error.message });
  }
});

// Only listen if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
