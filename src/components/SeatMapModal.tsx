import React, { useState } from 'react';
import { X, Check, Info } from 'lucide-react';
import { Train, ClassCode } from '../types/railway';

interface SeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: Train;
  selectedClass: ClassCode;
  passengerCount: number;
  onConfirmSeats: (selectedSeats: Array<{ berthNum: number; berthType: string }>) => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  isOpen,
  onClose,
  train,
  selectedClass,
  passengerCount,
  onConfirmSeats,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Array<{ berthNum: number; berthType: string }>>([]);

  if (!isOpen) return null;

  const isChairCar = selectedClass === 'CC' || selectedClass === 'EC';
  const totalBerths = isChairCar ? 60 : 72;

  // Pre-occupied seat simulator (seed deterministic)
  const isOccupied = (num: number) => {
    return (num * 7 + 13) % 5 === 0 || (num % 6 === 2);
  };

  const getBerthType = (num: number): string => {
    if (isChairCar) {
      const col = num % 5;
      if (col === 1 || col === 0) return 'Window';
      if (col === 2 || col === 4) return 'Aisle';
      return 'Middle';
    }
    const mod = num % 8;
    if (mod === 1 || mod === 4) return 'Lower (LB)';
    if (mod === 2 || mod === 5) return 'Middle (MB)';
    if (mod === 3 || mod === 6) return 'Upper (UB)';
    if (mod === 7) return 'Side Lower (SL)';
    return 'Side Upper (SU)';
  };

  const handleSeatClick = (berthNum: number) => {
    if (isOccupied(berthNum)) return;

    const exists = selectedSeats.find(s => s.berthNum === berthNum);
    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => s.berthNum !== berthNum));
    } else {
      if (selectedSeats.length >= passengerCount) {
        // replace first
        setSelectedSeats([...selectedSeats.slice(1), { berthNum, berthType: getBerthType(berthNum) }]);
      } else {
        setSelectedSeats([...selectedSeats, { berthNum, berthType: getBerthType(berthNum) }]);
      }
    }
  };

  const handleApply = () => {
    onConfirmSeats(selectedSeats);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>Interactive Coach Seat Layout</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500 text-white font-medium">Coach B3 &middot; {selectedClass}</span>
            </h2>
            <p className="text-xs text-blue-200">
              {train.trainNumber} {train.trainName} &middot; Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} for your passenger(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-orange-500 border border-orange-600"></span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Your Selection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-700 border border-slate-400"></span>
            <span className="text-slate-500">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-indigo-100 border border-indigo-400"></span>
            <span className="text-indigo-700 dark:text-indigo-300">Senior Priority (LB)</span>
          </div>
          <div className="ml-auto text-xs text-slate-500 font-medium">
            Selected: <span className="font-bold text-orange-600 dark:text-orange-400">{selectedSeats.length}</span> of {passengerCount}
          </div>
        </div>

        {/* Coach Layout Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950/50">
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-300 dark:border-slate-800 shadow-sm">
            {/* Coach Vestibule entry */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800">ENTRY DOOR / TOILET</span>
              <span className="tracking-widest font-mono text-slate-400">&larr; ENGINE DIRECTION &larr;</span>
              <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800">VESTIBULE</span>
            </div>

            {/* Grid of Seats */}
            {!isChairCar ? (
              // Sleeper / 3A layout (Coupes of 8)
              <div className="space-y-6">
                {Array.from({ length: Math.ceil(totalBerths / 8) }).map((_, coupeIdx) => {
                  const base = coupeIdx * 8;
                  const coupeBerths = [
                    base + 1, // LB
                    base + 2, // MB
                    base + 3, // UB
                    base + 4, // LB
                    base + 5, // MB
                    base + 6, // UB
                    base + 7, // SL
                    base + 8, // SU
                  ];

                  return (
                    <div
                      key={coupeIdx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 relative"
                    >
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                        BAY #{coupeIdx + 1} (Berths {base + 1} - {Math.min(base + 8, totalBerths)})
                      </div>

                      <div className="grid grid-cols-12 gap-2 items-center">
                        {/* Main Cabin: 6 berths (3 left, 3 right) */}
                        <div className="col-span-8 grid grid-cols-3 gap-2">
                          {coupeBerths.slice(0, 6).map(num => {
                            if (num > totalBerths) return null;
                            const occupied = isOccupied(num);
                            const isSelected = selectedSeats.some(s => s.berthNum === num);
                            const type = getBerthType(num);
                            const isLower = type.includes('Lower');

                            return (
                              <button
                                key={num}
                                type="button"
                                disabled={occupied}
                                onClick={() => handleSeatClick(num)}
                                className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center min-h-[58px] ${
                                  occupied
                                    ? 'bg-slate-200 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                                    : isSelected
                                    ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-105'
                                    : isLower
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                <span className="text-xs font-bold font-mono">{num}</span>
                                <span className="text-[10px] leading-tight font-medium mt-0.5 opacity-90">{type.replace(' Berth', '')}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Gangway / Aisle */}
                        <div className="col-span-1 flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono rotate-90 select-none">
                          AISLE
                        </div>

                        {/* Side berths (SL, SU) */}
                        <div className="col-span-3 flex flex-col gap-2">
                          {coupeBerths.slice(6, 8).map(num => {
                            if (num > totalBerths) return null;
                            const occupied = isOccupied(num);
                            const isSelected = selectedSeats.some(s => s.berthNum === num);
                            const type = getBerthType(num);

                            return (
                              <button
                                key={num}
                                type="button"
                                disabled={occupied}
                                onClick={() => handleSeatClick(num)}
                                className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center min-h-[58px] ${
                                  occupied
                                    ? 'bg-slate-200 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                                    : isSelected
                                    ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-105'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                <span className="text-xs font-bold font-mono">{num}</span>
                                <span className="text-[10px] leading-tight font-medium mt-0.5 opacity-90">{type}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Chair Car Layout (3x2)
              <div className="space-y-3">
                {Array.from({ length: 12 }).map((_, row) => {
                  const leftSeats = [row * 5 + 1, row * 5 + 2, row * 5 + 3];
                  const rightSeats = [row * 5 + 4, row * 5 + 5];

                  return (
                    <div key={row} className="flex items-center gap-3">
                      <span className="w-6 text-[10px] font-mono text-slate-400">R{row + 1}</span>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {leftSeats.map(num => {
                          const occupied = isOccupied(num);
                          const isSelected = selectedSeats.some(s => s.berthNum === num);
                          return (
                            <button
                              key={num}
                              type="button"
                              disabled={occupied}
                              onClick={() => handleSeatClick(num)}
                              className={`p-2 rounded-lg border text-center text-xs font-mono font-bold transition ${
                                occupied
                                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-orange-500 border-orange-600 text-white shadow-sm'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-8 text-[10px] text-center text-slate-400 font-mono">|</div>

                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {rightSeats.map(num => {
                          const occupied = isOccupied(num);
                          const isSelected = selectedSeats.some(s => s.berthNum === num);
                          return (
                            <button
                              key={num}
                              type="button"
                              disabled={occupied}
                              onClick={() => handleSeatClick(num)}
                              className={`p-2 rounded-lg border text-center text-xs font-mono font-bold transition ${
                                occupied
                                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-orange-500 border-orange-600 text-white shadow-sm'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {selectedSeats.length > 0 ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Selected: <strong>{selectedSeats.map(s => `${s.berthNum} (${s.berthType})`).join(', ')}</strong>
              </span>
            ) : (
              <span>No seat chosen. System will auto-assign best contiguous berths upon booking.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={selectedSeats.length === 0}
              className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              Confirm Selection ({selectedSeats.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
