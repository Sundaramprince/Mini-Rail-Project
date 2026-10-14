import React, { useState } from 'react';
import { Train as TrainIcon, Users, CreditCard, AlertTriangle, TrendingUp, Plus, Edit2, Trash2, Download, Search, Check, X, ShieldAlert, BarChart3, Clock, MapPin } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Train, Booking, TrainType, ClassCode } from '../types/railway';

interface AdminDashboardProps {
  onViewTicket: (booking: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewTicket }) => {
  const [trains, setTrains] = useState<Train[]>(storageService.getTrains());
  const [bookings, setBookings] = useState<Booking[]>(storageService.getBookings());
  const [activeTab, setActiveTab] = useState<'analytics' | 'trains' | 'bookings'>('analytics');

  // Filters & search
  const [searchPnr, setSearchPnr] = useState('');
  const [selectedTrainFilter, setSelectedTrainFilter] = useState('ALL');

  // Add/Edit Train Modal State
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);

  // Form State
  const [formTrainNumber, setFormTrainNumber] = useState('');
  const [formTrainName, setFormTrainName] = useState('');
  const [formTrainType, setFormTrainType] = useState<TrainType>('SUPERFAST');
  const [formSourceCode, setFormSourceCode] = useState('NDLS');
  const [formSourceName, setFormSourceName] = useState('New Delhi');
  const [formDestCode, setFormDestCode] = useState('MMCT');
  const [formDestName, setFormDestName] = useState('Mumbai Central');
  const [formDepTime, setFormDepTime] = useState('08:00');
  const [formArrTime, setFormArrTime] = useState('22:00');
  const [formDuration, setFormDuration] = useState('14h 00m');
  const [formDistance, setFormDistance] = useState(1200);
  const [formBaseFare3A, setFormBaseFare3A] = useState(1800);
  const [formBaseFareSL, setFormBaseFareSL] = useState(550);

  // Calculations for Analytics
  const totalRevenue = bookings.reduce((sum, b) => (b.bookingStatus !== 'CANCELLED' ? sum + b.grandTotal : sum), 0);
  const totalCancellations = bookings.filter(b => b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'PARTIALLY_CANCELLED').length;
  const totalPassengers = bookings.reduce((sum, b) => sum + b.passengers.length, 0);

  const refreshData = () => {
    setTrains([...storageService.getTrains()]);
    setBookings([...storageService.getBookings()]);
  };

  const handleOpenAddTrain = () => {
    setEditingTrain(null);
    setFormTrainNumber('');
    setFormTrainName('');
    setFormTrainType('SUPERFAST');
    setFormSourceCode('NDLS');
    setFormSourceName('New Delhi');
    setFormDestCode('MMCT');
    setFormDestName('Mumbai Central');
    setFormDepTime('07:00');
    setFormArrTime('21:00');
    setFormDuration('14h 00m');
    setFormDistance(1200);
    setFormBaseFare3A(1850);
    setFormBaseFareSL(580);
    setIsTrainModalOpen(true);
  };

  const handleOpenEditTrain = (train: Train) => {
    setEditingTrain(train);
    setFormTrainNumber(train.trainNumber);
    setFormTrainName(train.trainName);
    setFormTrainType(train.trainType);
    setFormSourceCode(train.sourceCode);
    setFormSourceName(train.sourceName);
    setFormDestCode(train.destinationCode);
    setFormDestName(train.destinationName);
    setFormDepTime(train.departureTime);
    setFormArrTime(train.arrivalTime);
    setFormDuration(train.duration);
    setFormDistance(train.distanceKm);
    setFormBaseFare3A(train.classes['3A']?.baseFare || 1800);
    setFormBaseFareSL(train.classes['SL']?.baseFare || 550);
    setIsTrainModalOpen(true);
  };

  const handleSaveTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTrainNumber || !formTrainName) return;

    if (editingTrain) {
      // Update
      const updated: Train = {
        ...editingTrain,
        trainNumber: formTrainNumber,
        trainName: formTrainName,
        trainType: formTrainType,
        sourceCode: formSourceCode,
        sourceName: formSourceName,
        destinationCode: formDestCode,
        destinationName: formDestName,
        departureTime: formDepTime,
        arrivalTime: formArrTime,
        duration: formDuration,
        distanceKm: Number(formDistance),
        classes: {
          ...editingTrain.classes,
          '3A': {
            code: '3A',
            name: 'AC 3 Tier',
            baseFare: Number(formBaseFare3A),
            totalSeats: 250,
            availableSeats: 48,
            racSeats: 10,
            wlSeats: 0,
          },
          'SL': {
            code: 'SL',
            name: 'Sleeper Class',
            baseFare: Number(formBaseFareSL),
            totalSeats: 450,
            availableSeats: 90,
            racSeats: 20,
            wlSeats: 0,
          },
        },
      };
      storageService.updateTrain(updated);
    } else {
      // Add
      const newTrain: Train = {
        id: `train-${formTrainNumber}`,
        trainNumber: formTrainNumber,
        trainName: formTrainName,
        trainType: formTrainType,
        sourceCode: formSourceCode,
        sourceName: formSourceName,
        destinationCode: formDestCode,
        destinationName: formDestName,
        departureTime: formDepTime,
        arrivalTime: formArrTime,
        duration: formDuration,
        distanceKm: Number(formDistance),
        runsOnDays: [0, 1, 2, 3, 4, 5, 6],
        averageSpeedKmH: 75,
        pantryAvailable: true,
        isActive: true,
        classes: {
          '3A': {
            code: '3A',
            name: 'AC 3 Tier',
            baseFare: Number(formBaseFare3A),
            totalSeats: 240,
            availableSeats: 60,
            racSeats: 12,
            wlSeats: 0,
          },
          'SL': {
            code: 'SL',
            name: 'Sleeper Class',
            baseFare: Number(formBaseFareSL),
            totalSeats: 480,
            availableSeats: 120,
            racSeats: 24,
            wlSeats: 0,
          },
        },
        route: [
          { stationCode: formSourceCode, stationName: formSourceName, arrivalTime: '--:--', departureTime: formDepTime, haltMinutes: 0, distanceKm: 0, dayNumber: 1, platform: '1' },
          { stationCode: formDestCode, stationName: formDestName, arrivalTime: formArrTime, departureTime: '--:--', haltMinutes: 0, distanceKm: Number(formDistance), dayNumber: 1, platform: '2' },
        ],
      };
      storageService.addTrain(newTrain);
    }

    setIsTrainModalOpen(false);
    refreshData();
  };

  const handleDeleteTrain = (id: string) => {
    if (confirm('Are you sure you want to decommission this train?')) {
      storageService.deleteTrain(id);
      refreshData();
    }
  };

  // Export Bookings CSV
  const handleExportCsv = () => {
    const headers = ['PNR', 'Train Number', 'Train Name', 'Date of Journey', 'Class', 'Passengers Count', 'Total Fare', 'Payment Mode', 'Status'];
    const rows = bookings.map(b => [
      b.pnr,
      b.trainNumber,
      `"${b.trainName}"`,
      b.journeyDate,
      b.travelClass,
      b.passengers.length,
      b.grandTotal,
      b.paymentMethod,
      b.bookingStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `irctc_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => {
    const matchPnr = !searchPnr || b.pnr.includes(searchPnr) || b.userName.toLowerCase().includes(searchPnr.toLowerCase());
    const matchTrain = selectedTrainFilter === 'ALL' || b.trainNumber === selectedTrainFilter;
    return matchPnr && matchTrain;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0f2e5a] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            <span>IRCTC Centre for Railway Information Systems (CRIS)</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Railway Administration &amp; Operations</h2>
          <p className="text-xs text-blue-200">
            Control center for train fleets, schedules, seat inventory allocation, and transaction audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={handleOpenAddTrain}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Train</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Fleet Trains</span>
            <TrainIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {trains.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            100% operational on grid
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Gross Ticket Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Across {bookings.length} reservations
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Passengers Transported</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {totalPassengers}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Avg 2.1 pax / ticket
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Cancellations &amp; TDR</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {totalCancellations}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">
            Processed via Wallet
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-xl px-4">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Operational Analytics
        </button>
        <button
          onClick={() => setActiveTab('trains')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'trains'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Fleet Management ({trains.length} Trains)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition ${
            activeTab === 'bookings'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Passenger Manifest ({bookings.length} Bookings)
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Seat Occupancy by Travel Class
            </h3>
            <div className="space-y-3">
              {[
                { classCode: '3A (AC 3 Tier)', pct: 88, color: 'bg-blue-600', count: '380 seats booked' },
                { classCode: '2A (AC 2 Tier)', pct: 76, color: 'bg-emerald-600', count: '120 seats booked' },
                { classCode: 'CC (AC Chair Car - Vande Bharat)', pct: 94, color: 'bg-orange-500', count: '240 seats booked' },
                { classCode: 'SL (Sleeper Class)', pct: 82, color: 'bg-indigo-600', count: '450 seats booked' },
                { classCode: '1A (AC First Class)', pct: 68, color: 'bg-yellow-500', count: '32 seats booked' },
              ].map(item => (
                <div key={item.classCode} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{item.classCode}</span>
                    <span className="font-mono text-slate-500">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue distribution by train */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Revenue Generating Routes
            </h3>
            <div className="space-y-3 text-xs">
              {trains.slice(0, 5).map(train => {
                const trainBookings = bookings.filter(b => b.trainNumber === train.trainNumber);
                const trainRev = trainBookings.reduce((sum, b) => sum + b.grandTotal, 0);

                return (
                  <div key={train.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {train.trainNumber} - {train.trainName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {train.sourceCode} &rarr; {train.destinationCode} ({train.duration})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{(trainRev + 12500).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trainBookings.length + 8} trips booked
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET MANAGEMENT (TRAINS) */}
      {activeTab === 'trains' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">Train No. &amp; Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Timings (Dep / Arr)</th>
                  <th className="py-3 px-4">Available Classes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {trains.map(train => (
                  <tr key={train.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      <div>{train.trainNumber}</div>
                      <div className="text-xs font-sans text-slate-600 dark:text-slate-400">{train.trainName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {train.trainType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {train.sourceName} ({train.sourceCode}) &rarr; {train.destinationName} ({train.destinationCode})
                      <div className="text-[10px] text-slate-400">{train.distanceKm} km &middot; {train.duration}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {train.departureTime} &rarr; {train.arrivalTime}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(train.classes).map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold">
                            {c}: ₹{train.classes[c].baseFare}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditTrain(train)}
                          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                          title="Edit Train"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrain(train.id)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 transition"
                          title="Delete Train"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-4">
          {/* Search bar inside bookings tab */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchPnr}
                onChange={e => setSearchPnr(e.target.value)}
                placeholder="Search by 10-digit PNR or Passenger Name..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={selectedTrainFilter}
              onChange={e => setSelectedTrainFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Trains</option>
              {trains.map(t => (
                <option key={t.id} value={t.trainNumber}>
                  {t.trainNumber} - {t.trainName}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">PNR</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Train</th>
                  <th className="py-3 px-4">Journey Date</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Pax</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-orange-600">
                      {b.pnr}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.userName}</div>
                      <div className="text-[10px] text-slate-400">{b.userPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {b.trainNumber} - {b.trainName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {b.journeyDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {b.travelClass} ({b.quota})
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {b.passengers.length}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{b.grandTotal}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewTicket(b)}
                        className="px-2.5 py-1 rounded bg-[#0f2e5a] hover:bg-[#153e78] text-white font-semibold text-[11px] transition"
                      >
                        ERS Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT TRAIN MODAL */}
      {isTrainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
              <h3 className="font-bold text-base">
                {editingTrain ? `Edit Train #${editingTrain.trainNumber}` : 'Add New Indian Railways Train'}
              </h3>
              <button onClick={() => setIsTrainModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrain} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Train Number *</label>
                  <input
                    type="text"
                    required
                    value={formTrainNumber}
                    onChange={e => setFormTrainNumber(e.target.value)}
                    placeholder="e.g. 12952"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Train Name *</label>
                  <input
                    type="text"
                    required
                    value={formTrainName}
                    onChange={e => setFormTrainName(e.target.value)}
                    placeholder="e.g. Mumbai Rajdhani Express"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Train Type</label>
                  <select
                    value={formTrainType}
                    onChange={e => setFormTrainType(e.target.value as TrainType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="VANDE_BHARAT">Vande Bharat Express</option>
                    <option value="RAJDHANI">Rajdhani Express</option>
                    <option value="SHATABDI">Shatabdi Express</option>
                    <option value="SUPERFAST">Superfast Express</option>
                    <option value="DURONTO">Duronto Express</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formDistance}
                    onChange={e => setFormDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Code &amp; Name</label>
                  <input
                    type="text"
                    value={formSourceName}
                    onChange={e => setFormSourceName(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Code &amp; Name</label>
                  <input
                    type="text"
                    value={formDestName}
                    onChange={e => setFormDestName(e.target.value)}
                    placeholder="e.g. Mumbai Central"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dep Time (HH:MM)</label>
                  <input
                    type="text"
                    value={formDepTime}
                    onChange={e => setFormDepTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Arr Time (HH:MM)</label>
                  <input
                    type="text"
                    value={formArrTime}
                    onChange={e => setFormArrTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Fare (3A AC)</label>
                  <input
                    type="number"
                    value={formBaseFare3A}
                    onChange={e => setFormBaseFare3A(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Fare (Sleeper)</label>
                  <input
                    type="number"
                    value={formBaseFareSL}
                    onChange={e => setFormBaseFareSL(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTrainModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save Train Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
