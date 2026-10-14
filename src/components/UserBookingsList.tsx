import React from 'react';
import { Ticket, Calendar, Clock, MapPin, Printer, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { Booking } from '../types/railway';

interface UserBookingsListProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancelTicket: (booking: Booking) => void;
  onNewBookingClick: () => void;
}

export const UserBookingsList: React.FC<UserBookingsListProps> = ({
  bookings,
  onViewTicket,
  onCancelTicket,
  onNewBookingClick,
}) => {
  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">No Booking Records Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't made any train reservations yet. Search and book your journey now to view your Electronic Reservation Slip.
        </p>
        <button
          onClick={onNewBookingClick}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
        >
          Book Train Ticket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>My Bookings History (<strong>{bookings.length}</strong> Reservations)</span>
        <span>Includes Confirmed &amp; Cancelled Tickets</span>
      </div>

      {bookings.map(booking => {
        const isCancelled = booking.bookingStatus === 'CANCELLED';
        const isPartiallyCancelled = booking.bookingStatus === 'PARTIALLY_CANCELLED';

        return (
          <div
            key={booking.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-xs ${
              isCancelled
                ? 'border-red-200 dark:border-red-950 opacity-80'
                : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PNR Number</span>
                  <span className="font-mono font-bold text-base text-orange-600">{booking.pnr}</span>
                </div>
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {booking.trainNumber} - {booking.trainName}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Class: <strong>{booking.travelClass}</strong> &middot; Quota: <strong>{booking.quota}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  booking.bookingStatus === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : isCancelled
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {booking.bookingStatus}
                </span>
              </div>
            </div>

            {/* Journey Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs text-slate-700 dark:text-slate-300">
              <div className="sm:col-span-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">From</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking.sourceName} ({booking.sourceCode})</span>
                <div className="text-[11px] text-slate-500 font-mono">Dep: {booking.departureTime}</div>
              </div>

              <div className="sm:col-span-4 text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Journey Date</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{booking.journeyDate}</span>
                <div className="text-[10px] text-slate-400">{booking.duration}</div>
              </div>

              <div className="sm:col-span-4 sm:text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">To</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking.destinationName} ({booking.destinationCode})</span>
                <div className="text-[11px] text-slate-500 font-mono">Arr: {booking.arrivalTime}</div>
              </div>
            </div>

            {/* Passengers & Seat Badges */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Passengers:</span>
                {booking.passengers.map(p => (
                  <span
                    key={p.id}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                      p.isCancelled
                        ? 'bg-red-50 text-red-600 line-through'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {p.name} ({p.status === 'CNF' ? `${p.allocatedCoach}-${p.allocatedBerth}` : p.status})
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Fare:</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  ₹{booking.grandTotal}
                </span>

                {!isCancelled && (
                  <button
                    onClick={() => onCancelTicket(booking)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition ml-1"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => onViewTicket(booking)}
                  className="px-4 py-1.5 rounded-lg bg-[#0f2e5a] hover:bg-[#153e78] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View ERS Slip</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
