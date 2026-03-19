import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CalendarCheck, 
  IndianRupee, 
  LayoutGrid, 
  Clock,
  Users,
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { ownerService } from '../../services/api';
import { toast } from 'react-toastify';

const StatCard = ({ icon: Icon, label, value, trend, trendType }) => (
  <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-[#f05a28]/10 p-2 rounded-lg text-[#f05a28]">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold flex items-center gap-1 ${trendType === 'up' ? "text-emerald-500" : "text-amber-500"}`}>
          {trend} <TrendingUp size={14} />
        </span>
      )}
      {!trend && <span className="text-slate-400 text-xs font-bold uppercase">Stable</span>}
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const BookingRow = ({ name, turf, time, status, initials }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f05a28]/20 flex items-center justify-center text-[#f05a28] font-bold text-xs">
          {initials}
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-slate-600">{turf}</td>
    <td className="px-6 py-4 text-sm text-slate-600">{time}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
        status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : 
        status === 'pending' ? "bg-amber-100 text-amber-700" : 
        "bg-rose-100 text-rose-700"
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTurfs: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          ownerService.getStats(),
          ownerService.getBookings()
        ]);
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={CalendarCheck} label="Today's Bookings" value={stats.activeBookings} trend="+15%" trendType="up" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats.totalRevenue}`} trend="+8%" trendType="up" />
        <StatCard icon={LayoutGrid} label="My Turfs" value={stats.totalTurfs} />
        <StatCard icon={Clock} label="Total Bookings" value={stats.totalBookings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-[#f05a28]/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f05a28]/10 flex items-center justify-between">
              <h3 className="font-bold text-lg">Recent Bookings</h3>
              <button className="text-[#f05a28] text-sm font-bold hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Turf Name</th>
                    <th className="px-6 py-4">Time Slot</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f05a28]/5">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <BookingRow 
                        key={booking._id}
                        initials={booking.customerName.charAt(0)}
                        name={booking.customerName}
                        turf={booking.turf?.name || 'Unknown'}
                        time={`${booking.date} ${booking.timeSlot}`}
                        status={booking.status}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Quick Tips */}
           <div className="bg-[#f05a28] p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} />
              <div>
                <h4 className="font-bold text-sm">Grow Your Business</h4>
                <p className="text-xs opacity-80 mt-1">Try offering early bird discounts to fill weekday morning slots!</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors">
              View All Tips
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 bg-[#f05a28]/5 text-[#f05a28] text-sm font-bold rounded-lg hover:bg-[#f05a28]/10 transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /> Add New Turf
              </button>
              <button className="w-full py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <Users size={18} /> Manage Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
