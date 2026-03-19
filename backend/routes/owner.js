const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

// All routes in this file require authentication and 'owner' role
router.use(protect);
router.use(authorize('owner', 'admin'));

// @desc    Get all turfs owned by the logged-in user
// @route   GET /api/owner/turfs
router.get('/turfs', async (req, res) => {
    try {
        const turfs = await Turf.find({ owner: req.user.id });
        res.json(turfs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch owner turfs', details: error.message });
    }
});

// @desc    Create a new turf
// @route   POST /api/owner/turfs
router.post('/turfs', async (req, res) => {
    try {
        const turfData = { ...req.body, owner: req.user.id };
        const turf = await Turf.create(turfData);
        res.status(201).json(turf);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create turf', details: error.message });
    }
});

// @desc    Update a turf
// @route   PUT /api/owner/turfs/:id
router.put('/turfs/:id', async (req, res) => {
    try {
        let turf = await Turf.findById(req.params.id);

        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }

        // Make sure user is turf owner
        if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Not authorized to update this turf' });
        }

        turf = await Turf.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(turf);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update turf', details: error.message });
    }
});

// @desc    Delete a turf
// @route   DELETE /api/owner/turfs/:id
router.delete('/turfs/:id', async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id);

        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }

        // Make sure user is turf owner
        if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Not authorized to delete this turf' });
        }

        await turf.deleteOne();
        res.json({ success: true, message: 'Turf deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete turf', details: error.message });
    }
});

// @desc    Get all bookings for owner's turfs
// @route   GET /api/owner/bookings
router.get('/bookings', async (req, res) => {
    try {
        // Find all turfs owned by this user
        const turfs = await Turf.find({ owner: req.user.id }).select('_id');
        const turfIds = turfs.map(t => t._id);

        const bookings = await Booking.find({ turf: { $in: turfIds } })
            .sort({ createdAt: -1 })
            .populate('turf', 'name sport location');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch owner bookings', details: error.message });
    }
});

// @desc    Get owner stats
// @route   GET /api/owner/stats
router.get('/stats', async (req, res) => {
    try {
        const turfs = await Turf.find({ owner: req.user.id }).select('_id');
        const turfIds = turfs.map(t => t._id);

        const [totalTurfs, totalBookings, confirmedBookings, revenueData] = await Promise.all([
            Turf.countDocuments({ owner: req.user.id }),
            Booking.countDocuments({ turf: { $in: turfIds } }),
            Booking.countDocuments({ turf: { $in: turfIds }, status: 'confirmed' }),
            Booking.aggregate([
                { $match: { turf: { $in: turfIds }, status: 'confirmed' } },
                { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
            ])
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.json({
            totalTurfs,
            totalBookings,
            activeBookings: confirmedBookings,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch owner stats', details: error.message });
    }
});

module.exports = router;
