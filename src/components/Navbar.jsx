import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({
  activePage,
  setActivePage,
  userRole = 'student',
  isLoggedIn = false,
  setIsLoggedIn,
  userProfile,
  setUserProfile
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form state for profile editing modal
  const [editFormData, setEditFormData] = useState({
    name: userProfile?.name || 'Ajay Kumar',
    headline: userProfile?.headline || 'Full Stack Engineer & AI Specialist',
    organization: userProfile?.organization || 'Delhi Technological University',
    bio: userProfile?.bio || 'Passionate about building scalable AI ecosystems and microservice backends.'
  });

  // Dynamic Navigation Links mapped strictly to user role
  const publicLinks = [
    { id: 'home', label: 'Home' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'skill-market', label: 'Skill Market' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const studentLinks = [
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'skill-dna', label: 'Skill DNA' },
    { id: 'career-twin', label: 'AI Career Twin' },
    { id: 'opportunities', label: 'Matched Jobs' },
    { id: 'assessment', label: 'Diagnostic' },
    { id: 'skill-market', label: 'Skill Market' }
  ];

  const institutionLinks = [
    { id: 'institution-dashboard', label: 'Cohort Analytics' },
    { id: 'opportunities', label: 'Placement Pipeline' },
    { id: 'skill-market', label: 'Curriculum Gaps' },
    { id: 'search', label: 'Student Lookup' },
    { id: 'about', label: 'Institutional Vision' }
  ];

  const companyLinks = [
    { id: 'company-dashboard', label: 'Candidate Ranker' },
    { id: 'search', label: 'Talent Discovery' },
    { id: 'opportunities', label: 'Manage Postings' },
    { id: 'skill-market', label: 'Market Velocity' },
    { id: 'contact', label: 'Support Escalation' }
  ];

  const navLinks = !isLoggedIn
    ? publicLinks
    : userRole === 'institution'
    ? institutionLinks
    : userRole === 'company'
    ? companyLinks
    : studentLinks;

  // Intercept Protected Routes: Bina login ke assessment ya dashboard par click ho toh 'auth' page par bhejo
  const handleNavClick = (routeId) => {
    if ((routeId === 'assessment' || routeId === 'dashboard' || routeId === 'skill-dna') && !isLoggedIn) {
      setActivePage('auth');
      setMobileMenuOpen(false);
      return;
    }
    setActivePage(routeId);
    setMobileMenuOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Profile Picture File Change
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (setUserProfile) {
          setUserProfile((prev) => ({
            ...prev,
            avatarUrl: uploadEvent.target.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (setUserProfile) {
      setUserProfile((prev) => ({
        ...prev,
        name: editFormData.name,
        headline: editFormData.headline,
        organization: editFormData.organization,
        bio: editFormData.bio
      }));
    }
    setEditModalOpen(false);
  };

  const handleLogout = () => {
    if (setIsLoggedIn) setIsLoggedIn(false);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setActivePage('home');
  };

  const initials = (userProfile?.name || 'Ajay Kumar')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sb-navbar">
        <div className="sb-nav-container">
          {/* Logo */}
          <div
            className="sb-nav-left"
            onClick={() => setActivePage(isLoggedIn ? (userRole === 'institution' ? 'institution-dashboard' : userRole === 'company' ? 'company-dashboard' : 'dashboard') : 'home')}
          >
            <div className="sb-logo-glyph">
              <span>▲</span>
              <span>▼</span>
            </div>
            <div className="sb-brand-text">
              <span className="brand-name">SkillBridge</span>
              <span className="brand-badge">AI</span>
            </div>
          </div>

          {/* Role-Adaptive Center Links */}
          <nav className="sb-nav-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={`sb-link ${activePage === link.id ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Navigation & Profile Avatar Dropdown */}
          <div className="sb-nav-right">
            {!isLoggedIn ? (
              <button className="sb-auth-btn" onClick={() => setActivePage('auth')}>
                <span className="auth-sparkle">✦</span>
                <span>Sign In / Register</span>
              </button>
            ) : (
              <div className="sb-profile-menu-container" ref={dropdownRef}>
                <button
                  className={`sb-avatar-trigger ${dropdownOpen ? 'open' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User Menu"
                >
                  <div className="avatar-circle">
                    {userProfile?.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="Avatar" className="user-avatar-img" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <span className="online-indicator"></span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="sb-profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dd-avatar-preview">
                        {userProfile?.avatarUrl ? (
                          <img src={userProfile.avatarUrl} alt="Avatar" className="user-avatar-img" />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="dd-user-meta">
                        <span className="dd-name">{userProfile?.name || 'Ajay Kumar'}</span>
                        <span className="dd-role-badge">{(userRole || 'student').toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="dropdown-menu-list">
                      {/* Edit Profile Action */}
                      <button
                        className="dd-item"
                        onClick={() => {
                          setEditModalOpen(true);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="dd-icon">✏️</span>
                        <span>Edit Profile & Avatar</span>
                      </button>

                      <button
                        className="dd-item"
                        onClick={() => {
                          if (userRole === 'institution') setActivePage('institution-dashboard');
                          else if (userRole === 'company') setActivePage('company-dashboard');
                          else setActivePage('dashboard');
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="dd-icon">📊</span>
                        <span>Dashboard</span>
                      </button>

                      {userRole === 'student' && (
                        <button
                          className="dd-item"
                          onClick={() => {
                            setActivePage('skill-dna');
                            setDropdownOpen(false);
                          }}
                        >
                          <span className="dd-icon">◈</span>
                          <span>My Skill DNA</span>
                        </button>
                      )}

                      <div className="dd-divider"></div>

                      <button className="dd-item dd-logout" onClick={handleLogout}>
                        <span className="dd-icon">🚪</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assessment Button: Sirf tab dikhega jab user logged in na ho YA fir user student ho */}
            {(!isLoggedIn || userRole === 'student') && (
              <button className="sb-cta-btn" onClick={() => handleNavClick('assessment')}>
                Assessment
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div className={`sb-mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-links-wrapper">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={`mobile-link-item ${activePage === link.id ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </button>
            ))}

            {isLoggedIn ? (
              <div className="mobile-drawer-bottom">
                <button
                  className="mobile-link-item"
                  onClick={() => {
                    setEditModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  ✏️ Edit Profile
                </button>
                <button className="mobile-btn-logout" onClick={handleLogout}>
                  🚪 Log Out
                </button>
              </div>
            ) : (
              <div className="mobile-drawer-bottom">
                <button 
                  className="mobile-link-item text-cyan" 
                  onClick={() => { setActivePage('auth'); setMobileMenuOpen(false); }}
                >
                  ✦ Sign In / Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Edit & Picture Change Modal */}
      {editModalOpen && (
        <div className="modal-backdrop">
          <div className="edit-modal-card">
            <div className="modal-header">
              <span className="modal-badge">Identity Management</span>
              <h3>Edit Profile & Credentials</h3>
              <button className="modal-close-btn" onClick={() => setEditModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="avatar-uploader-section">
              <div className="modal-avatar-preview">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar Preview" className="modal-avatar-img" />
                ) : (
                  <span className="modal-avatar-initials">{initials}</span>
                )}
              </div>

              <div className="avatar-upload-cta">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="btn-upload-avatar"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Profile Photo
                </button>
                <span className="upload-note">PNG, JPG, or GIF up to 5MB</span>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-edit-form">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  {userRole === 'institution'
                    ? 'Institution / University Name'
                    : userRole === 'company'
                    ? 'Enterprise Organization'
                    : 'College / Affiliation'}
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.organization}
                  onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Professional Focus / Target Headline</label>
                <input
                  type="text"
                  value={editFormData.headline}
                  onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Profile Biography</label>
                <textarea
                  rows="3"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}