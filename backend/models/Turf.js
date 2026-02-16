const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Turf name is required'],
        trim: true,
    },
    sport: {
        type: String,
        required: [true, 'Sport category is required'],
        enum: ['cricket', 'badminton', 'tennis', 'football'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Price per hour is required'],
        min: 0,
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
    },
    facilities: {
        type: [String],
        default: [],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    openTime: {
        type: String,
        required: [true, 'Open time is required'],
    },
    closeTime: {
        type: String,
        required: [true, 'Close time is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'turfs'
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
