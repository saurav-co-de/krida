const mongoose = require('mongoose');

// HARDCODED URI to rule out .env issues
const URI = 'mongodb+srv://krida:qCPvYWH5Pn9y0Iak@cluster0.qhzvyqy.mongodb.net/?appName=Cluster0';

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
        name: 'Greenfield Cricket Ground, marathahalli',
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

const seedDB = async () => {
    try {
        console.log('🔄 Connecting to MongoDB Atlas (Hardcoded URI)...');
        await mongoose.connect(URI);
        console.log('✅ Connected!');

        // Define simple schema inline to avoid file dependency
        const turfSchema = new mongoose.Schema({
            name: String, sport: String, location: String, pricePerHour: Number,
            capacity: Number, image: String, description: String,
            openTime: String, closeTime: String, isActive: Boolean, rating: Number
        }, { timestamps: true });

        // Use existing model if active, or create new
        const Turf = mongoose.models.Turf || mongoose.model('Turf', turfSchema);

        console.log('🗑️ Clearing old data...');
        await Turf.deleteMany({});

        console.log('🌱 Inserting new data...');
        await Turf.insertMany(turfs);

        console.log('🎉 SUCCESS! Database seeded with ' + turfs.length + ' turfs.');
        console.log('   Now go to your Vercel site and refresh!');
        process.exit(0);

    } catch (err) {
        console.error('❌ FAILURE:', err.message);
        process.exit(1);
    }
};

seedDB();
