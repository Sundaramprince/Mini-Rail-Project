import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Booking, CancellationDetails } from '../types/railway';
import { storageService } from '../services/storageService';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onCancellationComplete: (cancellation: CancellationDetails) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onCancellationComplete,
}) => {
  const [selectedPaxIds, setSelectedPaxIds] = useState<string[]>([]);
  const [reason, setReason] = useState('Change of travel plan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !booking) return null;

  const activePassengers = booking.passengers.filter(p => !p.isCancelled);

  // Time calculations
  const now = new Date();
  const journeyDate = new Date(`${booking.journeyDate}T${booking.departureTime}:00`);
  const diffHours = Math.max(0, (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60));

  const perPaxFare = booking.baseFareTotal / booking.passengers.length;

  // Compute live estimate based on selected passengers
  const computeRefundPreview = () => {
    let deduction = 0;
    selectedPaxIds.forEach(id => {
      const pax = activePassengers.find(p => p.id === id);
      if (!pax) return;

      if (pax.status === 'WL' || pax.status === 'RAC') {
        deduction += 60; // Clerkage charge
      } else {
        if (diffHours > 48) {
          const flatMap: Record<string, number> = {
            '1A': 240, 'EC': 240, '2A': 200, '3A': 180, '3E': 180, 'CC': 180, 'SL': 120, '2S': 60,
          };
          deduction += flatMap[booking.travelClass] || 120;
        } else if (diffHours >= 12 && diffHours <= 48) {
          deduction += Math.max(120, Math.round(perPaxFare * 0.25));
        } else if (diffHours >= 4 && diffHours < 12) {
          deduction += Math.max(120, Math.round(perPaxFare * 0.5));
        } else {
          deduction += perPaxFare; // No refund if within 4 hours
        }
      }
    });

    const totalPaxFare = perPaxFare * selectedPaxIds.length;
    const estimatedRefund = Math.max(0, totalPaxFare - deduction);
    return { deduction, estimatedRefund, totalPaxFare };
  };

  const { deduction, estimatedRefund } = computeRefundPreview();

  const handleTogglePax = (id: string) => {
    if (selectedPaxIds.includes(id)) {
      setSelectedPaxIds(selectedPaxIds.filter(i => i !== id));
    } else {
      setSelectedPaxIds([...selectedPaxIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPaxIds.length === activePassengers.length) {
      setSelectedPaxIds([]);
    } else {
      setSelectedPaxIds(activePassengers.map(p => p.id));
    }
  };

  const handleConfirmCancel = () => {
    if (selectedPaxIds.length === 0) {
      setError('Please select at least one passenger to cancel.');
      return;
    }

    setIsProcessing(true);
    const res = storageService.cancelBooking(booking.id, selectedPaxIds, reason);
    setIsProcessing(false);

    if (res.success && res.cancellation) {
      onCancellationComplete(res.cancellation);
      onClose();
    } else {
      setError(res.error || 'Failed to cancel ticket');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-red-800 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-bold">Cancel Ticket &amp; Refund Request</h2>
              <p className="text-xs text-red-200">PNR: {booking.pnr} &middot; {booking.trainNumber} {booking.trainName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Departure proximity note */}
        <div className="px-6 py-3 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 flex items-center justify-between text-xs text-red-900 dark:text-red-300">
          <span>Time before scheduled departure: <strong>{diffHours.toFixed(1)} hours</strong></span>
          <span className="font-semibold px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/70 text-red-900 dark:text-red-200">
            {diffHours > 48 ? 'Rule: > 48 hrs (Flat Charge)' : diffHours >= 12 ? 'Rule: 12-48 hrs (25% Deduction)' : diffHours >= 4 ? 'Rule: 4-12 hrs (50% Deduction)' : 'Rule: < 4 hrs (Nil Refund)'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50 dark:bg-slate-950/40">
          {/* Passenger selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Passengers to Cancel
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                {selectedPaxIds.length === activePassengers.length ? 'Deselect All' : 'Select All Passengers'}
              </button>
            </div>

            <div className="space-y-2">
              {activePassengers.map(pax => {
                const isSelected = selectedPaxIds.includes(pax.id);
                return (
                  <div
                    key={pax.id}
                    onClick={() => handleTogglePax(pax.id)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by wrapper div
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{pax.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {pax.age} yrs &middot; {pax.gender} &middot; Seat: {pax.status} / {pax.allocatedCoach}-{pax.allocatedBerth}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₹{perPaxFare.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Cancellation
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Change of travel plan">Change of travel plan</option>
              <option value="Personal emergency">Personal emergency</option>
              <option value="Train delayed / reschedule">Train delayed / reschedule</option>
              <option value="Booked alternate conveyance">Booked alternate conveyance (Flight / Road)</option>
              <option value="Duplicate booking by mistake">Duplicate booking by mistake</option>
            </select>
          </div>

          {/* Refund Calculation Breakdown Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              Official IRCTC Refund Calculation
            </span>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Selected Passengers:</span>
              <span className="font-mono font-bold">{selectedPaxIds.length} of {activePassengers.length}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>IRCTC Cancellation Charges Deducted:</span>
              <span className="font-mono text-red-600 font-bold">- ₹{deduction.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-sm text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Net Refund Amount to IRCTC Wallet:</span>
              <span className="font-mono text-base font-black">₹{estimatedRefund.toFixed(2)}</span>
            </div>

            <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Refund is credited instantly to your IRCTC iMudra Wallet without any transaction fee.</span>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-600 font-semibold p-2.5 rounded bg-red-50 border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
          >
            Keep Ticket
          </button>

          <button
            onClick={handleConfirmCancel}
            disabled={selectedPaxIds.length === 0 || isProcessing}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <span>Confirm Cancellation (Refund ₹{estimatedRefund.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
