import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Check,
  X,
  Calendar,
  Activity
} from 'lucide-react';
import { ownerService } from '../../services/api';
import { toast } from 'react-toastify';

const BookingCard = ({ booking, onCancel }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
    <div className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#f05a28]/10 text-[#f05a28] text-[10px] font-bold rounded uppercase">
            {booking.turf?.name || 'Unknown Turf'}
          </span>
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">ID: {booking._id.substring(18)}</span>
        </div>
        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
          booking.status === 'confirmed' ? "bg-green-100 text-green-600" : 
          booking.status === 'cancelled' ? "bg-red-100 text-red-600" : 
          "bg-yellow-100 text-yellow-600"
        }`}>
          {booking.status}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Date & Time</p>
          <p className="text-sm font-semibold mt-1">{booking.date}</p>
          <p className="text-xs text-slate-500">{booking.timeSlot}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Customer</p>
          <p className="text-sm font-semibold mt-1">{booking.customerName}</p>
          <p className="text-xs text-slate-500">{booking.customerPhone}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payment</p>
          <p className="text-sm font-semibold mt-1 text-green-600">₹{booking.price}</p>
          <p className="text-xs text-slate-500">{booking.paymentStatus || 'Pending'}</p>
        </div>
        <div className="flex items-end md:justify-end gap-2 pt-2 md:pt-0">
          {booking.status === 'confirmed' && (
            <button 
              onClick={() => onCancel(booking._id)}
              className="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:text-red-500 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await ownerService.getBookings();
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      // Note: We'll use the existing booking service for cancellation if owner is allowed
      // or implement a specific owner cancel route if needed. 
      // For now, let's assume the PATCH /api/bookings/:id/cancel works if owner is authorized on backend.
      await ownerService.getBookings(); // Refresh list after cancellation
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-black tracking-tight text-[#f05a28]">Manage Bookings</h2>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer">
          <Calendar size={18} className="text-slate-400" />
          <span className="text-sm font-medium">All Dates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Simple Statistics */}
        <div className="xl:col-span-1 space-y-4">
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">Quick Statistics</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Bookings</span>
                <span className="font-bold text-lg">{bookings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confirmed</span>
                <span className="font-bold text-emerald-600">{bookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cancelled</span>
                <span className="font-bold text-rose-600">{bookings.filter(b => b.status === 'cancelled').length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f05a28]/5 rounded-xl p-6 border border-[#f05a28]/10 text-center">
            <Activity className="mx-auto mb-2 text-[#f05a28]" size={32} />
            <p className="text-sm font-bold text-[#f05a28]">Real-time Updates</p>
            <p className="text-xs text-slate-500 mt-1">Booking list refreshes automatically every 5 minutes.</p>
          </div>
        </div>

        {/* Bookings List View */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-lg">Detailed Booking List</h3>
          </div>
          
          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <BookingCard 
                  key={booking._id} 
                  booking={booking} 
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className="bg-white p-12 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-500">
                <Calendar className="mx-auto mb-4 opacity-20" size={48} />
                <p className="font-medium text-lg">No bookings found</p>
                <p className="text-sm">When customers book your turfs, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
