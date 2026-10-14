import React, { useState, useEffect } from 'react';
import { Train, Layers, Shield, User as UserIcon, Moon, Sun, Bell, Volume2, Search, Calendar, History, Activity, LogOut, Smartphone, Compass } from 'lucide-react';
import { User, UserRole } from '../types/railway';
import { playRailwayChime } from '../utils/audio';

interface HeaderProps {
  activeTab: 'search' | 'pnr' | 'live' | 'map' | 'bookings' | 'admin';
  onSelectTab: (tab: 'search' | 'pnr' | 'live' | 'map' | 'bookings' | 'admin') => void;
  currentUser: User;
  onOpenProfile: () => void;
  onOpenUmlModal: () => void;
  onOpenApkModal: () => void;
  onSignOut: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenProfile,
  onOpenUmlModal,
  onOpenApkModal,
  onSignOut,
  darkMode,
  onToggleDarkMode,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0f2e5a] text-white shadow-lg select-none">
      {/* Topmost Official Ticker Bar */}
      <div className="bg-[#091e3b] text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-white/10 font-sans">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="font-bold uppercase tracking-wider text-orange-400 shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            IRCTC Alerts:
          </span>
          <div className="text-blue-200 truncate">
            Aadhaar verification mandated for Tatkal booking &middot; Special Vande Bharat holiday rakes active &middot; Zero payment gateway charges on UPI transactions &middot; Catering option available on 12952/12302 Rajdhani
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-slate-300 font-mono text-[11px]">
          <button
            onClick={playRailwayChime}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-orange-300 font-sans transition cursor-pointer"
            title="Play Indian Railways Announcement Chime"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Station Chime</span>
          </button>
          <span className="hidden md:inline">IST {currentTime}</span>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('search')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 group-hover:bg-orange-500 flex items-center justify-center font-black text-white text-base shadow-md transition">
            <Train className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight uppercase">Mini Rail IRCTC</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/90 font-bold uppercase tracking-wider">
                Next-Gen
              </span>
            </div>
            <p className="text-[10px] text-blue-200 font-medium hidden sm:block">
              Indian Railway Catering &amp; Tourism Corporation &middot; PRS Clone
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => onSelectTab('search')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Book Tickets</span>
          </button>

          <button
            onClick={() => onSelectTab('pnr')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pnr'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>PNR Status</span>
          </button>

          <button
            onClick={() => onSelectTab('live')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Status</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Network Map</span>
          </button>

          <button
            onClick={() => onSelectTab('bookings')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4 text-orange-400" />
            <span>Admin Center</span>
            {currentUser.role === 'admin' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </nav>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* UML Diagrams Button (Highlights academic project evaluation!) */}
          <button
            onClick={onOpenUmlModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition shadow-xs cursor-pointer"
            title="View System UML Diagrams"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">UML Diagrams</span>
            <span className="text-[10px] px-1 rounded bg-orange-500 text-white">5</span>
          </button>

          {/* Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Install APK Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-xs cursor-pointer"
            title="Download & Install Android APK / WebAPK"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Install APK</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold border border-white/15 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <div className="font-bold text-white leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-blue-200 font-mono">
                ₹{currentUser.walletBalance || 0}
              </div>
            </div>
          </button>

          {/* Sign Out / Exit to Login Page */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/80 transition cursor-pointer"
            title="Sign Out to Login Page"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Subnavigation Bar */}
      <div className="lg:hidden flex border-t border-white/10 bg-[#091e3b] px-2 py-1.5 overflow-x-auto text-xs font-bold gap-1">
        <button
          onClick={() => onSelectTab('search')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'search' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          Book Ticket
        </button>
        <button
          onClick={() => onSelectTab('pnr')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'pnr' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          PNR Status
        </button>
        <button
          onClick={() => onSelectTab('live')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'live' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          Live Tracking
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'map' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          Route Map
        </button>
        <button
          onClick={() => onSelectTab('bookings')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'bookings' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => onSelectTab('admin')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'admin' ? 'bg-orange-500 text-white' : 'text-blue-200'
          }`}
        >
          Admin Center
        </button>
      </div>
    </header>
  );
};
