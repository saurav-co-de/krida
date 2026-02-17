const mongoose = require('mongoose');
require('dotenv').config();

// Override DNS servers to allow SRV resolution for MongoDB Atlas in restricted environments
const dns = require('dns');
if (typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do not process.exit(1) on Vercel as it crashes the function invocation
        if (!process.env.VERCEL) {
            process.exit(1);
        }
        throw error; // Let the caller deal with it
    }
};

module.exports = connectDB;
