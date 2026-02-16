const cron = require('node-cron');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const { sendReminderEmail } = require('../services/emailService');

const initEmailScheduler = () => {
    // Run every hour: "0 * * * *"
    // For testing, run every minute: "* * * * *"
    cron.schedule('0 * * * *', async () => {
        console.log('Running 24-hour booking reminder check...');

        try {
            // Calculate tomorrow's date string
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            // Find all confirmed bookings for tomorrow that haven't been reminded
            const bookings = await Booking.find({
                date: tomorrowStr,
                status: 'confirmed',
                reminderSent: { $ne: true }
            });

            console.log(`Found ${bookings.length} bookings for tomorrow (${tomorrowStr})`);

            for (const booking of bookings) {
                const turf = await Turf.findById(booking.turf);
                if (turf) {
                    await sendReminderEmail(booking, turf);
                    // Mark reminder as sent
                    booking.reminderSent = true;
                    await booking.save();
                    console.log(`Reminder sent for booking ${booking._id}`);
                }
            }
        } catch (error) {
            console.error('Email scheduler error:', error);
        }
    });

    console.log('Email scheduler initialized.');
};

module.exports = initEmailScheduler;
