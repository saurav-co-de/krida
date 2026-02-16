const nodemailer = require('nodemailer');

// Create Transporter
const createTransporter = async () => {
    // For development, use Ethereal if no real credentials are provided
    if (process.env.EMAIL_USER === 'ethereal_user_placeholder') {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    // Production/Real Configuration
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendEmail = async (options) => {
    const transporter = await createTransporter();

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    // Preview URL if using Ethereal
    if (nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
};

// Welcome Email
const sendWelcomeEmail = async (user) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: linear-gradient(to right, #ea580c, #dc2626); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to KRIDA, ${user.name}! 🐉</h1>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">You've successfully joined the elite community of athletes. Your account is now active and ready for booking the best turfs in the city.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/turfs" style="background: #000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Turfs</a>
        </div>
        <p style="font-size: 14px; color: #666;">Get ready to dominate the field!</p>
      </div>
      <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        &copy; 2026 KRIDA Sports Venue Booking. All rights reserved.
      </div>
    </div>
  `;

    return sendEmail({
        email: user.email,
        subject: 'Welcome to KRIDA - Your Sports Journey Starts Here!',
        html,
    });
};

// Booking Confirmation
const sendBookingConfirmation = async (booking, turf) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #000; padding: 30px; text-align: center;">
        <h1 style="color: #ea580c; margin: 0; font-size: 24px;">Booking Confirmed! 🏸</h1>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hello ${booking.customerName},</p>
        <p>Your booking for <strong>${turf.name}</strong> has been confirmed. Get your gear ready!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">Booking Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0; color: #666;">Sport:</td><td style="font-weight: bold; text-transform: capitalize;">${turf.sport}</td></tr>
            <tr><td style="padding: 5px 0; color: #666;">Date:</td><td style="font-weight: bold;">${booking.date}</td></tr>
            <tr><td style="padding: 5px 0; color: #666;">Time Slot:</td><td style="font-weight: bold;">${booking.timeSlot}</td></tr>
            <tr><td style="padding: 5px 0; color: #666;">Amount:</td><td style="font-weight: bold; color: #16a34a;">₹${booking.price}</td></tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #666;">Location: ${turf.location}</p>
        <p style="font-size: 14px; color: #999;">Please arrive 10 minutes before your slot.</p>
      </div>
    </div>
  `;

    return sendEmail({
        email: booking.customerEmail,
        subject: `Booking Confirmed: ${turf.name} - ${booking.date}`,
        html,
    });
};

// Booking Cancellation
const sendCancellationEmail = async (booking, turf) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #ef4444; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Cancelled</h1>
      </div>
      <div style="padding: 30px; color: #333;">
        <p>Your booking for <strong>${turf.name}</strong> on ${booking.date} at ${booking.timeSlot} has been successfully cancelled.</p>
        <p>If this was a mistake, you can book again on our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/turfs" style="background: #000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Book New Slot</a>
        </div>
      </div>
    </div>
  `;

    return sendEmail({
        email: booking.customerEmail,
        subject: `Booking Cancelled: ${turf.name}`,
        html,
    });
};

// Reminder Email
const sendReminderEmail = async (booking, turf) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background: #f97316; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Game Day Reminder! 🔥</h1>
      </div>
      <div style="padding: 30px; color: #333;">
        <p>Ready to hit the field? Your game at <strong>${turf.name}</strong> is coming up tomorrow!</p>
        <div style="border-left: 4px solid #f97316; padding: 10px 20px; background: #fff7ed; margin: 20px 0;">
          <p style="margin: 0;"><strong>When:</strong> Tomorrow, ${booking.date} at ${booking.timeSlot}</p>
        </div>
        <p style="font-size: 14px; color: #666;">Don't forget your gear. See you there!</p>
      </div>
    </div>
  `;

    return sendEmail({
        email: booking.customerEmail,
        subject: `Game Reminder: ${turf.name} is tomorrow!`,
        html,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendBookingConfirmation,
    sendCancellationEmail,
    sendReminderEmail,
};
