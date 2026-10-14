/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { TrainSearch } from './components/TrainSearch';
import { TrainList } from './components/TrainList';
import { PnrEnquiry } from './components/PnrEnquiry';
import { LiveTrainTracker } from './components/LiveTrainTracker';
import { UserBookingsList } from './components/UserBookingsList';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { TicketViewModal } from './components/TicketViewModal';
import { CancellationModal } from './components/CancellationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UmlDiagramsModal } from './components/UmlDiagramsModal';
import { ApkDeployModal } from './components/ApkDeployModal';
import { storageService } from './services/storageService';
import { Train, ClassCode, Quota, Booking, User, CancellationDetails } from './types/railway';
import { Layers, Smartphone, MapPin, Mail, Phone, Linkedin, Instagram, Facebook, Twitter, Github, MessageCircle, Sparkles, Send, Bot } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  // Show First Login Page by default as requested
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('irctc_auth_session') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'search' | 'pnr' | 'live' | 'bookings' | 'admin'>('search');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('irctc_dark_mode') === 'true';
  });

  // Train Search & Filter State
  const [allTrains, setAllTrains] = useState<Train[]>(storageService.getTrains());
  const [filteredTrains, setFilteredTrains] = useState<Train[]>(storageService.getTrains());
  const [currentJourneyDate, setCurrentJourneyDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [currentQuota, setCurrentQuota] = useState<Quota>('GN');

  // Modals state
  const [bookingModalData, setBookingModalData] = useState<{
    isOpen: boolean;
    train: Train | null;
    travelClass: ClassCode;
    quota: Quota;
    journeyDate: string;
  }>({
    isOpen: false,
    train: null,
    travelClass: '3A',
    quota: 'GN',
    journeyDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [isTicketViewOpen, setIsTicketViewOpen] = useState(false);

  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUmlModalOpen, setIsUmlModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('irctc_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('irctc_dark_mode', 'false');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem('irctc_auth_session', 'true');
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('search');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('irctc_auth_session');
  };

  const handleSearchTrains = (params: {
    sourceCode: string;
    destCode: string;
    journeyDate: string;
    quota: Quota;
    selectedClass: string;
  }) => {
    setCurrentJourneyDate(params.journeyDate);
    setCurrentQuota(params.quota);

    const trains = storageService.getTrains();
    const dayOfWeek = new Date(params.journeyDate).getDay();

    const results = trains.filter(t => {
      const sourceIndex = t.route.findIndex(s => s.stationCode === params.sourceCode);
      const destIndex = t.route.findIndex(s => s.stationCode === params.destCode);

      const routeMatches =
        (t.sourceCode === params.sourceCode && t.destinationCode === params.destCode) ||
        (sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex);

      const dayMatches = t.runsOnDays.includes(dayOfWeek);
      const classMatches =
        params.selectedClass === 'ALL' || Boolean(t.classes[params.selectedClass]);

      return routeMatches && classMatches;
    });

    if (results.length === 0) {
      const relaxed = trains.filter(t => t.sourceCode === params.sourceCode);
      setFilteredTrains(relaxed.length > 0 ? relaxed : trains.slice(0, 3));
    } else {
      setFilteredTrains(results);
    }
  };

  const handleOpenBooking = (train: Train, travelClass: ClassCode) => {
    setBookingModalData({
      isOpen: true,
      train,
      travelClass,
      quota: currentQuota,
      journeyDate: currentJourneyDate,
    });
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    setCurrentUser(storageService.getCurrentUser());
    setActiveTicketBooking(newBooking);
    setIsTicketViewOpen(true);
    setAllTrains(storageService.getTrains());
  };

  const handleInitiateCancel = (booking: Booking) => {
    setCancellingBooking(booking);
    setIsCancellationOpen(true);
  };

  const handleCancellationCompleted = (cancellation: CancellationDetails) => {
    setCurrentUser(storageService.getCurrentUser());
    setAllTrains(storageService.getTrains());
    if (cancellingBooking) {
      const freshBooking = storageService.getBookingByPnr(cancellingBooking.pnr);
      if (freshBooking) {
        setActiveTicketBooking(freshBooking);
        setIsTicketViewOpen(true);
      }
    }
  };

  const handleResetSystem = () => {
    storageService.resetAllData();
    setCurrentUser(storageService.getCurrentUser());
    setAllTrains(storageService.getTrains());
    setFilteredTrains(storageService.getTrains());
  };

  // If NOT authenticated, render the dedicated First Login Page interface!
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenApkModal={() => setIsApkModalOpen(true)}
        />
        <ApkDeployModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
        />
      </div>
    );
  }

  // Once authenticated, render full reservation portal
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUmlModal={() => setIsUmlModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Book Tickets (Search & Results) */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <TrainSearch onSearch={handleSearchTrains} />
            <TrainList
              trains={filteredTrains}
              journeyDate={currentJourneyDate}
              quota={currentQuota}
              onBookTrain={handleOpenBooking}
            />
          </div>
        )}

        {/* Tab 2: PNR Status Enquiry */}
        {activeTab === 'pnr' && (
          <PnrEnquiry
            onViewTicket={b => {
              setActiveTicketBooking(b);
              setIsTicketViewOpen(true);
            }}
            onCancelTicket={handleInitiateCancel}
          />
        )}

        {/* Tab 3: Live Train Running Status (NTES) */}
        {activeTab === 'live' && <LiveTrainTracker />}

        {/* Tab 4: My Bookings History */}
        {activeTab === 'bookings' && (
          <UserBookingsList
            bookings={storageService.getUserBookings(currentUser.id)}
            onViewTicket={b => {
              setActiveTicketBooking(b);
              setIsTicketViewOpen(true);
            }}
            onCancelTicket={handleInitiateCancel}
            onNewBookingClick={() => setActiveTab('search')}
          />
        )}

        {/* Tab 5: Admin Management & Operations */}
        {activeTab === 'admin' && (
          <AdminDashboard
            onViewTicket={b => {
              setActiveTicketBooking(b);
              setIsTicketViewOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer matching Sundaram Tech design from screenshot */}
      <footer className="bg-[#030712] text-slate-300 text-xs pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand & Socials (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                {/* Futuristic Tech Logo Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950 to-purple-950 border border-cyan-500/40 p-1.5 flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="20" cy="20" r="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="6" fill="#06b6d4" />
                    <path d="M 20 3 L 20 9 M 20 31 L 20 37 M 3 20 L 9 20 M 31 20 L 37 20" stroke="#06b6d4" strokeWidth="1.5" />
                  </svg>
                </div>

                <div>
                  <div className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 leading-none">
                    SUNDARAM
                  </div>
                  <div className="text-[10px] font-mono tracking-[0.35em] text-cyan-400 font-bold mt-1">
                    TECH
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Building smart AI-powered software, scalable web platforms, and innovative digital experiences.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition shadow-xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition shadow-xs"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition shadow-xs"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition shadow-xs"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Sundaram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition shadow-xs"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-white tracking-wide">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#about" className="hover:text-cyan-400 transition">About Us</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-cyan-400 transition">Our Services</a>
                </li>
                <li>
                  <a href="#plans" className="hover:text-cyan-400 transition">AMC Plans</a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-cyan-400 transition">Careers</a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-cyan-400 transition">Blog</a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Services (2.5 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white tracking-wide">Services</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#ai-solutions" className="hover:text-cyan-400 transition">AI Solutions</a>
                </li>
                <li>
                  <a href="#it-amc" className="hover:text-cyan-400 transition">IT AMC Maintenance</a>
                </li>
                <li>
                  <a href="#web-dev" className="hover:text-cyan-400 transition">Web Development</a>
                </li>
                <li>
                  <a href="#mobile-apps" className="hover:text-cyan-400 transition">Mobile Apps</a>
                </li>
                <li>
                  <a href="#saas" className="hover:text-cyan-400 transition">SaaS Platforms</a>
                </li>
                <li>
                  <a href="#cloud-deploy" className="hover:text-cyan-400 transition">Cloud Deployment</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Us (3 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-sm font-bold text-white tracking-wide">Contact Us</h4>

              {/* Primary Location */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                    PRIMARY
                  </span>
                  <div className="font-semibold text-slate-200 text-xs">Anand Nagar, Bhopal</div>
                  <div className="text-[11px] text-slate-400">Madhya Pradesh, India</div>
                </div>
              </div>

              {/* Secondary Location */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                    SECONDARY
                  </span>
                  <div className="font-semibold text-slate-200 text-xs">Madhubani, Bihar</div>
                  <div className="text-[11px] text-slate-400">Bihar, India</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:contact@sundaramtech.com" className="text-slate-300 hover:text-white transition">
                  contact@sundaramtech.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:+917061523829" className="text-slate-300 hover:text-white font-mono transition">
                  +91 7061523829
                </a>
              </div>

              {/* Chat on WhatsApp Button */}
              <a
                href="https://wa.me/917061523829"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Actions */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; 2026 Sundaram Tech Solutions. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Check our latest work pill */}
              <div className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 shadow-xs">
                <span>🔥 Check our latest work</span>
              </div>

              {/* Ask Sundaram AI button */}
              <button
                type="button"
                onClick={() => alert('Sundaram AI Assistant is ready to help you with software architecture, cloud platforms, and full-stack solutions!')}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>Ask Sundaram AI</span>
              </button>

              {/* Railway Controls Navigation */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px]">
                <button
                  onClick={() => setIsApkModalOpen(true)}
                  className="text-emerald-400 hover:underline"
                >
                  APK Install
                </button>
                <span>&middot;</span>
                <button
                  onClick={() => setIsUmlModalOpen(true)}
                  className="text-orange-400 hover:underline"
                >
                  UML Diagrams
                </button>
                <span>&middot;</span>
                <button
                  onClick={handleSignOut}
                  className="text-red-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Form Modal */}
      {bookingModalData.isOpen && bookingModalData.train && (
        <BookingModal
          isOpen={bookingModalData.isOpen}
          onClose={() =>
            setBookingModalData({ ...bookingModalData, isOpen: false, train: null })
          }
          train={bookingModalData.train}
          travelClass={bookingModalData.travelClass}
          quota={bookingModalData.quota}
          journeyDate={bookingModalData.journeyDate}
          currentUser={currentUser}
          onBookingComplete={handleBookingCompleted}
        />
      )}

      {/* Electronic Reservation Slip (ERS) Modal */}
      <TicketViewModal
        isOpen={isTicketViewOpen}
        onClose={() => setIsTicketViewOpen(false)}
        booking={activeTicketBooking}
        onInitiateCancel={handleInitiateCancel}
      />

      {/* Cancellation & Refund Modal */}
      <CancellationModal
        isOpen={isCancellationOpen}
        onClose={() => setIsCancellationOpen(false)}
        booking={cancellingBooking}
        onCancellationComplete={handleCancellationCompleted}
      />

      {/* User Profile & Master Passenger Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUserUpdate={setCurrentUser}
        onResetSystem={handleResetSystem}
      />

      {/* UML Diagrams Modal */}
      <UmlDiagramsModal
        isOpen={isUmlModalOpen}
        onClose={() => setIsUmlModalOpen(false)}
      />

      {/* Android APK Deploy Modal */}
      <ApkDeployModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
