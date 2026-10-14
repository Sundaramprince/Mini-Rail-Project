import React, { useState } from 'react';
import { X, Plus, Trash2, Users, MapPin, Calendar, Clock, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { Train, ClassCode, Quota, User, Booking } from '../types/railway';
import { storageService } from '../services/storageService';
import { SeatMapModal } from './SeatMapModal';
import { PaymentModal } from './PaymentModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: Train;
  travelClass: ClassCode;
  quota: Quota;
  journeyDate: string;
  currentUser: User;
  onBookingComplete: (booking: Booking) => void;
}

interface FormPassenger {
  name: string;
  age: number | '';
  gender: 'M' | 'F' | 'T';
  berthPreference: string;
  foodPreference: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  train,
  travelClass,
  quota,
  journeyDate,
  currentUser,
  onBookingComplete,
}) => {
  const [passengers, setPassengers] = useState<FormPassenger[]>([
    {
      name: currentUser.savedPassengers[0]?.name || currentUser.name || '',
      age: currentUser.savedPassengers[0]?.age || 26,
      gender: currentUser.savedPassengers[0]?.gender || 'M',
      berthPreference: 'LB',
      foodPreference: 'Veg',
    },
  ]);

  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedSeatAssignments, setSelectedSeatAssignments] = useState<Array<{ berthNum: number; berthType: string }>>([]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const classInfo = train.classes[travelClass];
  const baseRate = classInfo?.baseFare || 800;
  const tatkalCharge = quota === 'TQ' ? Math.round(baseRate * 0.3) : 0;
  const paxCount = passengers.length;
  const baseTotal = (baseRate + tatkalCharge) * paxCount;
  const gst = Math.round(baseTotal * 0.05);
  const convenienceFee = 30;
  const grandTotal = baseTotal + gst + convenienceFee;

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      setFormError('Maximum 6 passengers allowed per booking.');
      return;
    }
    setPassengers([
      ...passengers,
      { name: '', age: '', gender: 'M', berthPreference: 'NONE', foodPreference: 'Veg' },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePaxChange = (index: number, field: keyof FormPassenger, val: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: val };
    setPassengers(updated);
  };

  const handleQuickAddSaved = (saved: any) => {
    if (passengers.length >= 6) return;
    // If first passenger is empty, replace it
    if (passengers.length === 1 && !passengers[0].name.trim()) {
      setPassengers([
        {
          name: saved.name,
          age: saved.age,
          gender: saved.gender,
          berthPreference: saved.berthPreference,
          foodPreference: saved.foodPreference === 'V' ? 'Veg' : 'Non-Veg',
        },
      ]);
    } else {
      setPassengers([
        ...passengers,
        {
          name: saved.name,
          age: saved.age,
          gender: saved.gender,
          berthPreference: saved.berthPreference,
          foodPreference: saved.foodPreference === 'V' ? 'Veg' : 'Non-Veg',
        },
      ]);
    }
  };

  const handleProceedToPayment = () => {
    // Validate
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setFormError(`Please enter a valid name for Passenger #${i + 1}`);
        return;
      }
      if (!p.age || Number(p.age) <= 0 || Number(p.age) > 120) {
        setFormError(`Please enter a valid age (1-120) for Passenger #${i + 1}`);
        return;
      }
    }
    setFormError('');
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (paymentMethod: 'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET') => {
    const res = storageService.createBooking({
      userId: currentUser.id,
      trainId: train.id,
      travelClass,
      quota,
      journeyDate,
      passengers: passengers.map(p => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender,
        berthPreference: p.berthPreference,
        foodPreference: p.foodPreference,
      })),
      paymentMethod,
    });

    if (res.success && res.booking) {
      setIsPaymentOpen(false);
      onClose();
      onBookingComplete(res.booking);
    } else {
      setFormError(res.error || 'Failed to complete booking');
      setIsPaymentOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Book Ticket &middot; {train.trainNumber} {train.trainName}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500 font-semibold uppercase">{travelClass} Class</span>
            </h2>
            <p className="text-xs text-blue-200">
              {train.sourceName} &rarr; {train.destinationName} &middot; Journey on {new Date(journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Snapshot Ribbon */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              Dep: {train.departureTime} | Arr: {train.arrivalTime} ({train.duration})
            </span>
            <span className="text-slate-400">|</span>
            <span>Quota: <strong>{quota === 'TQ' ? 'Tatkal' : 'General'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Seat Status:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              AVAILABLE-{classInfo?.availableSeats || 20}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
          {/* Quick-add saved passengers bar */}
          {currentUser.savedPassengers.length > 0 && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-900 border border-blue-200 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Quick-Add From Master Passenger List:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentUser.savedPassengers.map(sp => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleQuickAddSaved(sp)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition flex items-center gap-1"
                  >
                    <span>+ {sp.name} ({sp.age}, {sp.gender})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Passenger Input Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Passenger Details ({passengers.length}/6)
              </span>

              <button
                type="button"
                onClick={() => setIsSeatMapOpen(true)}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Choose on Coach Map</span>
              </button>
            </div>

            {selectedSeatAssignments.length > 0 && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Selected Seats: <strong>{selectedSeatAssignments.map(s => `${s.berthNum} (${s.berthType})`).join(', ')}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedSeatAssignments([])}
                  className="text-emerald-600 hover:underline text-[11px]"
                >
                  Clear Selection
                </button>
              </div>
            )}

            {passengers.map((pax, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#0f2e5a] dark:text-blue-400">
                    Passenger #{idx + 1}
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(idx)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Remove Passenger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Name */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Full Name (As on ID) *
                    </label>
                    <input
                      type="text"
                      value={pax.name}
                      onChange={e => handlePaxChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Age */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={pax.age}
                      onChange={e => handlePaxChange(idx, 'age', e.target.value)}
                      placeholder="Age"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Gender
                    </label>
                    <select
                      value={pax.gender}
                      onChange={e => handlePaxChange(idx, 'gender', e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="T">Transgender</option>
                    </select>
                  </div>

                  {/* Berth Preference */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Berth Pref.
                    </label>
                    <select
                      value={pax.berthPreference}
                      onChange={e => handlePaxChange(idx, 'berthPreference', e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="NONE">No Choice</option>
                      <option value="LB">Lower</option>
                      <option value="MB">Middle</option>
                      <option value="UB">Upper</option>
                      <option value="SL">Side Lower</option>
                      <option value="SU">Side Upper</option>
                    </select>
                  </div>

                  {/* Food Preference */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Catering / Meal
                    </label>
                    <select
                      value={pax.foodPreference}
                      onChange={e => handlePaxChange(idx, 'foodPreference', e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                      <option value="Jain">Jain Meal</option>
                      <option value="No-Food">No Food</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 6 && (
              <button
                type="button"
                onClick={handleAddPassenger}
                className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Passenger (Up to 6)</span>
              </button>
            )}
          </div>

          {/* Fare Summary Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              Fare Summary &amp; Taxes
            </span>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Base Fare (₹{baseRate} &times; {paxCount}):</span>
              <span className="font-mono">₹{baseRate * paxCount}</span>
            </div>
            {tatkalCharge > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tatkal Charge (₹{tatkalCharge} &times; {paxCount}):</span>
                <span className="font-mono">₹{tatkalCharge * paxCount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>IRCTC Convenience Fee (Non-refundable):</span>
              <span className="font-mono">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST (5% AC / Express Fare):</span>
              <span className="font-mono">₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#0f2e5a] dark:text-blue-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Grand Total Payable:</span>
              <span className="font-mono text-base font-black">₹{grandTotal}</span>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Contact: <strong>{currentUser.email}</strong> ({currentUser.phone})
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToPayment}
              className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Pay ₹{grandTotal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coach Seat Map Modal */}
      <SeatMapModal
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        train={train}
        selectedClass={travelClass}
        passengerCount={passengers.length}
        onConfirmSeats={seats => {
          setSelectedSeatAssignments(seats);
          // apply preferences
          const updated = [...passengers];
          seats.forEach((s, i) => {
            if (updated[i]) {
              const prefCode = s.berthType.includes('Lower') ? 'LB' : s.berthType.includes('Middle') ? 'MB' : s.berthType.includes('Upper') ? 'UB' : s.berthType.includes('Side Lower') ? 'SL' : 'SU';
              updated[i].berthPreference = prefCode;
            }
          });
          setPassengers(updated);
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={grandTotal}
        currentUser={currentUser}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
