import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEnvelope, FaSearch, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { bookingService } from '../services/api';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingService.getAllBookings({ email });
      setBookings(response.data);
      setSearched(true);
      
      if (response.data.length === 0) {
        toast.info('No bookings found for this email');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      
      // Refresh bookings
      handleSearch({ preventDefault: () => {} });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isUpcoming = (date, time) => {
    const bookingDateTime = new Date(`${date} ${time}`);
    return bookingDateTime > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and manage your turf bookings
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Enter your email to view bookings
              </label>
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 disabled:bg-gray-400"
                >
                  <FaSearch />
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading bookings...</p>
          </div>
        ) : searched && bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet, or they're not associated with this email.
            </p>
            <button
              onClick={() => navigate('/turfs')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Browse Turfs
            </button>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-600 rounded-full uppercase">
                          {booking.sport}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{booking.turfName}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{booking.price}</div>
                      <div className="text-sm text-gray-500">1 hour booking</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-green-600 text-xl" />
                      <div>
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="font-semibold text-gray-800">{formatDate(booking.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-green-600 text-xl" />
                      <div>
                        <div className="text-xs text-gray-500">Time</div>
                        <div className="font-semibold text-gray-800">{booking.timeSlot}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-green-600 text-xl" />
                      <div>
                        <div className="text-xs text-gray-500">Booking ID</div>
                        <div className="font-semibold text-gray-800 text-sm">{booking.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {booking.status === 'confirmed' && isUpcoming(booking.date, booking.timeSlot) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <FaTimesCircle />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                    {booking.status === 'confirmed' && !isUpcoming(booking.date, booking.timeSlot) && (
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <FaCheckCircle />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyBookings;
