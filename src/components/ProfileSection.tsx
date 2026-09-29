import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Check, 
  Save, 
  ShieldCheck,
  Building,
  KeyRound,
  LogIn,
  UserPlus,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserAddress, UserProfile } from '../types/confectionery';
import { DEFAULT_USER_PROFILE } from '../data/confectioneryData';

interface ProfileSectionProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onOpenCart?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenCart,
}) => {
  // Mode: 'profile' (logged in view/edit), 'login', 'signup'
  const [mode, setMode] = useState<'profile' | 'login' | 'signup'>(() => {
    return userProfile.isLoggedIn ? 'profile' : 'login';
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up form state
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    street: '',
  });
  const [signupError, setSignupError] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Edit Profile form state
  const [profileFormData, setProfileFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone,
    email: userProfile.email,
    password: userProfile.password || '12345',
    street: userProfile.street,
    city: 'Chandpur',
    state: 'Uttar Pradesh',
    pincode: '246725',
  });
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sync profile form data whenever userProfile prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setProfileFormData({
        name: userProfile.name,
        phone: userProfile.phone,
        email: userProfile.email,
        password: userProfile.password || '12345',
        street: userProfile.street,
        city: 'Chandpur',
        state: 'Uttar Pradesh',
        pincode: '246725',
      });
      if (userProfile.isLoggedIn) {
        setMode('profile');
      }
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  // Helper to load registered users from localStorage
  const getRegisteredUsers = (): Record<string, UserProfile> => {
    try {
      const saved = localStorage.getItem('sharma_conf_registered_users');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default seeded user
    return {
      [DEFAULT_USER_PROFILE.email.toLowerCase()]: DEFAULT_USER_PROFILE,
    };
  };

  const saveRegisteredUsers = (users: Record<string, UserProfile>) => {
    try {
      localStorage.setItem('sharma_conf_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (cleanPass.length !== 5) {
      setLoginError('Password must be exactly 5 digits.');
      return;
    }

    const users = getRegisteredUsers();
    const foundUser = users[cleanEmail];

    if (!foundUser) {
      setLoginError('No account found with this email. Please click "Sign Up" below.');
      return;
    }

    if (foundUser.password !== cleanPass) {
      setLoginError('Incorrect 5-digit password. Please try again.');
      return;
    }

    // Success login
    const updatedUser: UserProfile = {
      ...foundUser,
      isLoggedIn: true,
    };

    onUpdateProfile(updatedUser);
    setSaveSuccessMsg(`Welcome back, ${updatedUser.name}! Your delivery profile is now active.`);
    setMode('profile');
    setLoginPassword('');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 2. Handle Sign Up
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    const cleanEmail = signupData.email.trim().toLowerCase();
    const cleanPass = signupData.password.trim();

    if (cleanPass.length !== 5) {
      setSignupError('Please enter a 5-digit password (e.g. 12345).');
      return;
    }

    if (!signupData.name.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }

    if (!signupData.phone.trim()) {
      setSignupError('Please enter your contact number.');
      return;
    }

    if (!signupData.street.trim()) {
      setSignupError('Please enter your full address (house/street).');
      return;
    }

    const users = getRegisteredUsers();
    const newUser: UserProfile = {
      name: signupData.name.trim(),
      phone: signupData.phone.trim(),
      email: cleanEmail,
      password: cleanPass,
      street: signupData.street.trim(),
      city: 'Chandpur',
      state: 'Uttar Pradesh',
      pincode: '246725',
      isLoggedIn: true,
    };

    users[cleanEmail] = newUser;
    saveRegisteredUsers(users);

    onUpdateProfile(newUser);
    setSaveSuccessMsg('Account created successfully! Your delivery details are now applied to all orders.');
    setMode('profile');
    setSignupData({ name: '', phone: '', email: '', password: '', street: '' });
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // 3. Handle Edit Profile Update
  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPass = (profileFormData.password || '').trim();
    if (cleanPass.length !== 5) {
      alert('Password must be exactly 5 digits.');
      return;
    }

    const updatedProfile: UserProfile = {
      name: profileFormData.name.trim(),
      phone: profileFormData.phone.trim(),
      email: profileFormData.email.trim(),
      password: cleanPass,
      street: profileFormData.street.trim(),
      city: 'Chandpur',
      state: 'Uttar Pradesh',
      pincode: '246725',
      isLoggedIn: true,
    };

    // Update in registered users database
    const users = getRegisteredUsers();
    users[updatedProfile.email.toLowerCase()] = updatedProfile;
    saveRegisteredUsers(users);

    // Update global app state and trigger order address update
    onUpdateProfile(updatedProfile);

    setSaveSuccessMsg('✓ Profile & Order Address updated successfully! Applied to your active cart.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 4. Handle Logout
  const handleLogout = () => {
    const loggedOutProfile: UserProfile = {
      ...userProfile,
      isLoggedIn: false,
    };
    onUpdateProfile(loggedOutProfile);
    setMode('login');
    setLoginEmail(userProfile.email);
    setLoginPassword('');
    setSaveSuccessMsg('Logged out successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-stone-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-in fade-in zoom-in-95 my-auto"
      >
        {/* Modal Header */}
        <div className="bg-[#131921] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-lg shadow-md font-serif">
              {userProfile.isLoggedIn ? (
                userProfile.name.charAt(0).toUpperCase() || 'S'
              ) : (
                <User className="w-5 h-5 text-stone-950" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">
                {mode === 'profile' && 'Customer Profile & Address'}
                {mode === 'login' && 'Sign In to Your Account'}
                {mode === 'signup' && 'Create Customer Account'}
              </h2>
              <p className="text-xs text-amber-300">
                Sharma Confectioners · Chandpur 246725
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Success Notification */}
        {saveSuccessMsg && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Mode Navigation Tabs if not logged in */}
        {!userProfile.isLoggedIn && (
          <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'border-b-2 border-amber-500 text-stone-950 bg-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>Login (Email + 5-Digit Password)</span>
            </button>
            <button
              onClick={() => { setMode('signup'); setSignupError(''); }}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'border-b-2 border-amber-500 text-stone-950 bg-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign Up (New Account)</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: PROFILE MANAGEMENT (LOGGED IN)                             */}
        {/* ------------------------------------------------------------------ */}
        {mode === 'profile' && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Account Status Strip */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-stone-800">
                  Logged In: <strong className="text-stone-950">{userProfile.name}</strong>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-stone-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Log out of this account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Live Order Sync Notice */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Instant Order Sync:</strong> Changing your Name, Phone, or Street Address below will <strong>immediately update your current shopping cart, WhatsApp order message, and Tax Invoice bill</strong>.
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleProfileUpdateSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>Full Name (for delivery & bill)</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Contact Number (WhatsApp enabled)</span>
                </label>
                <input
                  type="tel"
                  required
                  value={profileFormData.phone}
                  onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                />
              </div>

              {/* Email & 5-Digit Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={profileFormData.email}
                    onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* 5-Digit Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                      <span>5-Digit Password</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono font-normal">5 Digits</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showProfilePassword ? "text" : "password"}
                      required
                      maxLength={5}
                      pattern="[0-9]{5}"
                      value={profileFormData.password}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
                        setProfileFormData({ ...profileFormData, password: val });
                      }}
                      placeholder="12345"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 pr-9 text-xs sm:text-sm text-stone-900 font-bold font-mono tracking-widest outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showProfilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-700" />
                  <span>Full Delivery Address (House / Street / Landmark)</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={profileFormData.street}
                  onChange={(e) => setProfileFormData({ ...profileFormData, street: e.target.value })}
                  placeholder="e.g. 47Q8+783, Station Rd, near Railway Station"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                />
              </div>

              {/* Fixed City & Pincode (Chandpur 246725) */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Delivery Territory (Locked to Chandpur)</span>
                  </span>
                  <span className="flex items-center gap-1 bg-amber-200/80 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <Lock className="w-2.5 h-2.5 text-amber-900" />
                    <span>LOCKED</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  <div className="bg-white rounded-lg p-2 border border-amber-200">
                    <span className="text-[10px] text-stone-500 block">City & State</span>
                    <span className="font-bold text-stone-900">Chandpur, Uttar Pradesh</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-amber-200">
                    <span className="text-[10px] text-stone-500 block">Pin Code</span>
                    <span className="font-bold text-stone-900 font-mono text-sm tracking-wider">246725</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Apply to Order Details</span>
                </button>
                {onOpenCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    View Cart
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: LOGIN FORM (EMAIL + 5-DIGIT PASSWORD)                     */}
        {/* ------------------------------------------------------------------ */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="text-center pb-1">
              <span className="text-3xl block mb-1">🔐</span>
              <h3 className="font-bold text-base text-stone-900">Welcome Back</h3>
              <p className="text-xs text-stone-500">
                Sign in with your Email and your 5-digit password to load your saved delivery profile.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>Registered Email</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="manishroyal450@gmail.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* 5-Digit Password */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>5-Digit Password / PIN</span>
                </span>
                <span className="text-[10px] text-stone-500">Default test: 12345</span>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  maxLength={5}
                  pattern="[0-9]{5}"
                  value={loginPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
                    setLoginPassword(val);
                  }}
                  placeholder="Enter 5-digit PIN (e.g. 12345)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-stone-900 font-mono tracking-widest font-bold outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all text-center sm:text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Enter the 5 digits set during registration.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Account</span>
            </button>

            {/* Switch to Sign Up */}
            <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-200">
              <span>Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => { setMode('signup'); setSignupError(''); }}
                className="font-bold text-amber-800 hover:underline cursor-pointer ml-1"
              >
                Sign Up with 5-Digit Password
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: SIGN UP FORM (FULL DETAILS + 5-DIGIT PASSWORD)            */}
        {/* ------------------------------------------------------------------ */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="p-5 sm:p-6 space-y-3.5">
            <div className="text-center pb-1">
              <span className="text-3xl block mb-1">📝</span>
              <h3 className="font-bold text-base text-stone-900">Create Account</h3>
              <p className="text-xs text-stone-500">
                Register with your Chandpur address and a 5-digit password to place sweets orders anytime.
              </p>
            </div>

            {signupError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>Name *</span>
              </label>
              <input
                type="text"
                required
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Contact Number *</span>
              </label>
              <input
                type="tel"
                required
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Email & 5-Digit Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-700" />
                  <span>Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>5-Digit Password *</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    required
                    maxLength={5}
                    pattern="[0-9]{5}"
                    value={signupData.password}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
                      setSignupData({ ...signupData, password: val });
                    }}
                    placeholder="e.g. 54321"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 pr-9 text-xs sm:text-sm text-stone-900 font-mono tracking-widest font-bold outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-700" />
                <span>Full Address (House / Street / Mohalla) *</span>
              </label>
              <textarea
                required
                rows={2}
                value={signupData.street}
                onChange={(e) => setSignupData({ ...signupData, street: e.target.value })}
                placeholder="e.g. House No. 12, Station Rd, near Railway Station"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Fixed City & Pincode */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-amber-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>City & Pin Code (Fixed Delivery Territory)</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>LOCKED</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
                <div className="bg-white rounded-lg p-1.5 px-2 border border-amber-200">
                  <span className="text-[10px] text-stone-500 block">City</span>
                  <span className="font-bold text-stone-900">Chandpur, Uttar Pradesh</span>
                </div>
                <div className="bg-white rounded-lg p-1.5 px-2 border border-amber-200">
                  <span className="text-[10px] text-stone-500 block">Pin Code</span>
                  <span className="font-bold text-stone-900 font-mono text-xs tracking-wider">246725</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Save Profile</span>
            </button>

            {/* Switch to Login */}
            <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-200">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); setLoginError(''); }}
                className="font-bold text-amber-800 hover:underline cursor-pointer ml-1"
              >
                Sign In with Email & Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
