import React, { useState } from 'react';
import { Search, ArrowRightLeft, Calendar, ShieldCheck, MapPin, Sparkles, Filter } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Station, Quota, ClassCode } from '../types/railway';

interface TrainSearchProps {
  onSearch: (params: {
    sourceCode: string;
    destCode: string;
    journeyDate: string;
    quota: Quota;
    selectedClass: string;
  }) => void;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({ onSearch }) => {
  const stations = storageService.getStations();

  const [sourceCode, setSourceCode] = useState('NDLS');
  const [destCode, setDestCode] = useState('MMCT');
  const [journeyDate, setJourneyDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
  );
  const [quota, setQuota] = useState<Quota>('GN');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Popular routes for 1-click test
  const popularRoutes = [
    { label: 'Delhi ⇄ Mumbai', src: 'NDLS', dst: 'MMCT' },
    { label: 'Delhi ⇄ Varanasi', src: 'NDLS', dst: 'BSB' },
    { label: 'Delhi ⇄ Howrah', src: 'NDLS', dst: 'HWH' },
    { label: 'Delhi ⇄ Lucknow', src: 'NDLS', dst: 'LKO' },
    { label: 'Bengaluru ⇄ Chennai', src: 'SBC', dst: 'MAS' },
    { label: 'Delhi ⇄ Darbhanga', src: 'NDLS', dst: 'DBG' },
  ];

  const handleSwap = () => {
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      sourceCode,
      destCode,
      journeyDate,
      quota,
      selectedClass,
    });
  };

  const setDateOffset = (days: number) => {
    const d = new Date(Date.now() + days * 86400000);
    setJourneyDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Top Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <h2 className="text-base font-extrabold text-[#0f2e5a] dark:text-blue-400">
            Book Train Tickets
          </h2>
          <span className="text-xs text-slate-500">&middot; Fast, Real-time Indian Railways PRS</span>
        </div>

        {/* Quota Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Quota:</span>
          {(['GN', 'TQ', 'LD', 'SS'] as Quota[]).map(q => {
            const labels: Record<Quota, string> = {
              GN: 'General',
              TQ: 'Tatkal',
              PT: 'Premium Tatkal',
              LD: 'Ladies',
              SS: 'Senior Citizen',
              HP: 'Divyangjan',
            };
            return (
              <button
                key={q}
                type="button"
                onClick={() => setQuota(q)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  quota === q
                    ? 'bg-[#0f2e5a] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {labels[q]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin Station */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>From Station</span>
            </label>
            <select
              value={sourceCode}
              onChange={e => setSourceCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {stations.map(st => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code}) - {st.city}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-orange-50 hover:border-orange-400 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition shadow-xs cursor-pointer"
              title="Swap From and To"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Station */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>To Station</span>
            </label>
            <select
              value={destCode}
              onChange={e => setDestCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {stations.map(st => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code}) - {st.city}
                </option>
              ))}
            </select>
          </div>

          {/* Journey Date */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date of Journey</span>
            </label>
            <input
              type="date"
              value={journeyDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setJourneyDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Date Pills & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Quick Dates:</span>
            <button
              type="button"
              onClick={() => setDateOffset(0)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateOffset(1)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDateOffset(2)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium"
            >
              +2 Days
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Class:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="SL">Sleeper (SL)</option>
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Trains &amp; Check Availability</span>
          </button>
        </div>
      </form>

      {/* 1-Click Popular Routes Ribbon */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Popular Routes:
        </span>
        {popularRoutes.map(r => (
          <button
            key={r.label}
            type="button"
            onClick={() => {
              setSourceCode(r.src);
              setDestCode(r.dst);
              onSearch({
                sourceCode: r.src,
                destCode: r.dst,
                journeyDate,
                quota,
                selectedClass,
              });
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition border border-transparent"
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};
