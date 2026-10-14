import React, { useState } from 'react';
import { Train, Navigation, Gauge, Clock, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Radio, Compass } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Train as TrainType } from '../types/railway';

interface LiveTrainTrackerProps {
  onOpenMap?: (train: TrainType) => void;
}

export const LiveTrainTracker: React.FC<LiveTrainTrackerProps> = ({ onOpenMap }) => {
  const trains = storageService.getTrains();
  const [selectedTrainNumber, setSelectedTrainNumber] = useState(trains[0]?.trainNumber || '22436');
  const [currentStationIndex, setCurrentStationIndex] = useState(1); // Simulated live position

  const activeTrain = storageService.getTrainByNumber(selectedTrainNumber) || trains[0];
  const liveStatus = storageService.getLiveTrainStatus(selectedTrainNumber);

  if (!activeTrain) return null;

  const stops = activeTrain.route || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tracker Banner Header */}
      <div className="p-6 rounded-2xl bg-[#0f2e5a] text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>National Train Enquiry System (NTES) Live GPS Feed</span>
            </div>
            <h2 className="text-2xl font-black mt-1">Live Train Running Status</h2>
            <p className="text-xs text-blue-200">
              Real-time GPS tracking, platform announcements, and delay predictions across Indian Railways.
            </p>
          </div>

          {/* Train Selector Dropdown */}
          <div className="min-w-[260px]">
            <label className="block text-[11px] font-semibold text-blue-200 mb-1">Select Train</label>
            <select
              value={selectedTrainNumber}
              onChange={e => {
                setSelectedTrainNumber(e.target.value);
                setCurrentStationIndex(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {trains.map(t => (
                <option key={t.id} value={t.trainNumber}>
                  {t.trainNumber} - {t.trainName} ({t.sourceCode} &rarr; {t.destinationCode})
                </option>
              ))}
            </select>

            {onOpenMap && (
              <button
                onClick={() => onOpenMap(activeTrain)}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-200" />
                <span>View Route on Google Maps</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Train Metric Badges */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-semibold">Running Status</span>
            <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Right Time (On Schedule)</span>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-semibold">Current Speed</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5 font-mono">
              <Gauge className="w-4 h-4 text-orange-400" />
              <span>{activeTrain.averageSpeedKmH} km/h</span>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-semibold">Current Station</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5 truncate">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">{stops[currentStationIndex]?.stationName || activeTrain.sourceName}</span>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-semibold">Platform Assigned</span>
            <div className="text-sm font-bold text-yellow-300 font-mono mt-0.5">
              PF #{stops[currentStationIndex]?.platform || '1'}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Control Pill */}
      <div className="p-3 bg-blue-50 dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <span className="font-medium">
          Simulate Train Movement along route:
        </span>
        <div className="flex items-center gap-1.5">
          {stops.map((stop, idx) => (
            <button
              key={stop.stationCode}
              onClick={() => setCurrentStationIndex(idx)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                currentStationIndex === idx
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {stop.stationCode}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Interactive Route Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center justify-between">
          <span>Route Stations &amp; Halts Timeline</span>
          <span className="text-xs normal-case text-slate-500 font-normal">
            Total Distance: {activeTrain.distanceKm} km &middot; {activeTrain.duration}
          </span>
        </h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-9 before:top-3 before:bottom-3 before:w-1 before:bg-slate-200 dark:before:bg-slate-800">
          {stops.map((stop, idx) => {
            const isPassed = idx < currentStationIndex;
            const isCurrent = idx === currentStationIndex;
            const isUpcoming = idx > currentStationIndex;

            return (
              <div key={stop.stationCode} className="relative flex items-start gap-4">
                {/* Station Node Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 z-10 transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white ring-4 ring-orange-200 dark:ring-orange-950 scale-125'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Train className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Station Info Content Card */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition ${
                    isCurrent
                      ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {stop.stationName}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          {stop.stationCode}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                            Train is here
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Day {stop.dayNumber} &middot; {stop.distanceKm} km from origin &middot; Platform {stop.platform}
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono">
                      <div className="text-slate-600 dark:text-slate-300">
                        Arr: <strong className="text-slate-900 dark:text-white">{stop.arrivalTime}</strong> &middot; Dep: <strong className="text-slate-900 dark:text-white">{stop.departureTime}</strong>
                      </div>
                      {stop.haltMinutes > 0 && (
                        <div className="text-[11px] text-orange-600 font-semibold">
                          Halt: {stop.haltMinutes} mins
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
