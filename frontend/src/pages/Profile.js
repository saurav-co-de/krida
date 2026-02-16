import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { FaUser, FaEnvelope, FaHistory, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Profile = () => {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const response = await bookingService.getAllBookings({ email: user.email });
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="h-32 w-32 bg-white rounded-full p-2 shadow-lg mx-auto">
                                <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-orange-600 text-5xl">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                            <div className="flex items-center justify-center text-gray-600 mb-6">
                                <FaEnvelope className="mr-2 text-orange-600" />
                                <span>{user.email}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="px-6 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
                        <FaHistory className="text-2xl text-orange-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Your Booking History</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading your bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <FaCalendarAlt size={32} />
                            </div>
                            <p className="text-gray-600 text-lg">No bookings found yet.</p>
                            <p className="text-gray-400">Start exploring turfs and book your first game!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id || booking._id}
                                    className="border border-gray-100 rounded-xl p-6 hover:border-orange-200 hover:bg-orange-50 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-600 rounded-full uppercase">
                                                    {booking.sport}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900">{booking.turfName}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="mr-2 text-orange-600" />
                                                    {booking.date}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="mr-2 text-orange-600" />
                                                    {booking.timeSlot}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:block md:text-right">
                                            <div className="text-sm font-semibold text-gray-900 mb-1">₹{booking.price}</div>
                                            <div className="flex items-center gap-1">
                                                {booking.status === 'confirmed' ? (
                                                    <>
                                                        <FaCheckCircle className="text-green-500" />
                                                        <span className="text-xs font-bold text-green-500 uppercase">Confirmed</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaTimesCircle className="text-red-500" />
                                                        <span className="text-xs font-bold text-red-500 uppercase">Cancelled</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
