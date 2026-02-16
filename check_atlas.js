const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Turf = require('./backend/models/Turf');

dotenv.config({ path: './backend/.env' });

const checkDB = async () => {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Turf.countDocuments();
        console.log(`CONFIRMATION: Found ${count} turfs in Atlas.`);
        process.exit(0);
    } catch (error) {
        console.error(`Check failed: ${error.message}`);
        process.exit(1);
    }
};

checkDB();
