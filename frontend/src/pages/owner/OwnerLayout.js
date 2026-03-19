import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Activity, 
  BarChart3, 
  Settings, 
  MapPin, 
  Search, 
  Bell,
  Plus,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium
      ${isActive 
        ? "bg-[#f05a28] text-white" 
        : "text-slate-600 hover:bg-[#f05a28]/10 hover:text-[#f05a28]"}
    `}
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-[#f05a28]/10 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#f05a28] p-2 rounded-lg text-white">
          <Activity size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#f05a28] tracking-tight">Krida</h1>
          <p className="text-xs text-slate-500 font-medium">Owner Panel</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        <SidebarItem to="/owner" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/owner/bookings" icon={CalendarDays} label="Bookings" />
        <SidebarItem to="/owner/venues" icon={Activity} label="My Turfs" />
        <SidebarItem to="/owner/analytics" icon={BarChart3} label="Analytics" />
      </nav>

      <div className="p-4 border-t border-[#f05a28]/10">
        <div className="mt-2 flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#f05a28]/20 flex items-center justify-center text-[#f05a28] font-bold">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.name || 'Owner'}</p>
            <p className="text-xs text-slate-500 truncate">Venue Manager</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Header = ({ title }) => {
  return (
    <header className="bg-white border-b border-[#f05a28]/10 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <MapPin className="text-[#f05a28]" size={20} />
        <h2 className="text-lg font-bold truncate">{title}</h2>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-48 xl:w-64 focus:ring-2 focus:ring-[#f05a28]/50 outline-none" 
            placeholder="Search bookings..." 
            type="text"
          />
        </div>
        
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#f05a28] rounded-full ring-2 ring-white"></span>
        </button>
        
        <NavLink to="/owner/venues" className="bg-[#f05a28] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-[#f05a28]/90 transition-colors">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Turf</span>
        </NavLink>
      </div>
    </header>
  );
};

const OwnerLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
