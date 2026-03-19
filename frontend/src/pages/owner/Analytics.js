import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Table
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ownerService } from '../../services/api';

const revenueData = [
  { name: 'Mon', value: 8000 },
  { name: 'Tue', value: 12000 },
  { name: 'Wed', value: 10000 },
  { name: 'Thu', value: 15000 },
  { name: 'Fri', value: 13000 },
  { name: 'Sat', value: 22000 },
  { name: 'Sun', value: 18000 },
];

const timeSlotData = [
  { name: '6am', value: 400 },
  { name: '10am', value: 600 },
  { name: '2pm', value: 300 },
  { name: '6pm', value: 850 },
  { name: '10pm', value: 500 },
];

const ChartCard = ({ title, value, trend, trendType, children }) => (
  <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        trendType === 'up' ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
      }`}>
        {trend}
      </span>
    </div>
    <div className="flex-1 min-h-[250px]">
      {children}
    </div>
  </div>
);

const OccupancyItem = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="font-bold text-[#f05a28]">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#f05a28] rounded-full transition-all duration-500" 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ownerService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching analytics stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Overview & Exports */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f05a28] tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500">Detailed insights into your turf operations and performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f05a28]/20 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f05a28] text-white rounded-lg text-sm font-bold hover:bg-[#f05a28]/90 transition-colors shadow-lg shadow-[#f05a28]/20">
            <FileText size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">₹{stats?.totalRevenue || 0}</h3>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +12.5% vs last month
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Bookings</p>
            <h3 className="text-2xl font-bold mt-1">{stats?.totalBookings || 0}</h3>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +8.2% vs last month
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Listings</p>
            <h3 className="text-2xl font-bold mt-1">{stats?.totalTurfs || 0}</h3>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-2">
                Stable
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-[#f05a28]/10 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
            <h3 className="text-2xl font-bold mt-1">42.5%</h3>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +2.1%
            </div>
         </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trends (Last 7 Days)" value={`₹${stats?.totalRevenue || 0}`} trend="+12.5%" trendType="up">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f05a28" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f05a28" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#f05a28', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#f05a28" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Popular Time Slots" value="Peak: 6pm" trend="+5.4%" trendType="up">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSlotData}>
              <Tooltip 
                cursor={{ fill: 'rgba(240, 90, 40, 0.05)' }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {timeSlotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === '6pm' ? '#f05a28' : '#f05a2840'} />
                ))}
              </Bar>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Occupancy Summary */}
      <div className="bg-white p-8 rounded-xl border border-[#f05a28]/10 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Venue Occupancy Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OccupancyItem label="Main Football Turf" value={92} />
            <OccupancyItem label="Cricket Pitch 1" value={78} />
            <OccupancyItem label="Tennis Court" value={85} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
