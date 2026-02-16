const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

async function verifyDeployment() {
    console.log('\n🔍 STARTING COMPREHENSIVE CLOUD CHECK...\n');

    // 1. Check Environment Variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ ERROR: MONGODB_URI is missing in backend/.env');
        process.exit(1);
    }
    console.log('✅ ENV: Found MONGODB_URI');

    // 2. Connect to MongoDB Atlas
    try {
        console.log('🔄 CONNECTING: Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(uri);
        console.log('✅ CONNECTION: Successfully connected to Cloud Database!');
    } catch (error) {
        console.error('❌ CONNECTION FAILED:', error.message);
        console.log('   (Did you whitelist your IP in Atlas?)');
        process.exit(1);
    }

    // 3. Verify Data
    try {
        const collection = mongoose.connection.db.collection('turfs');
        const count = await collection.countDocuments();

        console.log(`\n📊 DATABASE STATUS:`);
        console.log(`   - Collection: "turfs"`);
        console.log(`   - Document Count: ${count}`);

        if (count === 0) {
            console.error('\n⚠️ CRITICAL ISSUE: The database is connected but EMPTY.');
            console.log('   Solution: You MUST run "npm run seed" in the backend folder.');
        } else {
            console.log('\n✅ SUCCESS: The Cloud Database HAS DATA!');
            console.log('   If your live website still shows "0 turfs", the issue is 100% with Vercel Configuration.');
            console.log('   -> Go to Vercel Settings -> Environment Variables');
            console.log('   -> Add MONGODB_URI taking care not to have any spaces');
            console.log('   -> Redeploy the latest commit');
        }

        // 4. Print one turf to verify structure
        if (count > 0) {
            const sample = await collection.findOne();
            console.log('\n📋 Sample Data (First Turf):');
            console.log(`   - Name: ${sample.name}`);
            console.log(`   - Location: ${sample.location}`);
            console.log(`   - Image: ${sample.image ? 'Present' : 'MISSING'}`);
        }

    } catch (error) {
        console.error('❌ DATA VERIFICATION FAILED:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🏁 Check Complete.');
        process.exit(0);
    }
}

verifyDeployment();
