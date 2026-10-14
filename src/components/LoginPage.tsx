import React, { useState } from 'react';
import { Train, ShieldCheck, UserCheck, KeyRound, Mail, Phone, Lock, RefreshCw, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles, Smartphone, Download } from 'lucide-react';
import { User } from '../types/railway';
import { storageService } from '../services/storageService';
import { ThreeTrainScene } from './ThreeTrainScene';
import { playRailwayChime } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onOpenApkModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onOpenApkModal }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [authRole, setAuthRole] = useState<'passenger' | 'admin'>('passenger');

  // Sign In inputs
  const [usernameInput, setUsernameInput] = useState('rahul.sharma@rail.in');
  const [passwordInput, setPasswordInput] = useState('rail123');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptcha());
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');

  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let str = '';
    for (let i = 0; i < 5; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim()) {
      setErrorMessage('Please enter your IRCTC User ID or Email.');
      return;
    }

    if (!passwordInput) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Verify Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid Captcha code. Please enter the characters shown in the box.');
      handleRefreshCaptcha();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const users = storageService.getUsers();
      // Look for user matching email/phone
      const user =
        users.find(
          u =>
            u.email.toLowerCase() === usernameInput.toLowerCase() ||
            u.phone === usernameInput ||
            u.id === usernameInput
        ) ||
        (authRole === 'admin'
          ? users.find(u => u.role === 'admin')
          : users[0]);

      if (user) {
        storageService.setCurrentUser(user.id);
        playRailwayChime();
        onLoginSuccess(user);
      } else {
        setErrorMessage('User credentials not found.');
      }
    }, 700);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = storageService.registerUser(regName.trim(), regEmail.trim(), regPhone.trim());
      playRailwayChime();
      onLoginSuccess(newUser);
    }, 800);
  };

  // Quick 1-click demo logins for instant evaluation
  const handleQuickDemoLogin = (role: 'passenger' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const users = storageService.getUsers();
      let targetUser = users.find(u => (role === 'admin' ? u.role === 'admin' : u.role === 'user'));
      if (!targetUser) targetUser = users[0];
      storageService.setCurrentUser(targetUser.id);
      playRailwayChime();
      onLoginSuccess(targetUser);
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const users = storageService.getUsers();
      const user = users[0];
      storageService.setCurrentUser(user.id);
      playRailwayChime();
      onLoginSuccess(user);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Banner Ticker */}
      <div className="bg-[#0f2e5a] text-xs px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center font-black text-white text-xs">
            IR
          </div>
          <span className="font-bold tracking-tight">INDIAN RAILWAYS PASSENGER RESERVATION SYSTEM (PRS)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[11px] font-bold transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install Android App (APK)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 3D Train & Right Login Card */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Three.js 3D Vande Bharat Train Showcase */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Indian Railways 3D Engine &middot; Vande Bharat 2.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Speed, Safety &amp; Comfort. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                Reserve in Seconds.
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Experience instant seat availability, interactive coach berth selection, zero-failure Tatkal booking, and live GPS train tracking powered by Indian Railways.
            </p>
          </div>

          {/* Interactive 3D Three.js Train Canvas */}
          <div className="w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 relative">
            <ThreeTrainScene className="w-full h-full" isHero={true} />
          </div>

          {/* Fast Feature Pill Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-orange-400 font-bold block text-sm font-mono">160 km/h</span>
              <span className="text-[11px] text-slate-400">Vande Bharat Express</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold block text-sm font-mono">100% Instant</span>
              <span className="text-[11px] text-slate-400">IRCTC Wallet Refund</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-blue-400 font-bold block text-sm font-mono">10-Digit PNR</span>
              <span className="text-[11px] text-slate-400">Live Status &amp; Charts</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentic IRCTC Login / Registration Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f2e5a] flex items-center justify-center text-white font-extrabold text-base border-2 border-orange-500">
                IR
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#0f2e5a] dark:text-blue-400">IRCTC Login Gateway</h2>
                <p className="text-[11px] text-slate-500">CRIS Secure Authentication Service</p>
              </div>
            </div>

            {/* Quick Demo Switcher */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthRole('passenger');
                  setUsernameInput('rahul.sharma@rail.in');
                  setPasswordInput('rail123');
                }}
                className={`px-2 py-1 rounded transition ${
                  authRole === 'passenger'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-white'
                }`}
              >
                Passenger
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthRole('admin');
                  setUsernameInput('admin@irctc.co.in');
                  setPasswordInput('admin123');
                }}
                className={`px-2 py-1 rounded transition ${
                  authRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Tab Selector: Sign In vs Register */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 my-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                activeTab === 'signin'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                activeTab === 'register'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  IRCTC User ID / Registered Email / Mobile
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="e.g. rahul.sharma@rail.in or 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Credentials:\nPassenger: rahul.sharma@rail.in / rail123\nAdmin: admin@irctc.co.in / admin123')}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Enter IRCTC Password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Captcha Verification */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Verification Code (Captcha)
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-base font-black tracking-widest text-[#0f2e5a] dark:text-orange-400 select-none shadow-inner">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                  />
                  <span>Remember IRCTC Credentials</span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying with CRIS...' : 'Sign In to IRCTC Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Fast Demo Buttons */}
              <div className="pt-2">
                <div className="relative flex items-center justify-center mb-3">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-2 text-[10px] text-slate-400 uppercase font-bold absolute">
                    1-Click Evaluation Sign In
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('passenger')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-slate-800 text-xs text-left transition font-semibold"
                  >
                    <div className="text-[#0f2e5a] dark:text-orange-400 font-bold">Passenger Demo</div>
                    <div className="text-[10px] text-slate-500">Rahul Sharma (₹4,850 bal)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-xs text-left transition font-semibold"
                  >
                    <div className="text-blue-700 dark:text-blue-300 font-bold">Admin Demo</div>
                    <div className="text-[10px] text-slate-500">CRIS Supervisor</div>
                  </button>
                </div>
              </div>

              {/* Google Sign In option */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Full Name (As on Government ID) *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Mobile Number (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Aadhaar / Voter ID Number (IRCTC Verification)
                </label>
                <input
                  type="text"
                  value={regAadhaar}
                  onChange={e => setRegAadhaar(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹2,000 IRCTC iMudra welcome wallet balance will be credited instantly upon signup!</span>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration & Sign In'}
              </button>
            </form>
          )}

          {/* Footer security notes */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-Bit SSL Encrypted
            </span>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('passenger')}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Skip to Guest Browse &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#091e3b] text-slate-400 text-xs py-3 px-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px]">
          &copy; Indian Railways Catering &amp; Tourism Corporation Ltd. (IRCTC) &middot; All Rights Reserved
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button onClick={onOpenApkModal} className="text-orange-400 font-bold hover:underline">
            Download Mobile APK
          </button>
          <span>&middot;</span>
          <span>Helpdesk: 139 (Toll Free)</span>
        </div>
      </div>
    </div>
  );
};
