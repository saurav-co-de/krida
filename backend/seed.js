const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const Turf = require('./models/Turf');
const Booking = require('./models/Booking');

dotenv.config();

const initialTurfs = [
    {
        name: 'Green Valley Cricket Ground',
        sport: 'cricket',
        location: 'Sector 21, Bangalore',
        pricePerHour: 1500,
        capacity: 22,
        facilities: ['Floodlights', 'Pavilion', 'Parking', 'Changing Rooms'],
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
        description: 'Professional cricket ground with international standard pitch and facilities.',
        openTime: '06:00',
        closeTime: '22:00'
    },
    {
        name: 'Royal Turf Cricket Arena',
        sport: 'cricket',
        location: 'MG Road, Bangalore',
        pricePerHour: 2000,
        capacity: 22,
        facilities: ['Floodlights', 'Scoreboard', 'Seating', 'Refreshments'],
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
        description: 'Premium cricket facility with modern amenities and professional coaching available.',
        openTime: '06:00',
        closeTime: '23:00'
    },
    {
        name: 'City Sports Badminton Center',
        sport: 'badminton',
        location: 'Koramangala, Bangalore',
        pricePerHour: 500,
        capacity: 4,
        facilities: ['AC Courts', 'Professional Flooring', 'Equipment Rental', 'Shower'],
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
        description: 'Air-conditioned badminton courts with synthetic flooring and equipment available.',
        openTime: '05:00',
        closeTime: '22:00'
    },
    {
        name: 'Ace Badminton Club',
        sport: 'badminton',
        location: 'Indiranagar, Bangalore',
        pricePerHour: 600,
        capacity: 4,
        facilities: ['AC Courts', 'Coaching', 'Parking', 'Cafe'],
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1600965962102-9d260a71890d?w=800',
        description: 'Premium badminton facility with professional coaching and tournament hosting.',
        openTime: '06:00',
        closeTime: '23:00'
    },
    {
        name: 'Tennis Courts Pro',
        sport: 'tennis',
        location: 'Whitefield, Bangalore',
        pricePerHour: 800,
        capacity: 4,
        facilities: ['Clay Courts', 'Hard Courts', 'Coaching', 'Equipment Rental'],
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        description: 'Professional tennis courts with both clay and hard court options.',
        openTime: '06:00',
        closeTime: '21:00'
    },
    {
        name: 'Elite Tennis Academy',
        sport: 'tennis',
        location: 'HSR Layout, Bangalore',
        pricePerHour: 1000,
        capacity: 4,
        facilities: ['Floodlights', 'Professional Coaching', 'Pro Shop', 'Locker Rooms'],
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800',
        description: 'Top-rated tennis academy with international standard facilities.',
        openTime: '05:30',
        closeTime: '22:00'
    },
    {
        name: 'Champions Football Turf',
        sport: 'football',
        location: 'Electronic City, Bangalore',
        pricePerHour: 3000,
        capacity: 22,
        facilities: ['FIFA Standard Turf', 'Floodlights', 'Goals', 'Changing Rooms'],
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
        description: 'FIFA standard artificial turf perfect for 11-a-side matches.',
        openTime: '06:00',
        closeTime: '23:00'
    },
    {
        name: 'Metro Football Arena',
        sport: 'football',
        location: 'Marathahalli, Bangalore',
        pricePerHour: 2500,
        capacity: 14,
        facilities: ['Artificial Turf', 'Floodlights', 'Parking', 'Refreshments'],
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        description: '7-a-side football turf with excellent drainage and lighting.',
        openTime: '06:00',
        closeTime: '22:30'
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();

        console.log('Clearing existing data...');
        const deletedTurfs = await Turf.deleteMany({});
        console.log(`Deleted ${deletedTurfs.deletedCount} turfs.`);

        await Booking.deleteMany({});

        console.log('Seeding turfs...');
        const createdTurfs = await Turf.insertMany(initialTurfs);
        console.log(`Successfully seeded ${createdTurfs.length} turfs!`);

        console.log('Verification: checking count...');
        const count = await Turf.countDocuments();
        console.log(`Final count in database: ${count}`);

        mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
