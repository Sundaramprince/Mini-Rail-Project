import React, { useState } from 'react';
import { Search, Train, CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Booking } from '../types/railway';

interface PnrEnquiryProps {
  onViewTicket: (booking: Booking) => void;
  onCancelTicket: (booking: Booking) => void;
}

export const PnrEnquiry: React.FC<PnrEnquiryProps> = ({ onViewTicket, onCancelTicket }) => {
  const [pnrInput, setPnrInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Sample quick test PNRs
  const samplePnrs = ['2458910243', '8321456980'];

  const handleSearch = (pnrToSearch?: string) => {
    const target = (pnrToSearch || pnrInput).trim().replace(/\D/g, '');
    if (!target || target.length < 5) {
      setError('Please enter a valid 10-digit PNR number.');
      setSearchedBooking(null);
      setHasSearched(false);
      return;
    }

    setError('');
    setHasSearched(true);
    const booking = storageService.getBookingByPnr(target);
    if (booking) {
      setSearchedBooking(booking);
    } else {
      setSearchedBooking(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f2e5a] to-[#1e40af] text-white shadow-md">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-bold block mb-1">
            Passenger Reservation System
          </span>
          <h2 className="text-2xl font-black tracking-tight">Check Live PNR Status</h2>
          <p className="text-xs text-blue-200 mt-1">
            Enter your 10-digit PNR number to check current reservation status, coach/berth confirmation, and chart preparation.
          </p>
        </div>

        {/* Input Box */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={12}
              value={pnrInput}
              onChange={e => setPnrInput(e.target.value)}
              placeholder="Enter 10-digit PNR Number"
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 font-mono text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {pnrInput && (
              <button
                type="button"
                onClick={() => setPnrInput('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Get Status</span>
          </button>
        </div>

        {/* Quick test sample pills */}
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-200">
          <span>Quick Demo PNRs:</span>
          {samplePnrs.map(pnr => (
            <button
              key={pnr}
              onClick={() => {
                setPnrInput(pnr);
                handleSearch(pnr);
              }}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-semibold transition"
            >
              {pnr}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {hasSearched && searchedBooking && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
          {/* Card Title Bar */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PNR Number</span>
              <div className="text-xl font-black font-mono text-orange-600 tracking-wider">
                {searchedBooking.pnr}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {searchedBooking.chartStatus.replace(/_/g, ' ')}
              </span>

              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                searchedBooking.bookingStatus === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : searchedBooking.bookingStatus === 'CANCELLED'
                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {searchedBooking.bookingStatus}
              </span>
            </div>
          </div>

          {/* Train details ribbon */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Train</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{searchedBooking.trainNumber} - {searchedBooking.trainName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">From &rarr; To</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{searchedBooking.sourceCode} &rarr; {searchedBooking.destinationCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Journey</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{searchedBooking.journeyDate} ({searchedBooking.departureTime})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class &amp; Quota</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{searchedBooking.travelClass} &middot; {searchedBooking.quota}</span>
            </div>
          </div>

          {/* Passenger status table */}
          <div className="p-6">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-3">
              Passenger Status Breakdown
            </span>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Passenger Name</th>
                    <th className="py-2.5 px-4">Age / Gender</th>
                    <th className="py-2.5 px-4">Booking Status</th>
                    <th className="py-2.5 px-4">Current Status</th>
                    <th className="py-2.5 px-4">Coach / Berth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {searchedBooking.passengers.map((pax, i) => (
                    <tr key={pax.id} className={pax.isCancelled ? 'bg-red-50 dark:bg-red-950/20 text-slate-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}>
                      <td className="py-3 px-4 font-mono font-medium">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{pax.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{pax.age} / {pax.gender}</td>
                      <td className="py-3 px-4 font-mono">
                        {pax.isCancelled ? 'CANCELLED' : `${pax.status} / ${pax.allocatedCoach}-${pax.allocatedBerth}`}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {pax.isCancelled ? (
                          <span className="text-red-500">CAN</span>
                        ) : pax.status === 'CNF' ? (
                          <span className="text-emerald-600 dark:text-emerald-400">CNF (Confirmed)</span>
                        ) : (
                          <span className="text-orange-500">{pax.status} {pax.statusNumber}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {pax.isCancelled ? '-' : `${pax.allocatedCoach} / ${pax.allocatedBerth} (${pax.allocatedBerthType})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Total Fare: <strong className="font-mono text-slate-900 dark:text-white">₹{searchedBooking.grandTotal}</strong> ({searchedBooking.paymentMethod})
            </span>

            <div className="flex items-center gap-3">
              {searchedBooking.bookingStatus !== 'CANCELLED' && (
                <button
                  onClick={() => onCancelTicket(searchedBooking)}
                  className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition"
                >
                  Cancel Ticket
                </button>
              )}

              <button
                onClick={() => onViewTicket(searchedBooking)}
                className="px-5 py-2 rounded-lg bg-[#0f2e5a] hover:bg-[#153e78] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>View Full E-Ticket (ERS)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {hasSearched && !searchedBooking && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-orange-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Record Found for PNR "{pnrInput}"</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please verify the 10-digit PNR printed on top-left corner of your reservation slip or click on one of the demo PNRs above.
          </p>
        </div>
      )}
    </div>
  );
};
