import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './services/store';

// Core UI Components
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { Pricing } from './pages/Pricing';
import { Safety } from './pages/Safety';
import { Help } from './pages/Help';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { TenantDashboard } from './pages/TenantDashboard';
import { LandlordDashboard } from './pages/LandlordDashboard';
import { LandlordListingWizard } from './pages/LandlordListingWizard';
import { Matches } from './pages/Matches';
import { Messages } from './pages/Messages';
import { Applications } from './pages/Applications';
import { Leases } from './pages/Leases';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';

export const App: React.FC = () => {
  // Subscribe to reactive store changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentUser = store.getCurrentUser();
  const notifications = currentUser ? store.getNotificationsForUser(currentUser.id) : [];

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-background text-navy-900 font-sans selection:bg-teal-100 selection:text-teal-900">
        {/* Interactive Persona Demo Switcher Banner */}
        <DemoBanner currentUser={currentUser} />

        {/* Global Navigation Header */}
        <Navbar currentUser={currentUser} notifications={notifications} />

        {/* Page Content Body */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Authenticated / Role Protected Pages */}
            <Route 
              path="/tenant/dashboard" 
              element={currentUser?.role === 'tenant' ? <TenantDashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/landlord/dashboard" 
              element={currentUser?.role === 'landlord' ? <LandlordDashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/landlord/new-property" 
              element={currentUser?.role === 'landlord' ? <LandlordListingWizard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/landlord/edit-property/:id" 
              element={currentUser?.role === 'landlord' ? <LandlordListingWizard /> : <Navigate to="/login" replace />} 
            />

            <Route path="/matches" element={currentUser ? <Matches /> : <Navigate to="/login" replace />} />
            <Route path="/messages" element={currentUser ? <Messages /> : <Navigate to="/login" replace />} />
            <Route path="/applications" element={currentUser ? <Applications /> : <Navigate to="/login" replace />} />
            <Route path="/leases" element={currentUser ? <Leases /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={currentUser ? <Settings /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={<Admin />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
