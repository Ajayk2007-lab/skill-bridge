import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Assessment from './pages/Assessment';
import Auth from './pages/Auth';
import CareerTwin from './pages/CareerTwin';
import Dashboard from './pages/Dashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import Opportunities from './pages/Opportunities';
import SkillDNA from './pages/SkillDNA';
import SkillMarket from './pages/SkillMarket';
import Searchpage from './pages/Searchpage';
import Contact from './pages/Contact';

import './index.css';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [userRole, setUserRole] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postAuthTarget, setPostAuthTarget] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' ya 'signup'

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Ajay Kumar',
    organization: 'Delhi Technological University',
    headline: 'Full Stack Engineer & AI Specialist',
    bio: 'Building SkillBridge AI for Smart India Hackathon 2026.',
    avatarUrl: null
  });

  const protectedRoutes = [
    'assessment',
    'dashboard',
    'analysis',
    'skill-dna',
    'career-twin',
    'institution-dashboard',
    'company-dashboard'
  ];

  // NAVIGATION GUARD: Role protection + Auth interception
  const handleProtectedNavigate = (page, mode = 'signup') => {
    const targetPage = page === 'analysis' ? 'dashboard' : page;

    // 1. Institution aur Company ke liye Assessment block karein
    if (targetPage === 'assessment' && isLoggedIn && userRole !== 'student') {
      if (userRole === 'institution') setActivePage('institution-dashboard');
      else if (userRole === 'company') setActivePage('company-dashboard');
      return;
    }

    // 2. Unauthenticated user ko Auth page par bhejein
    if (protectedRoutes.includes(targetPage) && !isLoggedIn) {
      setPostAuthTarget(targetPage);
      setAuthMode(mode);
      setActivePage('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRoleDashboard = () => {
    if (userRole === 'institution') return <InstitutionDashboard />;
    if (userRole === 'company') return <CompanyDashboard />;
    return <Dashboard setActivePage={handleProtectedNavigate} />;
  };

  return (
    <div className="skillbridge-root" style={{ background: '#03070d', minHeight: '100vh', color: '#ffffff' }}>
      <Navbar 
        activePage={activePage} 
        setActivePage={handleProtectedNavigate} 
        userRole={userRole} 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />

      {isLoggedIn ? (
        /* LOGGED IN VIEW */
        <div style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 70px)', background: '#03070d' }}>
          <Sidebar 
            activePage={activePage} 
            setActivePage={handleProtectedNavigate} 
            userRole={userRole} 
            userProfile={userProfile}
          />

          <div style={{ flex: 1, padding: '24px clamp(16px, 3vw, 40px)', overflowY: 'auto' }}>
            {(activePage === 'home' || activePage === 'dashboard') && renderRoleDashboard()}
            {activePage === 'institution-dashboard' && <InstitutionDashboard />}
            {activePage === 'company-dashboard' && <CompanyDashboard />}
            {activePage === 'skill-dna' && <SkillDNA />}
            {activePage === 'career-twin' && <CareerTwin setActivePage={handleProtectedNavigate} />}
            {activePage === 'opportunities' && <Opportunities />}
            {activePage === 'skill-market' && <SkillMarket />}
            {activePage === 'search' && <Searchpage setActivePage={handleProtectedNavigate} />}
            
            {/* Assessment is only accessible by students */}
            {activePage === 'assessment' && userRole === 'student' && (
              <Assessment setActivePage={handleProtectedNavigate} />
            )}
            
            {activePage === 'about' && <About setActivePage={handleProtectedNavigate} />}
            {activePage === 'contact' && <Contact />}
          </div>
        </div>
      ) : (
        /* PUBLIC VIEW */
        <main>
          {activePage === 'home' && <Home setActivePage={handleProtectedNavigate} />}
          {activePage === 'about' && <About setActivePage={handleProtectedNavigate} />}
          {activePage === 'opportunities' && <Opportunities />}
          {activePage === 'skill-dna' && <SkillDNA />}
          {activePage === 'skill-market' && <SkillMarket />}
          {activePage === 'contact' && <Contact />}
          {(activePage === 'auth' || activePage === 'assessment') && (
            <Auth 
              setActivePage={setActivePage} 
              setUserRole={setUserRole} 
              setUserProfile={setUserProfile}
              initialMode={authMode}
              setIsLoggedIn={(status) => {
                setIsLoggedIn(status);
                if (status) {
                  setActivePage(postAuthTarget || 'dashboard');
                }
              }} 
            />
          )}
        </main>
      )}

      <Footer setActivePage={handleProtectedNavigate} />

      <AIChat 
        activePage={activePage} 
        userRole={userRole} 
        setActivePage={handleProtectedNavigate} 
      />
    </div>
  );
}