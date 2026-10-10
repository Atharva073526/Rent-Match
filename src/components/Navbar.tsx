import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { NotificationDropdown } from './NotificationDropdown';
import { User, NotificationItem } from '../types';
import { store } from '../services/store';
import { 
  Menu, 
  X, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  notifications: NotificationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, notifications }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-[31px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/properties"
                className={`text-sm font-medium transition-colors ${
                  isActive('/properties') ? 'text-teal-600 font-semibold' : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                Find Homes
              </Link>
              <Link
                to="/how-it-works"
                className={`text-sm font-medium transition-colors ${
                  isActive('/how-it-works') ? 'text-teal-600 font-semibold' : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/pricing"
                className={`text-sm font-medium transition-colors ${
                  isActive('/pricing') ? 'text-teal-600 font-semibold' : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                Pricing
              </Link>
              <Link
                to="/safety"
                className={`text-sm font-medium transition-colors ${
                  isActive('/safety') ? 'text-teal-600 font-semibold' : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                Safety & Trust
              </Link>
              <Link
                to="/blog"
                className={`text-sm font-medium transition-colors ${
                  isActive('/blog') ? 'text-teal-600 font-semibold' : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                Knowledge Hub
              </Link>
            </nav>
          </div>

          {/* Right Section: CTAs & User Menu */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                {/* Secondary Role Actions */}
                <div className="hidden md:flex items-center gap-1.5 mr-2">
                  <Link
                    to="/matches"
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isActive('/matches') ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-navy-700 hover:bg-slate-100'
                    }`}
                    title="Mutual Matches"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Matches</span>
                  </Link>
                  <Link
                    to="/messages"
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isActive('/messages') ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-navy-700 hover:bg-slate-100'
                    }`}
                    title="Messages"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span>Chat</span>
                  </Link>
                  <Link
                    to="/applications"
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      isActive('/applications') ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-navy-700 hover:bg-slate-100'
                    }`}
                    title="Applications"
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Applications</span>
                  </Link>
                </div>

                {/* Landlord Quick CTA */}
                {currentUser.role === 'landlord' && (
                  <Link
                    to="/landlord/new-property"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Property
                  </Link>
                )}

                {/* Notifications */}
                <NotificationDropdown 
                  notifications={notifications} 
                  userId={currentUser.id} 
                />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                  >
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-navy-900 leading-tight">
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-teal-600 font-medium capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-navy-500 hidden md:block" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-modal border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-navy-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {currentUser.role}
                          </span>
                          {currentUser.isVerified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'tenant' && (
                          <Link
                            to="/tenant/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-navy-800 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-teal-600" />
                            Tenant Dashboard
                          </Link>
                        )}
                        {currentUser.role === 'landlord' && (
                          <Link
                            to="/landlord/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-navy-800 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-teal-600" />
                            Landlord Dashboard
                          </Link>
                        )}
                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 font-semibold hover:bg-amber-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Control Desk
                          </Link>
                        )}
                        <Link
                          to="/matches"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-navy-800 hover:bg-slate-50"
                        >
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          Mutual Matches
                        </Link>
                        <Link
                          to="/leases"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-navy-800 hover:bg-slate-50"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          Digital Leases
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-navy-800 hover:bg-slate-50"
                        >
                          <Settings className="w-4 h-4 text-navy-600" />
                          Profile & Verification
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => store.logout()}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-navy-800 hover:text-navy-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-navy-700 hover:text-navy-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
            >
              Find Homes
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
            >
              Pricing
            </Link>
            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
            >
              Safety & Verification
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
            >
              Knowledge Hub
            </Link>
            {currentUser && (
              <>
                <hr className="my-1 border-slate-100" />
                <Link
                  to={currentUser.role === 'tenant' ? '/tenant/dashboard' : '/landlord/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50"
                >
                  My Dashboard
                </Link>
                <Link
                  to="/matches"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
                >
                  Mutual Matches
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
                >
                  Messages
                </Link>
                <Link
                  to="/leases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-slate-50"
                >
                  Digital Leases
                </Link>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50"
                  >
                    Admin Control Desk
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
