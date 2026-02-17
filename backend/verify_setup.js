const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env from current folder
dotenv.config();

// Override DNS servers to allow SRV resolution for MongoDB Atlas in restricted environments
const dns = require('dns');
if (typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}


const checkDeployment = async () => {
    console.log('--- DIAGNOSTIC TOOL INITIALIZED ---');

    // 1. Check Env Vars
    if (!process.env.MONGODB_URI) {
        console.error('❌ FATAL: MONGODB_URI is missing in .env');
        process.exit(1);
    }
    console.log('✅ ENV: MONGODB_URI found (' + process.env.MONGODB_URI.substring(0, 20) + '...)');

    // 2. Connect to Atlas
    try {
        console.log('🔄 CONNECTING: Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ CONNECTION: Successfully connected to MongoDB Atlas!');
    } catch (err) {
        console.error('❌ CONNECTION FAILED: Could not connect to Atlas.');
        console.error('   Error:', err.message);
        process.exit(1);
    }

    // 3. Check Data
    try {
        const collection = mongoose.connection.db.collection('turfs');
        const count = await collection.countDocuments();
        console.log(`📊 DATA CHECK: Found ${count} turfs in the "turfs" collection.`);

        if (count === 0) {
            console.error('⚠️ ISSUE FOUND: The database is connected but EMPTY.');
        } else {
            console.log('✅ DATA: Database is populated and ready.');
        }
    } catch (err) {
        console.error('❌ DATA CHECK FAILED:', err.message);
    }

    process.exit(0);
};

checkDeployment();
