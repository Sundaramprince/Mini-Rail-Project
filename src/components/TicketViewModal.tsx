import React, { useState } from 'react';
import { X, Printer, Mail, Download, CheckCircle2, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react';
import { Booking } from '../types/railway';

interface TicketViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onInitiateCancel?: (booking: Booking) => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onInitiateCancel,
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const isPartiallyCancelled = booking.bookingStatus === 'PARTIALLY_CANCELLED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top bar (Hidden when printed) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-[#0f2e5a] text-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-wide">Electronic Reservation Slip (ERS)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-500 font-semibold uppercase">IRCTC Official</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => setShowEmailPreview(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              title="Email Ticket"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email sent notification alert */}
        {emailSent && (
          <div className="print:hidden bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-center gap-2 font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ticket confirmation sent successfully to {booking.userEmail}!</span>
          </div>
        )}

        {/* E-Ticket Canvas (Authentic IRCTC Reservation Slip) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 text-slate-900 font-sans print:p-0 print:bg-white">
          <div className="bg-white border-2 border-slate-300 rounded-lg p-6 shadow-xs relative print:border-none print:shadow-none">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none text-6xl font-black rotate-[-25deg] text-blue-950">
              INDIAN RAILWAYS · IRCTC
            </div>

            {/* Header: IRCTC / Indian Railways */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0f2e5a] flex items-center justify-center text-white font-extrabold text-sm border-2 border-orange-500">
                  IR
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-[#0f2e5a] tracking-tight">INDIAN RAILWAYS PASSENGER RESERVATION SYSTEM</h1>
                  <p className="text-[11px] text-slate-600 font-semibold">IRCTC e-Ticketing Electronic Reservation Slip (Record Slip)</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-500">PNR NUMBER</div>
                <div className="text-xl font-mono font-black text-orange-600 tracking-wider">{booking.pnr}</div>
              </div>
            </div>

            {/* Cancellation Banner if cancelled */}
            {isCancelled && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 flex items-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>THIS TICKET HAS BEEN CANCELLED. REFUND HAS BEEN PROCESSED TO SOURCE WALLET.</span>
              </div>
            )}

            {isPartiallyCancelled && (
              <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded text-amber-800 flex items-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>THIS TICKET IS PARTIALLY CANCELLED. REFER TO PASSENGER STATUS BELOW.</span>
              </div>
            )}

            {/* Journey Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 p-3.5 rounded-lg border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Train Number &amp; Name</span>
                <span className="font-bold text-slate-900">{booking.trainNumber} / {booking.trainName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class &amp; Quota</span>
                <span className="font-bold text-slate-900">{booking.travelClass} &middot; {booking.quota === 'TQ' ? 'Tatkal (TQ)' : 'General (GN)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date of Journey</span>
                <span className="font-bold text-slate-900">{new Date(booking.journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Booking Date</span>
                <span className="font-bold text-slate-900">{booking.bookingDate}</span>
              </div>
            </div>

            {/* Origin & Destination Route Card */}
            <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-3.5 mb-4 text-xs bg-white">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Boarding From</div>
                <div className="text-base font-bold text-[#0f2e5a]">{booking.sourceName} ({booking.sourceCode})</div>
                <div className="text-slate-600 mt-0.5">Scheduled Departure: <strong>{booking.departureTime} hrs</strong></div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">To Station</div>
                <div className="text-base font-bold text-[#0f2e5a]">{booking.destinationName} ({booking.destinationCode})</div>
                <div className="text-slate-600 mt-0.5">Scheduled Arrival: <strong>{booking.arrivalTime} hrs</strong></div>
              </div>
            </div>

            {/* Passenger Details Table */}
            <div className="mb-4 overflow-hidden border border-slate-300 rounded-lg">
              <div className="bg-[#0f2e5a] text-white px-3 py-1.5 text-xs font-bold flex justify-between">
                <span>PASSENGER DETAILS</span>
                <span>CHART STATUS: {booking.chartStatus.replace(/_/g, ' ')}</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Passenger Name</th>
                    <th className="py-2 px-3">Age / Gender</th>
                    <th className="py-2 px-3">Booking Status</th>
                    <th className="py-2 px-3">Current Status</th>
                    <th className="py-2 px-3">Meal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {booking.passengers.map((pax, index) => {
                    const isPaxCancelled = pax.isCancelled;
                    return (
                      <tr key={pax.id} className={isPaxCancelled ? 'bg-red-50 text-slate-400 line-through' : 'hover:bg-slate-50'}>
                        <td className="py-2 px-3 font-mono font-medium">{index + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{pax.name}</td>
                        <td className="py-2 px-3">{pax.age} / {pax.gender}</td>
                        <td className="py-2 px-3 font-mono">
                          {isPaxCancelled ? (
                            <span className="text-red-600 font-semibold">CANCELLED</span>
                          ) : (
                            <span>{pax.status} / {pax.allocatedCoach} / {pax.allocatedBerth} / {pax.allocatedBerthType}</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold">
                          {isPaxCancelled ? (
                            <span className="text-red-500">CAN</span>
                          ) : pax.status === 'CNF' ? (
                            <span className="text-emerald-700">CNF / {pax.allocatedCoach}-{pax.allocatedBerth}</span>
                          ) : (
                            <span className="text-orange-600">{pax.status} {pax.statusNumber}</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{pax.foodPreference || 'Veg'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Fare Breakdown & QR Code section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-300 rounded-lg p-4 bg-slate-50 mb-4">
              {/* Fare Table */}
              <div className="md:col-span-8 space-y-1.5 text-xs">
                <div className="font-bold text-[#0f2e5a] text-xs uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                  Payment &amp; Fare Breakdown
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ticket Base Fare ({booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}):</span>
                  <span className="font-mono">₹{booking.baseFareTotal.toFixed(2)}</span>
                </div>
                {booking.tatkalCharge > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tatkal Premium Charges:</span>
                    <span className="font-mono">₹{booking.tatkalCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>IRCTC Convenience Fee:</span>
                  <span className="font-mono">₹{booking.convenienceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (CGST + SGST 5%):</span>
                  <span className="font-mono">₹{booking.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-300">
                  <span>Total Fare (all inclusive):</span>
                  <span className="font-mono text-base text-[#0f2e5a]">₹{booking.grandTotal.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Payment Mode: <strong>{booking.paymentMethod.replace(/_/g, ' ')}</strong> &middot; Transaction ID: <span className="font-mono">{booking.paymentId}</span>
                </div>
              </div>

              {/* QR Code and Barcode Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-slate-200">
                <div className="relative p-2 border-2 border-slate-900 rounded bg-white">
                  {/* High visual fidelity QR Code SVG */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    {/* Corner Squares */}
                    <rect x="5" y="5" width="28" height="28" fill="#000" />
                    <rect x="9" y="9" width="20" height="20" fill="#fff" />
                    <rect x="13" y="13" width="12" height="12" fill="#000" />

                    <rect x="67" y="5" width="28" height="28" fill="#000" />
                    <rect x="71" y="9" width="20" height="20" fill="#fff" />
                    <rect x="75" y="13" width="12" height="12" fill="#000" />

                    <rect x="5" y="67" width="28" height="28" fill="#000" />
                    <rect x="9" y="71" width="20" height="20" fill="#fff" />
                    <rect x="13" y="75" width="12" height="12" fill="#000" />

                    {/* QR Matrix Dots */}
                    <rect x="38" y="10" width="6" height="6" fill="#000" />
                    <rect x="48" y="10" width="6" height="6" fill="#000" />
                    <rect x="38" y="22" width="6" height="6" fill="#000" />
                    <rect x="52" y="24" width="6" height="6" fill="#000" />
                    <rect x="10" y="42" width="6" height="6" fill="#000" />
                    <rect x="22" y="42" width="6" height="6" fill="#000" />
                    <rect x="38" y="42" width="6" height="6" fill="#000" />
                    <rect x="48" y="42" width="6" height="6" fill="#000" />
                    <rect x="62" y="42" width="6" height="6" fill="#000" />
                    <rect x="76" y="42" width="6" height="6" fill="#000" />
                    <rect x="86" y="42" width="6" height="6" fill="#000" />

                    <rect x="38" y="56" width="6" height="6" fill="#000" />
                    <rect x="48" y="56" width="6" height="6" fill="#000" />
                    <rect x="62" y="56" width="6" height="6" fill="#000" />
                    <rect x="80" y="56" width="6" height="6" fill="#000" />

                    <rect x="38" y="72" width="6" height="6" fill="#000" />
                    <rect x="54" y="72" width="6" height="6" fill="#000" />
                    <rect x="70" y="72" width="6" height="6" fill="#000" />
                    <rect x="84" y="72" width="6" height="6" fill="#000" />

                    <rect x="38" y="86" width="6" height="6" fill="#000" />
                    <rect x="62" y="86" width="6" height="6" fill="#000" />
                    <rect x="76" y="86" width="6" height="6" fill="#000" />
                  </svg>
                </div>
                <div className="text-[10px] font-mono mt-1 text-slate-500 font-bold">VERIFIED TTE QR</div>
                {/* Barcode */}
                <div className="mt-2 flex items-center justify-center gap-[2px]">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: i % 3 === 0 ? '2px' : '1px',
                        height: '16px',
                      }}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">{booking.pnr}</div>
              </div>
            </div>

            {/* Instructions & Security Notice */}
            <div className="text-[10px] text-slate-500 space-y-1 border-t border-slate-200 pt-3">
              <p className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                IMPORTANT PASSENGER INSTRUCTIONS:
              </p>
              <p>1. One of the passengers booked on this E-ticket is required to present valid Original Identity Proof (Aadhaar Card, Voter ID, Passport, Driving License, PAN Card) along with this slip to the TTE during journey.</p>
              <p>2. Fully waitlisted e-tickets are dropped after chart preparation. Passengers are not permitted to board trains on fully waitlisted e-tickets.</p>
              <p>3. In case of train cancellation by Indian Railways, full refund is credited automatically without filing TDR.</p>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar (Hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-100 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Booked by: <strong>{booking.userName}</strong> ({booking.userPhone})
          </div>

          <div className="flex items-center gap-3">
            {!isCancelled && onInitiateCancel && (
              <button
                onClick={() => {
                  onClose();
                  onInitiateCancel(booking);
                }}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
              >
                Cancel Ticket &amp; Refund
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg bg-[#0f2e5a] hover:bg-[#153e78] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Electronic Slip
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Email Confirmation Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300">
            <div className="bg-[#0f2e5a] text-white px-5 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-sm">Simulated IRCTC Email Dispatcher</span>
              </div>
              <button onClick={() => setShowEmailPreview(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="bg-slate-100 p-2.5 rounded font-mono text-[11px] space-y-1">
                <div><strong>From:</strong> ticketadmin@irctc.co.in</div>
                <div><strong>To:</strong> {booking.userEmail}</div>
                <div><strong>Subject:</strong> Electronic Reservation Slip (ERS) - PNR: {booking.pnr}</div>
              </div>

              <div className="border border-slate-200 p-4 rounded-lg space-y-2 bg-slate-50/50">
                <p className="font-bold text-slate-900">Dear {booking.userName},</p>
                <p>Thank you for booking with Indian Railways IRCTC. Your ticket has been confirmed successfully.</p>
                <div className="bg-white p-3 rounded border border-slate-200 text-xs font-mono space-y-1">
                  <div>PNR: <strong>{booking.pnr}</strong></div>
                  <div>Train: <strong>{booking.trainNumber} - {booking.trainName}</strong></div>
                  <div>Date: <strong>{booking.journeyDate}</strong></div>
                  <div>Class: <strong>{booking.travelClass}</strong></div>
                  <div>Total Amount: <strong>₹{booking.grandTotal}</strong></div>
                </div>
                <p className="text-[11px] text-slate-500">The PDF version of your Electronic Reservation Slip is attached with this email.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    handleSendEmail();
                    setShowEmailPreview(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                >
                  Send Confirmation Email Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
