import React, { useState } from 'react';
import { X, Layers, Database, GitCommit, Workflow, Users, Download, Info } from 'lucide-react';

interface UmlDiagramsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DiagramType = 'usecase' | 'class' | 'sequence' | 'activity' | 'er';

export const UmlDiagramsModal: React.FC<UmlDiagramsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<DiagramType>('usecase');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-orange-400" />
            <div>
              <h2 className="text-lg font-bold">System Architecture & UML Diagrams</h2>
              <p className="text-xs text-blue-200">Engineering Specification & Object-Oriented Design Models</p>
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
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('usecase')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'usecase'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            1. Use Case Diagram
          </button>

          <button
            onClick={() => setActiveTab('class')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'class'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Class Diagram
          </button>

          <button
            onClick={() => setActiveTab('sequence')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'sequence'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            3. Sequence Diagram
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'activity'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Workflow className="w-4 h-4" />
            4. Activity Diagram
          </button>

          <button
            onClick={() => setActiveTab('er')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'er'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            5. ER Diagram (Database)
          </button>
        </div>

        {/* Diagram Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950/70">
          {activeTab === 'usecase' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Mini Rail IRCTC Use Case Diagram</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Captures system functional scope across Passenger, Admin, and External Payment Gateway actors.</p>
                </div>
                <div className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-medium">UML 2.5 Standard</div>
              </div>

              {/* High-Fidelity SVG Diagram */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <svg viewBox="0 0 950 620" className="w-full h-auto min-w-[800px] text-xs font-sans">
                  {/* System Boundary Box */}
                  <rect x="230" y="30" width="480" height="560" rx="12" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
                  <text x="250" y="55" fill="#0f2e5a" fontWeight="bold" fontSize="14">System Boundary: Mini Rail IRCTC Reservation Platform</text>

                  {/* ACTOR 1: Passenger */}
                  <g transform="translate(70, 220)">
                    <circle cx="40" cy="20" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                    <line x1="40" y1="34" x2="40" y2="75" stroke="#ea580c" strokeWidth="2" />
                    <line x1="15" y1="50" x2="65" y2="50" stroke="#ea580c" strokeWidth="2" />
                    <line x1="40" y1="75" x2="20" y2="115" stroke="#ea580c" strokeWidth="2" />
                    <line x1="40" y1="75" x2="60" y2="115" stroke="#ea580c" strokeWidth="2" />
                    <text x="40" y="135" textAnchor="middle" fontWeight="bold" fill="#0f2e5a" fontSize="13">Passenger</text>
                  </g>

                  {/* ACTOR 2: Railway Admin */}
                  <g transform="translate(790, 150)">
                    <circle cx="40" cy="20" r="14" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" />
                    <line x1="40" y1="34" x2="40" y2="75" stroke="#1d4ed8" strokeWidth="2" />
                    <line x1="15" y1="50" x2="65" y2="50" stroke="#1d4ed8" strokeWidth="2" />
                    <line x1="40" y1="75" x2="20" y2="115" stroke="#1d4ed8" strokeWidth="2" />
                    <line x1="40" y1="75" x2="60" y2="115" stroke="#1d4ed8" strokeWidth="2" />
                    <text x="40" y="135" textAnchor="middle" fontWeight="bold" fill="#1e3a8a" fontSize="13">Railway Admin</text>
                  </g>

                  {/* ACTOR 3: Payment Gateway */}
                  <g transform="translate(790, 420)">
                    <rect x="10" y="20" width="80" height="45" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                    <text x="50" y="47" textAnchor="middle" fontWeight="bold" fill="#334155" fontSize="11">&lt;&lt;Actor&gt;&gt;</text>
                    <text x="50" y="85" textAnchor="middle" fontWeight="bold" fill="#334155" fontSize="12">Payment Gateway</text>
                  </g>

                  {/* USE CASES */}
                  {/* UC1: Search Trains */}
                  <ellipse cx="370" cy="90" rx="90" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
                  <text x="370" y="94" textAnchor="middle" fill="#0369a1" fontWeight="600">Search Trains &amp; Schedules</text>

                  {/* UC2: Check Seat Availability */}
                  <ellipse cx="370" cy="160" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
                  <text x="370" y="164" textAnchor="middle" fill="#0369a1" fontWeight="600">Check Seat Availability</text>

                  {/* UC3: Select Coach & Berth */}
                  <ellipse cx="570" cy="160" rx="85" ry="24" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.8" />
                  <text x="570" y="164" textAnchor="middle" fill="#15803d" fontWeight="600">Select Berth / Coach</text>

                  {/* UC4: Book Ticket & Generate PNR */}
                  <ellipse cx="370" cy="240" rx="95" ry="26" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" />
                  <text x="370" y="244" textAnchor="middle" fill="#c2410c" fontWeight="bold">Book Ticket &amp; Gen PNR</text>

                  {/* UC5: Process Payment */}
                  <ellipse cx="570" cy="270" rx="85" ry="24" fill="#f8fafc" stroke="#64748b" strokeWidth="1.8" />
                  <text x="570" y="274" textAnchor="middle" fill="#334155" fontWeight="600">Process Payment</text>

                  {/* UC6: Cancel Ticket */}
                  <ellipse cx="370" cy="330" rx="85" ry="24" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
                  <text x="370" y="334" textAnchor="middle" fill="#b91c1c" fontWeight="600">Cancel Ticket</text>

                  {/* UC7: Calculate Refund */}
                  <ellipse cx="570" cy="350" rx="85" ry="24" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
                  <text x="570" y="354" textAnchor="middle" fill="#b91c1c" fontWeight="600">Calculate Refund</text>

                  {/* UC8: PNR Status Enquiry */}
                  <ellipse cx="370" cy="410" rx="90" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
                  <text x="370" y="414" textAnchor="middle" fill="#0369a1" fontWeight="600">Check PNR Status</text>

                  {/* UC9: Live Train Tracking */}
                  <ellipse cx="370" cy="480" rx="90" ry="24" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
                  <text x="370" y="484" textAnchor="middle" fill="#0369a1" fontWeight="600">Live Train Status (NTES)</text>

                  {/* UC10: Manage Trains & Routes (Admin) */}
                  <ellipse cx="570" cy="90" rx="95" ry="24" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
                  <text x="570" y="94" textAnchor="middle" fill="#1d4ed8" fontWeight="600">Manage Trains &amp; Schedules</text>

                  {/* UC11: View Bookings & Analytics */}
                  <ellipse cx="570" cy="450" rx="95" ry="24" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
                  <text x="570" y="454" textAnchor="middle" fill="#1d4ed8" fontWeight="600">Audit Bookings &amp; Reports</text>

                  {/* CONNECTOR LINES: Passenger to UCs */}
                  <line x1="120" y1="260" x2="280" y2="95" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="120" y1="270" x2="275" y2="160" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="120" y1="280" x2="275" y2="240" stroke="#ea580c" strokeWidth="2" />
                  <line x1="120" y1="290" x2="285" y2="330" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="120" y1="300" x2="280" y2="410" stroke="#ea580c" strokeWidth="1.5" />
                  <line x1="120" y1="310" x2="280" y2="480" stroke="#ea580c" strokeWidth="1.5" />

                  {/* CONNECTOR LINES: Admin to UCs */}
                  <line x1="790" y1="200" x2="665" y2="95" stroke="#2563eb" strokeWidth="1.5" />
                  <line x1="790" y1="220" x2="665" y2="450" stroke="#2563eb" strokeWidth="1.5" />

                  {/* CONNECTOR LINES: Payment Gateway */}
                  <line x1="655" y1="270" x2="800" y2="435" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="655" y1="355" x2="800" y2="445" stroke="#64748b" strokeWidth="1.5" />

                  {/* <<include>> & <<extend>> relationships */}
                  <line x1="465" y1="245" x2="485" y2="265" stroke="#475569" strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x="475" y="245" fill="#475569" fontSize="10">&lt;&lt;include&gt;&gt;</text>

                  <line x1="455" y1="335" x2="485" y2="345" stroke="#475569" strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x="475" y="335" fill="#475569" fontSize="10">&lt;&lt;extend&gt;&gt;</text>

                  <line x1="460" y1="160" x2="485" y2="160" stroke="#475569" strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x="470" y="152" fill="#475569" fontSize="10">&lt;&lt;extend&gt;&gt;</text>
                </svg>
              </div>

              {/* Explanatory notes */}
              <div className="bg-blue-50 dark:bg-slate-900/50 p-4 rounded-xl border border-blue-200 dark:border-blue-900 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  Use Case Diagram Insights:
                </p>
                <p>• <strong>Primary Actors:</strong> Passenger (User), Railway Administrator (Staff/Supervisor), and External Payment Gateway (UPI / Bank / Wallet).</p>
                <p>• <strong>Included Use Cases:</strong> <em>Book Ticket</em> unconditionally includes <em>Process Payment</em> (&lt;&lt;include&gt;&gt;).</p>
                <p>• <strong>Extended Use Cases:</strong> <em>Cancel Ticket</em> optionally extends into <em>Calculate Refund</em> (&lt;&lt;extend&gt;&gt;) depending on the ticket state and departure proximity.</p>
              </div>
            </div>
          )}

          {activeTab === 'class' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Mini Rail IRCTC Class Diagram</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Object-Oriented structural model detailing entities, attributes, visibility modifiers, and associations.</p>
                </div>
                <div className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded font-medium">UML Structural</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <svg viewBox="0 0 960 620" className="w-full h-auto min-w-[850px] text-xs font-mono">
                  {/* CLASS 1: User */}
                  <g transform="translate(40, 30)">
                    <rect width="220" height="180" rx="6" fill="#f8fafc" stroke="#0f2e5a" strokeWidth="2" />
                    <rect width="220" height="30" rx="6" fill="#0f2e5a" />
                    <text x="110" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">User</text>
                    <text x="10" y="50" fill="#334155">- userId: String</text>
                    <text x="10" y="66" fill="#334155">- name: String</text>
                    <text x="10" y="82" fill="#334155">- email: String</text>
                    <text x="10" y="98" fill="#334155">- phone: String</text>
                    <text x="10" y="114" fill="#334155">- role: UserRole</text>
                    <text x="10" y="130" fill="#334155">- walletBalance: Double</text>
                    <line x1="0" y1="138" x2="220" y2="138" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="154" fill="#047857">+ login(): Boolean</text>
                    <text x="10" y="170" fill="#047857">+ addWalletBalance(): Double</text>
                  </g>

                  {/* CLASS 2: Booking */}
                  <g transform="translate(360, 30)">
                    <rect width="240" height="210" rx="6" fill="#f8fafc" stroke="#ea580c" strokeWidth="2" />
                    <rect width="240" height="30" rx="6" fill="#ea580c" />
                    <text x="120" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">Booking</text>
                    <text x="10" y="48" fill="#334155">- bookingId: String</text>
                    <text x="10" y="64" fill="#334155">- pnr: String</text>
                    <text x="10" y="80" fill="#334155">- journeyDate: Date</text>
                    <text x="10" y="96" fill="#334155">- travelClass: ClassCode</text>
                    <text x="10" y="112" fill="#334155">- quota: Quota</text>
                    <text x="10" y="128" fill="#334155">- grandTotal: Double</text>
                    <text x="10" y="144" fill="#334155">- bookingStatus: String</text>
                    <text x="10" y="160" fill="#334155">- chartStatus: String</text>
                    <line x1="0" y1="168" x2="240" y2="168" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="184" fill="#047857">+ generatePnr(): String</text>
                    <text x="10" y="200" fill="#047857">+ cancelTicket(): Refund</text>
                  </g>

                  {/* CLASS 3: Train */}
                  <g transform="translate(690, 30)">
                    <rect width="230" height="210" rx="6" fill="#f8fafc" stroke="#2563eb" strokeWidth="2" />
                    <rect width="230" height="30" rx="6" fill="#2563eb" />
                    <text x="115" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">Train</text>
                    <text x="10" y="48" fill="#334155">- trainId: String</text>
                    <text x="10" y="64" fill="#334155">- trainNumber: String</text>
                    <text x="10" y="80" fill="#334155">- trainName: String</text>
                    <text x="10" y="96" fill="#334155">- sourceCode: String</text>
                    <text x="10" y="112" fill="#334155">- destinationCode: String</text>
                    <text x="10" y="128" fill="#334155">- departureTime: String</text>
                    <text x="10" y="144" fill="#334155">- arrivalTime: String</text>
                    <text x="10" y="160" fill="#334155">- distanceKm: Integer</text>
                    <line x1="0" y1="168" x2="230" y2="168" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="184" fill="#047857">+ checkAvailability(): Int</text>
                    <text x="10" y="200" fill="#047857">+ getLiveStatus(): Status</text>
                  </g>

                  {/* CLASS 4: BookedPassenger */}
                  <g transform="translate(40, 310)">
                    <rect width="220" height="170" rx="6" fill="#f8fafc" stroke="#059669" strokeWidth="2" />
                    <rect width="220" height="30" rx="6" fill="#059669" />
                    <text x="110" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">BookedPassenger</text>
                    <text x="10" y="48" fill="#334155">- id: String</text>
                    <text x="10" y="64" fill="#334155">- name: String</text>
                    <text x="10" y="80" fill="#334155">- age: Integer</text>
                    <text x="10" y="96" fill="#334155">- gender: Gender</text>
                    <text x="10" y="112" fill="#334155">- allocatedCoach: String</text>
                    <text x="10" y="128" fill="#334155">- allocatedBerth: Integer</text>
                    <text x="10" y="144" fill="#334155">- status: CNF/RAC/WL</text>
                    <line x1="0" y1="150" x2="220" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="164" fill="#047857">+ allocateSeat(): Void</text>
                  </g>

                  {/* CLASS 5: Payment */}
                  <g transform="translate(360, 330)">
                    <rect width="240" height="150" rx="6" fill="#f8fafc" stroke="#7c3aed" strokeWidth="2" />
                    <rect width="240" height="30" rx="6" fill="#7c3aed" />
                    <text x="120" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">PaymentTransaction</text>
                    <text x="10" y="50" fill="#334155">- id: String</text>
                    <text x="10" y="66" fill="#334155">- amount: Double</text>
                    <text x="10" y="82" fill="#334155">- paymentMethod: Method</text>
                    <text x="10" y="98" fill="#334155">- status: SUCCESS/FAIL</text>
                    <text x="10" y="114" fill="#334155">- transactionRef: String</text>
                    <line x1="0" y1="122" x2="240" y2="122" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="140" fill="#047857">+ processPayment(): Bool</text>
                  </g>

                  {/* CLASS 6: CancellationRefund */}
                  <g transform="translate(690, 330)">
                    <rect width="230" height="150" rx="6" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
                    <rect width="230" height="30" rx="6" fill="#dc2626" />
                    <text x="115" y="20" textAnchor="middle" fill="#ffffff" fontWeight="bold">CancellationRefund</text>
                    <text x="10" y="50" fill="#334155">- cancelledDate: Date</text>
                    <text x="10" y="66" fill="#334155">- refundAmount: Double</text>
                    <text x="10" y="82" fill="#334155">- cancellationCharge: Double</text>
                    <text x="10" y="98" fill="#334155">- refundStatus: String</text>
                    <line x1="0" y1="110" x2="230" y2="110" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="10" y="128" fill="#047857">+ computeIRCTCRefund()</text>
                    <text x="10" y="144" fill="#047857">+ releaseSeatInventory()</text>
                  </g>

                  {/* ASSOCIATIONS */}
                  {/* User (1) to Booking (0..*) */}
                  <line x1="260" y1="90" x2="360" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="270" y="82" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="340" y="82" fill="#0f2e5a" fontWeight="bold">0..*</text>

                  {/* Booking (0..*) to Train (1) */}
                  <line x1="600" y1="90" x2="690" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="610" y="82" fill="#0f2e5a" fontWeight="bold">0..*</text>
                  <text x="670" y="82" fill="#0f2e5a" fontWeight="bold">1</text>

                  {/* Booking (1) to BookedPassenger (1..6) */}
                  <line x1="410" y1="240" x2="260" y2="350" stroke="#0f2e5a" strokeWidth="1.8" />
                  <polygon points="410,240 400,245 405,255" fill="#0f2e5a" />
                  <text x="400" y="265" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="275" y="340" fill="#0f2e5a" fontWeight="bold">1..6</text>

                  {/* Booking (1) to PaymentTransaction (1) */}
                  <line x1="480" y1="240" x2="480" y2="330" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="465" y="260" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="465" y="315" fill="#0f2e5a" fontWeight="bold">1</text>

                  {/* Booking (1) to CancellationRefund (0..1) */}
                  <line x1="560" y1="240" x2="710" y2="330" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="565" y="265" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="685" y="325" fill="#0f2e5a" fontWeight="bold">0..1</text>
                </svg>
              </div>

              <div className="bg-emerald-50 dark:bg-slate-900/50 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  Class Diagram Cardinality &amp; Inheritance:
                </p>
                <p>• <strong>Composition:</strong> A <em>Booking</em> contains 1 to 6 <em>BookedPassengers</em>. If a booking is deleted, its passenger seat allocations are removed.</p>
                <p>• <strong>Multiplicity:</strong> 1 User can make 0..* Bookings. 1 Train has 0..* Bookings across multiple travel dates.</p>
              </div>
            </div>
          )}

          {activeTab === 'sequence' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Mini Rail IRCTC Sequence Diagram</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Interaction timeline for train query, seat reservation, payment gateway handover, and PNR issuance.</p>
                </div>
                <div className="text-xs px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded font-medium">UML Behavioral</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <svg viewBox="0 0 960 580" className="w-full h-auto min-w-[850px] text-xs font-sans">
                  {/* LIFELINES */}
                  {/* Actor: Passenger */}
                  <g transform="translate(60, 20)">
                    <rect x="0" y="0" width="100" height="35" rx="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
                    <text x="50" y="22" textAnchor="middle" fontWeight="bold" fill="#9a3412">:Passenger</text>
                    <line x1="50" y1="35" x2="50" y2="540" stroke="#ea580c" strokeDasharray="4 4" strokeWidth="1.5" />
                  </g>

                  {/* UI / Web App */}
                  <g transform="translate(240, 20)">
                    <rect x="0" y="0" width="120" height="35" rx="6" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                    <text x="60" y="22" textAnchor="middle" fontWeight="bold" fill="#1e40af">:Web Portal (UI)</text>
                    <line x1="60" y1="35" x2="60" y2="540" stroke="#2563eb" strokeDasharray="4 4" strokeWidth="1.5" />
                  </g>

                  {/* Train Service & DB */}
                  <g transform="translate(450, 20)">
                    <rect x="0" y="0" width="120" height="35" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="60" y="22" textAnchor="middle" fontWeight="bold" fill="#166534">:TrainController</text>
                    <line x1="60" y1="35" x2="60" y2="540" stroke="#16a34a" strokeDasharray="4 4" strokeWidth="1.5" />
                  </g>

                  {/* Payment Gateway */}
                  <g transform="translate(660, 20)">
                    <rect x="0" y="0" width="130" height="35" rx="6" fill="#fdf4ff" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="65" y="22" textAnchor="middle" fontWeight="bold" fill="#6b21a8">:PaymentGateway</text>
                    <line x1="65" y1="35" x2="65" y2="540" stroke="#a855f7" strokeDasharray="4 4" strokeWidth="1.5" />
                  </g>

                  {/* PNR & SMS/Email Notification */}
                  <g transform="translate(830, 20)">
                    <rect x="0" y="0" width="100" height="35" rx="6" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                    <text x="50" y="22" textAnchor="middle" fontWeight="bold" fill="#334155">:Notification</text>
                    <line x1="50" y1="35" x2="50" y2="540" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
                  </g>

                  {/* MESSAGES */}
                  {/* 1. Search */}
                  <line x1="110" y1="90" x2="295" y2="90" stroke="#0f2e5a" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x="200" y="82" textAnchor="middle" fill="#0f2e5a" fontWeight="600">1. searchTrains(src, dest, date)</text>

                  {/* 2. Query DB */}
                  <line x1="300" y1="120" x2="505" y2="120" stroke="#0f2e5a" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x="400" y="112" textAnchor="middle" fill="#0f2e5a">2. fetchTrainsWithAvailability()</text>

                  {/* 3. Return trains */}
                  <line x1="505" y1="150" x2="305" y2="150" stroke="#475569" strokeDasharray="4 3" strokeWidth="1.2" />
                  <text x="400" y="142" textAnchor="middle" fill="#475569">3. trainList, seatsAvailable, fare</text>

                  {/* 4. Display */}
                  <line x1="295" y1="180" x2="115" y2="180" stroke="#475569" strokeDasharray="4 3" strokeWidth="1.2" />
                  <text x="200" y="172" textAnchor="middle" fill="#475569">4. renderTrainResults()</text>

                  {/* 5. Select & Enter Pax */}
                  <line x1="110" y1="220" x2="295" y2="220" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="200" y="212" textAnchor="middle" fill="#0f2e5a" fontWeight="600">5. submitPassengerDetails(paxList, class)</text>

                  {/* 6. Hold seats & compute fare */}
                  <line x1="300" y1="260" x2="505" y2="260" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="400" y="252" textAnchor="middle" fill="#0f2e5a">6. reserveTemporarySeats(trainId)</text>

                  {/* 7. Initiate Payment */}
                  <line x1="300" y1="300" x2="720" y2="300" stroke="#7c3aed" strokeWidth="1.5" />
                  <text x="510" y="292" textAnchor="middle" fill="#7c3aed" fontWeight="600">7. requestPayment(amount, method: UPI/Card)</text>

                  {/* 8. User Auth & OTP */}
                  <line x1="720" y1="335" x2="115" y2="335" stroke="#7c3aed" strokeDasharray="4 3" strokeWidth="1.2" />
                  <text x="415" y="327" textAnchor="middle" fill="#7c3aed">8. promptUPIApp / OTP Verification</text>

                  {/* 9. Payment Confirmation */}
                  <line x1="725" y1="375" x2="305" y2="375" stroke="#16a34a" strokeWidth="1.8" />
                  <text x="515" y="367" textAnchor="middle" fill="#166534" fontWeight="bold">9. paymentSuccess(txnRef, status: SUCCESS)</text>

                  {/* 10. Generate PNR & Allocate Berth */}
                  <line x1="300" y1="415" x2="505" y2="415" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="400" y="407" textAnchor="middle" fill="#0f2e5a" fontWeight="bold">10. finalizeBooking() &rarr; Gen 10-digit PNR</text>

                  {/* 11. Send Confirmation Email/SMS */}
                  <line x1="510" y1="450" x2="875" y2="450" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="690" y="442" textAnchor="middle" fill="#0f2e5a">11. dispatchTicketConfirmation(PNR, PDF)</text>

                  {/* 12. Deliver ERS Ticket to Passenger */}
                  <line x1="300" y1="490" x2="115" y2="490" stroke="#16a34a" strokeWidth="2" />
                  <text x="200" y="482" textAnchor="middle" fill="#15803d" fontWeight="bold">12. renderElectronicReservationSlip(ERS)</text>
                </svg>
              </div>

              <div className="bg-amber-50 dark:bg-slate-900/50 p-4 rounded-xl border border-amber-200 dark:border-amber-900 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  Sequence Highlights:
                </p>
                <p>• Illustrates the atomic 2-phase seat allocation commit: temporary hold followed by confirmation only upon gateway 200 OK callback.</p>
                <p>• Guarantees zero double-booking even under high concurrency Tatkal rush.</p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Mini Rail IRCTC Activity Diagram</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Control flow of ticket reservation, waitlist transitions, payment decisions, and cancellation refunds.</p>
                </div>
                <div className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded font-medium">UML Behavioral</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <svg viewBox="0 0 920 620" className="w-full h-auto min-w-[800px] text-xs font-sans">
                  {/* Start Node */}
                  <circle cx="460" cy="30" r="14" fill="#0f2e5a" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Activity 1: Enter Origin, Destination & Date */}
                  <rect x="360" y="70" width="200" height="38" rx="8" fill="#f8fafc" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="460" y="94" textAnchor="middle" fontWeight="600" fill="#0f2e5a">Enter Source, Dest &amp; Date</text>
                  <line x1="460" y1="44" x2="460" y2="70" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Activity 2: Search Trains & Select Class */}
                  <rect x="360" y="135" width="200" height="38" rx="8" fill="#f8fafc" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="460" y="159" textAnchor="middle" fontWeight="600" fill="#0f2e5a">Select Train &amp; Travel Class</text>
                  <line x1="460" y1="108" x2="460" y2="135" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Decision 1: Seats Available? */}
                  <polygon points="460,200 530,225 460,250 390,225" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                  <text x="460" y="228" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">Available?</text>
                  <line x1="460" y1="173" x2="460" y2="200" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Branch YES: Allocate Confirmed Berth */}
                  <line x1="390" y1="225" x2="250" y2="225" stroke="#16a34a" strokeWidth="1.5" />
                  <text x="310" y="217" textAnchor="middle" fill="#15803d" fontWeight="bold">[Seats &gt; 0]</text>

                  <rect x="150" y="206" width="100" height="38" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                  <text x="200" y="230" textAnchor="middle" fontWeight="bold" fill="#166534">Assign CNF</text>

                  {/* Branch NO: RAC or WL */}
                  <line x1="530" y1="225" x2="670" y2="225" stroke="#ea580c" strokeWidth="1.5" />
                  <text x="600" y="217" textAnchor="middle" fill="#c2410c" fontWeight="bold">[Seats == 0]</text>

                  <rect x="670" y="206" width="110" height="38" rx="8" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
                  <text x="725" y="230" textAnchor="middle" fontWeight="bold" fill="#9a3412">Assign RAC / WL</text>

                  {/* Merge to Passenger Details */}
                  <line x1="200" y1="244" x2="200" y2="290" stroke="#0f2e5a" strokeWidth="1.5" />
                  <line x1="725" y1="244" x2="725" y2="290" stroke="#0f2e5a" strokeWidth="1.5" />
                  <line x1="200" y1="290" x2="725" y2="290" stroke="#0f2e5a" strokeWidth="1.5" />
                  <line x1="460" y1="290" x2="460" y2="315" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Activity 3: Add Passengers & Select Berths */}
                  <rect x="350" y="315" width="220" height="38" rx="8" fill="#f8fafc" stroke="#0f2e5a" strokeWidth="1.5" />
                  <text x="460" y="339" textAnchor="middle" fontWeight="600" fill="#0f2e5a">Enter Passengers &amp; Preferences</text>

                  {/* Activity 4: Payment Gateway */}
                  <rect x="350" y="380" width="220" height="38" rx="8" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1.5" />
                  <text x="460" y="404" textAnchor="middle" fontWeight="600" fill="#6b21a8">Process Payment (UPI/Card/Wallet)</text>
                  <line x1="460" y1="353" x2="460" y2="380" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Decision 2: Payment Succeeded? */}
                  <polygon points="460,445 520,468 460,491 400,468" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                  <text x="460" y="472" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">Paid?</text>
                  <line x1="460" y1="418" x2="460" y2="445" stroke="#0f2e5a" strokeWidth="1.5" />

                  {/* Payment Failed -> Loop Back */}
                  <line x1="520" y1="468" x2="630" y2="468" stroke="#dc2626" strokeWidth="1.5" />
                  <line x1="630" y1="468" x2="630" y2="399" stroke="#dc2626" strokeWidth="1.5" />
                  <line x1="630" y1="399" x2="570" y2="399" stroke="#dc2626" strokeWidth="1.5" />
                  <text x="560" y="460" fill="#b91c1c" fontWeight="bold">[Failed]</text>

                  {/* Payment Succeeded -> Generate PNR & Ticket */}
                  <line x1="460" y1="491" x2="460" y2="520" stroke="#16a34a" strokeWidth="1.5" />
                  <text x="495" y="508" fill="#15803d" fontWeight="bold">[Success]</text>

                  <rect x="340" y="520" width="240" height="38" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                  <text x="460" y="544" textAnchor="middle" fontWeight="bold" fill="#1d4ed8">Generate 10-Digit PNR &amp; E-Ticket</text>

                  {/* Final Node */}
                  <line x1="460" y1="558" x2="460" y2="585" stroke="#0f2e5a" strokeWidth="1.5" />
                  <circle cx="460" cy="595" r="13" fill="#ffffff" stroke="#0f2e5a" strokeWidth="2" />
                  <circle cx="460" cy="595" r="8" fill="#0f2e5a" />
                </svg>
              </div>

              <div className="bg-purple-50 dark:bg-slate-900/50 p-4 rounded-xl border border-purple-200 dark:border-purple-900 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-purple-600" />
                  Workflow Insights:
                </p>
                <p>• Handles graceful failure retry if UPI/Netbanking times out without deducting duplicate amount.</p>
                <p>• Integrates seamless fallback to RAC (Reservation Against Cancellation) and WL (Waitlist) if primary berths are exhausted.</p>
              </div>
            </div>
          )}

          {activeTab === 'er' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Mini Rail IRCTC Database ER Diagram</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Relational schema design matching the project requirements (Users, Trains, Bookings, Payments, Cancellations).</p>
                </div>
                <div className="text-xs px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded font-medium">Relational Schema</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <svg viewBox="0 0 960 600" className="w-full h-auto min-w-[850px] text-xs font-mono">
                  {/* TABLE: USERS */}
                  <g transform="translate(40, 40)">
                    <rect width="210" height="175" rx="6" fill="#f8fafc" stroke="#0f2e5a" strokeWidth="1.8" />
                    <rect width="210" height="28" rx="6" fill="#0f2e5a" />
                    <text x="105" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">USERS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  user_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#334155">    name: VARCHAR(100)</text>
                    <text x="10" y="86" fill="#334155">    email: VARCHAR(150)</text>
                    <text x="10" y="106" fill="#334155">    password_hash: VARCHAR</text>
                    <text x="10" y="126" fill="#334155">    phone: VARCHAR(15)</text>
                    <text x="10" y="146" fill="#334155">    wallet_balance: DECIMAL</text>
                    <text x="10" y="166" fill="#334155">    created_at: TIMESTAMP</text>
                  </g>

                  {/* TABLE: TRAINS */}
                  <g transform="translate(680, 40)">
                    <rect width="230" height="195" rx="6" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.8" />
                    <rect width="230" height="28" rx="6" fill="#2563eb" />
                    <text x="115" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">TRAINS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  train_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#334155">    train_number: VARCHAR(10)</text>
                    <text x="10" y="86" fill="#334155">    train_name: VARCHAR(150)</text>
                    <text x="10" y="106" fill="#334155">    source_code: VARCHAR(10)</text>
                    <text x="10" y="126" fill="#334155">    dest_code: VARCHAR(10)</text>
                    <text x="10" y="146" fill="#334155">    departure_time: TIME</text>
                    <text x="10" y="166" fill="#334155">    arrival_time: TIME</text>
                    <text x="10" y="186" fill="#334155">    total_seats: INT</text>
                  </g>

                  {/* TABLE: BOOKINGS (Centerpiece) */}
                  <g transform="translate(350, 40)">
                    <rect width="240" height="225" rx="6" fill="#f8fafc" stroke="#ea580c" strokeWidth="2" />
                    <rect width="240" height="28" rx="6" fill="#ea580c" />
                    <text x="120" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">BOOKINGS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  booking_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#0284c7" fontWeight="bold">    pnr_number: VARCHAR(10) [UQ]</text>
                    <text x="10" y="86" fill="#7c3aed" fontWeight="bold">FK  user_id: VARCHAR(36)</text>
                    <text x="10" y="106" fill="#7c3aed" fontWeight="bold">FK  train_id: VARCHAR(36)</text>
                    <text x="10" y="126" fill="#334155">    journey_date: DATE</text>
                    <text x="10" y="146" fill="#334155">    seats_booked: INT</text>
                    <text x="10" y="166" fill="#334155">    travel_class: VARCHAR(5)</text>
                    <text x="10" y="186" fill="#334155">    quota: VARCHAR(5)</text>
                    <text x="10" y="206" fill="#334155">    booking_status: VARCHAR(20)</text>
                  </g>

                  {/* TABLE: PASSENGERS */}
                  <g transform="translate(40, 340)">
                    <rect width="210" height="175" rx="6" fill="#f8fafc" stroke="#16a34a" strokeWidth="1.8" />
                    <rect width="210" height="28" rx="6" fill="#16a34a" />
                    <text x="105" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">BOOKED_PASSENGERS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  passenger_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#7c3aed" fontWeight="bold">FK  booking_id: VARCHAR(36)</text>
                    <text x="10" y="86" fill="#334155">    name: VARCHAR(100)</text>
                    <text x="10" y="106" fill="#334155">    age: INT</text>
                    <text x="10" y="126" fill="#334155">    gender: CHAR(1)</text>
                    <text x="10" y="146" fill="#334155">    coach: VARCHAR(5)</text>
                    <text x="10" y="166" fill="#334155">    berth_number: INT</text>
                  </g>

                  {/* TABLE: PAYMENTS */}
                  <g transform="translate(350, 340)">
                    <rect width="240" height="175" rx="6" fill="#f8fafc" stroke="#9333ea" strokeWidth="1.8" />
                    <rect width="240" height="28" rx="6" fill="#9333ea" />
                    <text x="120" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">PAYMENTS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  payment_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#7c3aed" fontWeight="bold">FK  booking_id: VARCHAR(36)</text>
                    <text x="10" y="86" fill="#334155">    amount: DECIMAL(10,2)</text>
                    <text x="10" y="106" fill="#334155">    payment_method: VARCHAR</text>
                    <text x="10" y="126" fill="#334155">    payment_status: VARCHAR</text>
                    <text x="10" y="146" fill="#334155">    txn_reference: VARCHAR</text>
                    <text x="10" y="166" fill="#334155">    created_at: TIMESTAMP</text>
                  </g>

                  {/* TABLE: CANCELLATIONS */}
                  <g transform="translate(680, 340)">
                    <rect width="230" height="175" rx="6" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.8" />
                    <rect width="230" height="28" rx="6" fill="#dc2626" />
                    <text x="115" y="19" textAnchor="middle" fill="#ffffff" fontWeight="bold">CANCELLATIONS</text>
                    <text x="10" y="46" fill="#dc2626" fontWeight="bold">PK  cancel_id: VARCHAR(36)</text>
                    <text x="10" y="66" fill="#7c3aed" fontWeight="bold">FK  booking_id: VARCHAR(36)</text>
                    <text x="10" y="86" fill="#334155">    refund_amount: DECIMAL</text>
                    <text x="10" y="106" fill="#334155">    cancellation_charge: DECIMAL</text>
                    <text x="10" y="126" fill="#334155">    reason: VARCHAR(255)</text>
                    <text x="10" y="146" fill="#334155">    refund_status: VARCHAR(20)</text>
                    <text x="10" y="166" fill="#334155">    cancelled_at: TIMESTAMP</text>
                  </g>

                  {/* RELATIONSHIP LINES */}
                  {/* USERS (1) -> BOOKINGS (M) */}
                  <line x1="250" y1="90" x2="350" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <circle cx="255" cy="90" r="3" fill="#0f2e5a" />
                  {/* Crow's foot at BOOKINGS */}
                  <line x1="335" y1="80" x2="350" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <line x1="335" y1="100" x2="350" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="265" y="82" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="325" y="82" fill="#0f2e5a" fontWeight="bold">M</text>

                  {/* TRAINS (1) -> BOOKINGS (M) */}
                  <line x1="680" y1="90" x2="590" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <circle cx="675" cy="90" r="3" fill="#0f2e5a" />
                  <line x1="605" y1="80" x2="590" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <line x1="605" y1="100" x2="590" y2="90" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="660" y="82" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="605" y="82" fill="#0f2e5a" fontWeight="bold">M</text>

                  {/* BOOKINGS (1) -> PASSENGERS (M) */}
                  <line x1="420" y1="265" x2="200" y2="340" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="400" y="285" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="220" y="335" fill="#0f2e5a" fontWeight="bold">M</text>

                  {/* BOOKINGS (1) -> PAYMENTS (1) */}
                  <line x1="470" y1="265" x2="470" y2="340" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="455" y="285" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="455" y="325" fill="#0f2e5a" fontWeight="bold">1</text>

                  {/* BOOKINGS (1) -> CANCELLATIONS (0..1) */}
                  <line x1="520" y1="265" x2="720" y2="340" stroke="#0f2e5a" strokeWidth="1.8" />
                  <text x="535" y="285" fill="#0f2e5a" fontWeight="bold">1</text>
                  <text x="690" y="335" fill="#0f2e5a" fontWeight="bold">0..1</text>
                </svg>
              </div>

              <div className="bg-cyan-50 dark:bg-slate-900/50 p-4 rounded-xl border border-cyan-200 dark:border-cyan-900 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-600" />
                  Relational Normalization:
                </p>
                <p>• Normalized to <strong>Third Normal Form (3NF)</strong>: All non-key attributes are fully functionally dependent on primary keys.</p>
                <p>• Matches all requested tables: <code>Users</code>, <code>Trains</code>, <code>Bookings</code>, <code>Payments</code> plus <code>Booked_Passengers</code> and <code>Cancellations</code>.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span>Indian Railways Mini Rail IRCTC Architecture &middot; UML 2.5 Specification</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Print / Save Diagrams
          </button>
        </div>
      </div>
    </div>
  );
};
