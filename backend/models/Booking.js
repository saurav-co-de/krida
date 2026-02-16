const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    turf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: true,
    },
    turfName: {
        type: String,
        required: true,
    },
    sport: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    timeSlot: {
        type: String, // Format: HH:00
        required: true,
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    customerPhone: {
        type: String,
        required: [true, 'Customer phone is required'],
    },
    price: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to prevent double booking the same slot
bookingSchema.index({ turf: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
