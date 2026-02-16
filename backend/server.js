require('dotenv').config();
const express = require('express');
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

// Initialize Scheduler
initEmailScheduler();

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
    const turfCount = await Turf.countDocuments();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      database: dbStatus,
      turfs: turfCount,
      env: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Only listen if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
