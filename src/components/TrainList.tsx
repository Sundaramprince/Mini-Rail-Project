import React, { useState } from 'react';
import { Train as TrainIcon, Clock, ArrowRight, Utensils, Info, CheckCircle2, ChevronDown, ChevronUp, MapPin, Compass } from 'lucide-react';
import { Train, ClassCode, Quota } from '../types/railway';

interface TrainListProps {
  trains: Train[];
  journeyDate: string;
  quota: Quota;
  onBookTrain: (train: Train, selectedClass: ClassCode) => void;
  onOpenMap?: (train: Train) => void;
}

export const TrainList: React.FC<TrainListProps> = ({
  trains,
  journeyDate,
  quota,
  onBookTrain,
  onOpenMap,
}) => {
  const [selectedClassesByTrain, setSelectedClassesByTrain] = useState<Record<string, ClassCode>>({});
  const [expandedRouteTrainId, setExpandedRouteTrainId] = useState<string | null>(null);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleSelectClass = (trainId: string, classCode: ClassCode) => {
    setSelectedClassesByTrain({
      ...selectedClassesByTrain,
      [trainId]: classCode,
    });
  };

  const toggleRouteExpand = (trainId: string) => {
    setExpandedRouteTrainId(expandedRouteTrainId === trainId ? null : trainId);
  };

  if (trains.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
        <TrainIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">No Direct Trains Found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No scheduled trains found between selected stations on this date. Try changing the journey date or picking a major junction like Delhi (NDLS), Mumbai (MMCT), or Varanasi (BSB).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
        <span>Showing <strong>{trains.length}</strong> available train{trains.length > 1 ? 's' : ''}</span>
        <span>Quota: <strong className="text-slate-800 dark:text-slate-200 uppercase">{quota === 'TQ' ? 'Tatkal' : 'General'}</strong></span>
      </div>

      {trains.map(train => {
        const availableClasses = Object.keys(train.classes) as ClassCode[];
        const activeClass = selectedClassesByTrain[train.id] || availableClasses[0];
        const isRouteExpanded = expandedRouteTrainId === train.id;

        return (
          <div
            key={train.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Train Header Info Ribbon */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#0f2e5a] dark:text-blue-400 font-mono tracking-tight">
                    {train.trainNumber}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {train.trainName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {train.trainType.replace(/_/g, ' ')}
                  </span>
                  {train.pantryAvailable && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      Pantry Car
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                  <span>Runs On:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[10px]">
                    {daysOfWeek.map((day, idx) => {
                      const runs = train.runsOnDays.includes(idx);
                      return (
                        <span
                          key={idx}
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            runs
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Route & Map Actions */}
              <div className="flex items-center gap-3">
                {onOpenMap && (
                  <button
                    type="button"
                    onClick={() => onOpenMap(train)}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View on Google Map</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleRouteExpand(train.id)}
                  className="text-xs font-semibold text-[#0f2e5a] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isRouteExpanded ? 'Hide Route' : 'View Timetable & Stops'}</span>
                  {isRouteExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Timings & Duration Banner */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
              {/* Departure */}
              <div className="md:col-span-4">
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {train.departureTime}
                </div>
                <div className="text-xs font-bold text-[#0f2e5a] dark:text-blue-300">
                  {train.sourceName} ({train.sourceCode})
                </div>
                <div className="text-[11px] text-slate-500">
                  {new Date(journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                </div>
              </div>

              {/* Duration and distance line */}
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-500 font-mono mb-1">{train.duration}</span>
                <div className="w-full flex items-center justify-center gap-1 text-slate-300 dark:text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <div className="flex-1 h-[2px] bg-slate-300 dark:bg-slate-700 relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium">
                      {train.distanceKm} km
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  {train.route ? `${train.route.length} stops` : 'Direct Express'}
                </span>
              </div>

              {/* Arrival */}
              <div className="md:col-span-4 md:text-right">
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {train.arrivalTime}
                </div>
                <div className="text-xs font-bold text-[#0f2e5a] dark:text-blue-300">
                  {train.destinationName} ({train.destinationCode})
                </div>
                <div className="text-[11px] text-slate-500">
                  Platform {train.route?.[train.route.length - 1]?.platform || '1'}
                </div>
              </div>
            </div>

            {/* Class Cards & Availability Selector */}
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {availableClasses.map(code => {
                  const classInfo = train.classes[code];
                  const isSelected = activeClass === code;
                  const isAvailable = classInfo.availableSeats > 0;
                  const isRac = !isAvailable && classInfo.racSeats > 0;

                  return (
                    <div
                      key={code}
                      onClick={() => handleSelectClass(train.id, code)}
                      className={`p-3 rounded-xl border cursor-pointer transition min-w-[150px] flex-1 sm:flex-initial ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {code}
                        </span>
                        <span className="font-mono font-bold text-xs text-[#0f2e5a] dark:text-blue-400">
                          ₹{classInfo.baseFare}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono font-bold">
                        {isAvailable ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            AVAILABLE-{classInfo.availableSeats}
                          </span>
                        ) : isRac ? (
                          <span className="text-orange-600 dark:text-orange-400">
                            RAC-{classInfo.racSeats}
                          </span>
                        ) : (
                          <span className="text-red-500">
                            WL-{classInfo.wlSeats || 5}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {classInfo.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free cancellation up to 48 hrs before departure</span>
                </div>

                <button
                  type="button"
                  onClick={() => onBookTrain(train, activeClass)}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book {activeClass} (₹{train.classes[activeClass]?.baseFare || 1000})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Route Schedule Drawer */}
            {isRouteExpanded && train.route && (
              <div className="bg-slate-100 dark:bg-slate-950/80 p-5 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
                  Full Route Timetable &middot; {train.trainNumber} {train.trainName}
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Station Name (Code)</th>
                        <th className="py-2 px-3 font-mono">Arr.</th>
                        <th className="py-2 px-3 font-mono">Dep.</th>
                        <th className="py-2 px-3">Halt</th>
                        <th className="py-2 px-3">Distance</th>
                        <th className="py-2 px-3">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {train.route.map((st, i) => (
                        <tr key={st.stationCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2 px-3 font-mono text-slate-400">{i + 1}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                            {st.stationName} ({st.stationCode})
                          </td>
                          <td className="py-2 px-3 font-mono">{st.arrivalTime}</td>
                          <td className="py-2 px-3 font-mono">{st.departureTime}</td>
                          <td className="py-2 px-3">{st.haltMinutes > 0 ? `${st.haltMinutes}m` : '--'}</td>
                          <td className="py-2 px-3 font-mono">{st.distanceKm} km</td>
                          <td className="py-2 px-3 font-mono font-bold text-orange-600">PF #{st.platform}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
