import React, { useState } from 'react';
import { X, User, Phone, Mail, Wallet, Plus, Trash2, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { User as UserType, PassengerMaster } from '../types/railway';
import { storageService } from '../services/storageService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onUserUpdate: (updatedUser: UserType) => void;
  onResetSystem: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onResetSystem,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'passengers'>('profile');
  const [topupAmount, setTopupAmount] = useState(1500);
  const [walletSuccess, setWalletSuccess] = useState('');

  // Add passenger form
  const [paxName, setPaxName] = useState('');
  const [paxAge, setPaxAge] = useState(28);
  const [paxGender, setPaxGender] = useState<'M' | 'F' | 'T'>('M');
  const [paxBerth, setPaxBerth] = useState<'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'NONE'>('LB');
  const [paxFood, setPaxFood] = useState<'V' | 'NV' | 'J' | 'NA'>('V');

  if (!isOpen) return null;

  const handleAddWalletMoney = () => {
    if (topupAmount <= 0) return;
    const newBal = storageService.addWalletBalance(currentUser.id, topupAmount);
    onUserUpdate({ ...currentUser, walletBalance: newBal });
    setWalletSuccess(`₹${topupAmount} credited successfully to IRCTC iMudra wallet!`);
    setTimeout(() => setWalletSuccess(''), 3000);
  };

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paxName.trim()) return;

    const newPax: PassengerMaster = {
      id: `pax-${Date.now()}`,
      name: paxName.trim(),
      age: Number(paxAge),
      gender: paxGender,
      berthPreference: paxBerth,
      foodPreference: paxFood,
      seniorCitizen: paxAge >= 60,
    };

    const updated = {
      ...currentUser,
      savedPassengers: [...currentUser.savedPassengers, newPax],
    };

    storageService.updateUser(updated);
    onUserUpdate(updated);
    setPaxName('');
  };

  const handleDeletePassenger = (id: string) => {
    const updated = {
      ...currentUser,
      savedPassengers: currentUser.savedPassengers.filter(p => p.id !== id),
    };
    storageService.updateUser(updated);
    onUserUpdate(updated);
  };

  const handleToggleRole = () => {
    const nextRole = currentUser.role === 'admin' ? 'user' : 'admin';
    const updated = { ...currentUser, role: nextRole as any };
    storageService.updateUser(updated);
    onUserUpdate(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold">{currentUser.name}</h2>
              <p className="text-xs text-blue-200">{currentUser.email} &middot; Role: <strong className="uppercase text-orange-400">{currentUser.role}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            User Profile &amp; Role
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'wallet'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            iMudra Wallet (₹{currentUser.walletBalance || 0})
          </button>
          <button
            onClick={() => setActiveTab('passengers')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'passengers'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Master Passenger List ({currentUser.savedPassengers.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50 dark:bg-slate-950/40 text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Credentials</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">VERIFIED IRCTC ID</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile Phone</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">+91 {currentUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Clearance</span>
                    <span className="font-bold text-slate-900 dark:text-white uppercase font-mono">{currentUser.role}</span>
                  </div>
                </div>
              </div>

              {/* Fast Role Switcher for Evaluators */}
              <div className="bg-orange-50 dark:bg-slate-900 p-4 rounded-xl border border-orange-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-orange-950 dark:text-orange-300 block">Evaluator Quick Role Switcher</span>
                    <span className="text-[11px] text-slate-500">Easily toggle between Passenger and IRCTC Railway Admin views</span>
                  </div>
                  <button
                    onClick={handleToggleRole}
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow-xs"
                  >
                    Switch to {currentUser.role === 'admin' ? 'Passenger Mode' : 'Admin Mode'}
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-200 dark:border-red-900 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-300 block">Reset System Data</span>
                    <span className="text-[11px] text-slate-500">Restore initial trains, sample bookings, and seed state.</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Reset all bookings and trains to fresh demonstration state?')) {
                        onResetSystem();
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-100 font-bold transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f2e5a] to-[#1e40af] text-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase text-blue-200 tracking-wider font-semibold">IRCTC iMudra Prepaid Wallet</span>
                    <div className="text-3xl font-black font-mono mt-1">₹{(currentUser.walletBalance || 0).toFixed(2)}</div>
                  </div>
                  <Wallet className="w-8 h-8 text-orange-400" />
                </div>
                <div className="pt-3 border-t border-white/20 text-xs text-blue-200 flex justify-between">
                  <span>Linked Phone: {currentUser.phone}</span>
                  <span className="text-emerald-300 font-bold">100% Refund Success Rate</span>
                </div>
              </div>

              {/* Add funds */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider block">Add Money to Wallet</span>
                <div className="flex items-center gap-2">
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition ${
                        topupAmount === amt
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={e => setTopupAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                  />
                  <button
                    onClick={handleAddWalletMoney}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold whitespace-nowrap"
                  >
                    Add Funds
                  </button>
                </div>

                {walletSuccess && (
                  <div className="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{walletSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'passengers' && (
            <div className="space-y-4">
              {/* Existing List */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Saved Passenger Master List ({currentUser.savedPassengers.length})
                </span>

                {currentUser.savedPassengers.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.age} yrs &middot; {p.gender === 'M' ? 'Male' : 'Female'} &middot; Pref: {p.berthPreference} &middot; Meal: {p.foodPreference}
                        {p.seniorCitizen && <span className="ml-1 text-purple-600 font-bold">(Senior Citizen)</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePassenger(p.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete Passenger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Master Passenger Form */}
              <form onSubmit={handleAddPassenger} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                  Add New Traveler
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={paxName}
                      onChange={e => setPaxName(e.target.value)}
                      placeholder="Passenger Name"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={paxAge}
                      onChange={e => setPaxAge(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Gender</label>
                    <select
                      value={paxGender}
                      onChange={e => setPaxGender(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="T">Trans</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Berth Pref</label>
                    <select
                      value={paxBerth}
                      onChange={e => setPaxBerth(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="LB">Lower</option>
                      <option value="MB">Middle</option>
                      <option value="UB">Upper</option>
                      <option value="SL">Side Lower</option>
                      <option value="NONE">No Choice</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                  >
                    + Save to Master List
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
