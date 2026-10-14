import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Building2, Wallet, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types/railway';
import { playRailwayChime } from '../utils/audio';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currentUser: User;
  onPaymentSuccess: (method: 'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  currentUser,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET'>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const hasWalletFunds = (currentUser.walletBalance || 0) >= totalAmount;

  const handlePay = () => {
    setErrorMessage('');
    if (selectedMethod === 'IRCTC_WALLET' && !hasWalletFunds) {
      setErrorMessage(`Insufficient wallet balance. You need ₹${totalAmount}, current balance is ₹${currentUser.walletBalance || 0}.`);
      return;
    }

    setIsProcessing(true);
    // Simulate secure 2-second bank authorization handshake
    setTimeout(() => {
      setIsProcessing(false);
      playRailwayChime();
      onPaymentSuccess(selectedMethod);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2e5a] text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">IRCTC Fast-Pay Secure Gateway</h2>
              <p className="text-xs text-blue-200">256-Bit Encrypted Payment Processor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount to pay banner */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-blue-50 dark:bg-slate-950 border-b border-blue-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount Payable</span>
            <div className="text-2xl font-black text-[#0f2e5a] dark:text-blue-400 font-mono">
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <span>Transaction Time Remaining:</span>
            <div className="font-mono font-bold text-orange-600">09:45 mins</div>
          </div>
        </div>

        {/* Content: Method Selector & Details */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-950/40">
          {/* Method tabs */}
          <div className="md:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Payment Mode</span>

            {/* UPI Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod('UPI')}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                selectedMethod === 'UPI'
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-900 dark:text-orange-200 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-xs font-bold">UPI / QR Code</div>
                <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm, BHIM</div>
              </div>
            </button>

            {/* IRCTC Wallet Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod('IRCTC_WALLET')}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                selectedMethod === 'IRCTC_WALLET'
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-900 dark:text-orange-200 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold">IRCTC iMudra Wallet</div>
                <div className="text-[10px] text-slate-500">Balance: ₹{currentUser.walletBalance || 0}</div>
              </div>
            </button>

            {/* Net Banking Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod('NET_BANKING')}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                selectedMethod === 'NET_BANKING'
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-900 dark:text-orange-200 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-bold">Net Banking</div>
                <div className="text-[10px] text-slate-500">SBI, HDFC, ICICI, PNB</div>
              </div>
            </button>

            {/* Cards Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod('CARD')}
              className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition ${
                selectedMethod === 'CARD'
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-900 dark:text-orange-200 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs font-bold">Debit / Credit Cards</div>
                <div className="text-[10px] text-slate-500">Visa, RuPay, MasterCard</div>
              </div>
            </button>
          </div>

          {/* Form details based on chosen method */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {selectedMethod === 'UPI' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-800 dark:text-white">Scan QR or Enter Virtual Payment Address (VPA)</div>

                {/* Simulated dynamic QR Code */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="p-2 bg-white rounded border border-slate-300">
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <rect x="5" y="5" width="28" height="28" fill="#000" />
                      <rect x="9" y="9" width="20" height="20" fill="#fff" />
                      <rect x="13" y="13" width="12" height="12" fill="#000" />
                      <rect x="67" y="5" width="28" height="28" fill="#000" />
                      <rect x="71" y="9" width="20" height="20" fill="#fff" />
                      <rect x="75" y="13" width="12" height="12" fill="#000" />
                      <rect x="5" y="67" width="28" height="28" fill="#000" />
                      <rect x="9" y="71" width="20" height="20" fill="#fff" />
                      <rect x="13" y="75" width="12" height="12" fill="#000" />
                      <rect x="38" y="15" width="8" height="8" fill="#ea580c" />
                      <rect x="50" y="35" width="12" height="12" fill="#0f2e5a" />
                      <rect x="38" y="55" width="8" height="8" fill="#000" />
                      <rect x="65" y="65" width="14" height="14" fill="#16a34a" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-1">Scan using any UPI App (GPay / PhonePe / Paytm)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Or Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'IRCTC_WALLET' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-800 dark:text-white">IRCTC iMudra E-Wallet</div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f2e5a] to-[#1e40af] text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-blue-200 uppercase font-semibold">Available Balance</span>
                      <div className="text-2xl font-black font-mono">₹{currentUser.walletBalance || 0}</div>
                    </div>
                    <Wallet className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-[11px]">
                    <span>Account: {currentUser.name}</span>
                    <span className="font-mono">{currentUser.phone}</span>
                  </div>
                </div>

                {hasWalletFunds ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instant 1-Click deduction. Zero OTP delay!</span>
                  </div>
                ) : (
                  <div className="text-xs text-red-600 font-semibold bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200">
                    Insufficient balance! Please select another payment method or add funds to your wallet in your profile.
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'NET_BANKING' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-800 dark:text-white">Select Your Bank</div>
                <div className="grid grid-cols-2 gap-2">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Axis Bank', 'Bank of Baroda'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-lg border text-xs text-left font-medium transition ${
                        selectedBank === bank
                          ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-white">Credit / Debit Card Details</div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-3 text-xs text-red-600 font-semibold bg-red-50 p-2 rounded border border-red-200">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank-grade security &middot; Safe &amp; verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={isProcessing || (selectedMethod === 'IRCTC_WALLET' && !hasWalletFunds)}
              className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing with Bank...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalAmount.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
