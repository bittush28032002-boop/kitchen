import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Package, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  Edit3,
  Camera
} from 'lucide-react';
import { userService, notificationService, eventBus, DOMAIN_EVENTS } from '../services/microservices';
import { User, CustomerInfo } from '../types';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onViewOrder: (orderId: string) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onViewOrder
}) => {
  const [currentUser, setCurrentUser] = useState<User>(userService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'auth'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Auth form fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.savedAddresses?.[0]?.phone || '+91 98765 43210');
  const [profileAvatar, setProfileAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  // New Address form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    country: 'India'
  });
  const [addrSetDefault, setAddrSetDefault] = useState(true);

  const isGuest = currentUser.id.startsWith('guest-');

  useEffect(() => {
    const unsub = eventBus.subscribe(DOMAIN_EVENTS.USER_LOGGED_IN, (user: User) => {
      setCurrentUser(user);
      setProfileName(user.name);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await userService.signIn(authEmail, authPassword);
      if (res.success && res.user) {
        notificationService.notify('success', 'Welcome Back', `Logged in as ${res.user.name}`);
        setAuthLoading(false);
        setActiveTab('profile');
      } else {
        setAuthError(res.error || 'Failed to sign in. Please verify your credentials.');
        setAuthLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during login');
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authFullName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }
    setAuthLoading(true);

    try {
      const res = await userService.signUp(authFullName, authEmail, authPassword);
      if (res.success && res.user) {
        notificationService.notify('success', 'Account Created', `Welcome to KitchenCraft, ${res.user.name}!`);
        setAuthLoading(false);
        setActiveTab('profile');
      } else {
        setAuthError(res.error || 'Signup failed');
        setAuthLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during registration');
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError('Please enter your email address');
      return;
    }
    setAuthLoading(true);
    const res = await userService.resetPassword(authEmail);
    setAuthLoading(false);
    notificationService.notify('info', 'Password Reset', res.message);
    setAuthMode('login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    userService.updateProfile({
      name: profileName,
      phone: profilePhone
    });
    setIsEditingProfile(false);
    notificationService.notify('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address || !newAddr.city || !newAddr.postalCode) {
      notificationService.notify('error', 'Incomplete Form', 'Please fill in address line, city and PIN code.');
      return;
    }
    await userService.addAddress(newAddr, addrSetDefault);
    setIsAddingAddress(false);
    setNewAddr({
      firstName: '',
      lastName: '',
      email: currentUser.email,
      phone: profilePhone,
      address: '',
      apartment: '',
      city: '',
      state: 'Karnataka',
      postalCode: '',
      country: 'India'
    });
    notificationService.notify('success', 'Address Saved', 'New delivery address added to your account.');
  };

  const handleDeleteAddress = async (idx: number) => {
    await userService.deleteAddress(idx);
    notificationService.notify('info', 'Address Removed', 'Delivery address was deleted.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-[#FAF9F6] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E7E3D8] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#13271D] text-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#274735] flex items-center justify-center text-[#E5EFE9]">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold tracking-tight text-white">
                {isGuest && activeTab === 'auth' ? 'KitchenCraft Account' : currentUser.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#9BB3A5]">
                <span>{currentUser.email}</span>
                <span className="w-1 h-1 rounded-full bg-[#9BB3A5]"></span>
                <span className="capitalize font-medium text-[#C7DDD0]">
                  {currentUser.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#BED2C5] hover:text-white rounded-lg hover:bg-[#203D2D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E4DA] bg-[#F3F0E8] px-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#13271D] text-[#13271D] font-semibold'
                : 'border-transparent text-[#66776E] hover:text-[#13271D]'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#13271D] text-[#13271D] font-semibold'
                : 'border-transparent text-[#66776E] hover:text-[#13271D]'
            }`}
          >
            Addresses ({currentUser.savedAddresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'auth'
                ? 'border-[#13271D] text-[#13271D] font-semibold'
                : 'border-transparent text-[#66776E] hover:text-[#13271D]'
            }`}
          >
            {isGuest ? 'Sign In / Register' : 'Authentication & Security'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-[#27342C]">
          {/* ================= TAB 1: PROFILE OVERVIEW ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-xl bg-white border border-[#EBE7DD] shadow-xs flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <img
                    src={profileAvatar}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#13271D]/20 shadow-xs"
                  />
                  <button 
                    onClick={() => {
                      const newUrl = prompt('Enter image URL for avatar:', profileAvatar);
                      if (newUrl) setProfileAvatar(newUrl);
                    }}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#13271D] text-white shadow-md hover:bg-[#203D2D] transition-transform active:scale-95 cursor-pointer"
                    title="Change Avatar"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-serif text-lg font-semibold text-[#13271D]">{currentUser.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E5EFE9] text-[#13271D] font-semibold">
                      {currentUser.role === 'admin' ? 'Store Admin' : 'Customer'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7B71] mt-0.5">{currentUser.email}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#526358]">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#13271D]" />
                      <span>{profilePhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#13271D]" />
                      <span>ID: {currentUser.id.substring(0, 12)}...</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#D5D0C3] hover:bg-[#F3F0E8] text-xs font-medium text-[#13271D] transition-colors flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {/* Edit Profile Form */}
              {isEditingProfile && (
                <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-[#F4F1E9] border border-[#E2DDD0] space-y-4 animate-in fade-in duration-200">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-[#13271D]">Edit Personal Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#46574D] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#46574D] mb-1">Phone Number (with +91)</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#65766C] hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Account Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentUser.role === 'admin' ? (
                  <div className="p-4 rounded-xl bg-[#EAF0EC] border border-[#C5D7CC] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#13271D] font-semibold text-xs mb-1">
                        <ShieldCheck className="w-4 h-4 text-[#204F36]" />
                        <span>Admin Privileges Active</span>
                      </div>
                      <p className="text-[11px] text-[#4F6456]">
                        You have full management access to the product catalog, order workflows, coupons, and Supabase database.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdmin();
                      }}
                      className="mt-3 w-full py-2 rounded-lg bg-[#13271D] hover:bg-[#203D2D] text-white text-xs font-medium transition-colors text-center cursor-pointer"
                    >
                      Open Store Admin Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white border border-[#EBE7DD] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#13271D]">Customer Privileges</span>
                      <p className="text-[11px] text-[#6B7B71] mt-1">
                        You are shopping as an authenticated customer with real-time address persistence and order tracking.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        userService.toggleRole();
                        notificationService.notify('info', 'Role Switched', 'Switched to Store Administrator for testing.');
                      }}
                      className="mt-3 text-xs text-[#2A5941] hover:underline text-left font-medium cursor-pointer"
                    >
                      Switch to Store Admin (Test Mode) →
                    </button>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-white border border-[#EBE7DD] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#13271D]">Fast Order Tracking</span>
                    <p className="text-[11px] text-[#6B7B71] mt-1">
                      Check live shipping updates, dispatch manifests and delivery estimates for your recent purchases.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onViewOrder('KC-2026-000001');
                    }}
                    className="mt-3 py-1.5 px-3 rounded-lg border border-[#D5D0C3] hover:bg-[#F3F0E8] text-xs font-medium text-[#13271D] text-center cursor-pointer"
                  >
                    Track Sample Order (KC-2026-000001)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: ADDRESSES ================= */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#13271D]">Delivery Addresses</h3>
                  <p className="text-xs text-[#6B7B71]">Manage shipping locations for Pan-India doorstep delivery.</p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleSaveAddress} className="p-4 rounded-xl bg-[#F4F1E9] border border-[#E2DDD0] space-y-3">
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-[#13271D]">Add Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#46574D] mb-1">First Name</label>
                      <input
                        type="text"
                        value={newAddr.firstName}
                        onChange={(e) => setNewAddr({ ...newAddr, firstName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#46574D] mb-1">Last Name</label>
                      <input
                        type="text"
                        value={newAddr.lastName}
                        onChange={(e) => setNewAddr({ ...newAddr, lastName: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#46574D] mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="House/Flat number, Building name, Street"
                      value={newAddr.address}
                      onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#46574D] mb-1">City</label>
                      <input
                        type="text"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#46574D] mb-1">State</label>
                      <select
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                      >
                        {['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Kerala'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#46574D] mb-1">PIN Code (6 digits)</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 560038"
                        value={newAddr.postalCode}
                        onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D0CAB9] text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="setDefault"
                      checked={addrSetDefault}
                      onChange={(e) => setAddrSetDefault(e.target.checked)}
                      className="rounded border-[#D0CAB9] text-[#13271D] focus:ring-[#13271D]"
                    />
                    <label htmlFor="setDefault" className="text-xs text-[#46574D]">Set as primary default address</label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#65766C]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {(currentUser.savedAddresses || []).map((addr, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-[#EBE7DD] shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#13271D] mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#13271D]">
                            {addr.firstName} {addr.lastName}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5EFE9] text-[#13271D] font-medium">
                              Default Delivery Address
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#46574D] mt-1">{addr.address}</p>
                        <p className="text-xs text-[#6B7B71]">
                          {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                        </p>
                        <p className="text-xs text-[#526358] mt-1">Phone: {addr.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="p-1.5 text-[#9A8D7D] hover:text-[#9B2C2C] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: AUTHENTICATION & LOGIN/SIGNUP ================= */}
          {activeTab === 'auth' && (
            <div className="max-w-md mx-auto py-2">
              <div className="text-center mb-6">
                <h3 className="font-serif text-xl font-semibold text-[#13271D]">
                  {authMode === 'login' ? 'Sign In to KitchenCraft' : authMode === 'signup' ? 'Create Customer Account' : 'Reset Account Password'}
                </h3>
                <p className="text-xs text-[#6B7B71] mt-1">
                  {authMode === 'login' 
                    ? 'Access persistent cart, order history, and exclusive artisan discounts.' 
                    : authMode === 'signup' 
                    ? 'Join our circle of passionate home cooks and dining connoisseurs.' 
                    : 'Enter your email address to receive password reset instructions.'}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#46574D] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#46574D]">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-[#29563E] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="pt-3 text-center text-xs text-[#6B7B71]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="font-semibold text-[#13271D] hover:underline cursor-pointer"
                    >
                      Sign up now
                    </button>
                  </div>
                </form>
              )}

              {/* Sign Up Form */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#46574D] mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#46574D] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="aarav.sharma@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#46574D] mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        minLength={6}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? 'Creating Profile...' : 'Create Account'}
                  </button>

                  <div className="pt-3 text-center text-xs text-[#6B7B71]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-semibold text-[#13271D] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Forgot Password */}
              {authMode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#46574D] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D0CAB9] text-xs focus:ring-1 focus:ring-[#13271D] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                  >
                    {authLoading ? 'Sending link...' : 'Send Reset Link'}
                  </button>

                  <div className="pt-3 text-center text-xs text-[#6B7B71]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-semibold text-[#13271D] hover:underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F3F0E8] border-t border-[#E8E4DA] flex items-center justify-between">
          <button
            onClick={async () => {
              await userService.signOut();
              notificationService.notify('info', 'Signed Out', 'You have been signed out.');
            }}
            className="text-xs text-[#7B6352] hover:text-[#9B2C2C] flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#13271D] hover:bg-[#1E3B2D] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
