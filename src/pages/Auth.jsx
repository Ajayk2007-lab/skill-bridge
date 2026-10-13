import React, { useState, useEffect } from 'react';
import './Auth.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Auth({ 
  setActivePage, 
  setUserRole, 
  setIsLoggedIn, 
  setUserProfile,
  initialMode = 'signup' 
}) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // Step 1: Email, Step 2: OTP + New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Google Account Chooser Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Pre-configured detected Google Accounts on device
  const [detectedGoogleAccounts, setDetectedGoogleAccounts] = useState(() => {
    const saved = localStorage.getItem('sb_device_google_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        name: 'Ajay Kumar',
        email: 'ajaykumar.official@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ajay',
        lastUsed: true
      },
      {
        name: 'Ajay (College ID)',
        email: '15114802725.ajay@dtu.ac.in',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK',
        lastUsed: false
      }
    ];
  });

  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
  }, [initialMode]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (setUserRole) setUserRole(role);
    setError('');
    if (successMsg) setSuccessMsg('');
  };

  // Role Configuration
  const roleConfig = {
    student: {
      userTerm: 'Candidate',
      portalTitle: isSignUp ? 'Initialize Candidate Identity' : 'Candidate Authentication',
      subDesc: isSignUp
        ? 'Register your student credentials to link your verified GitHub, Skill DNA, and proctored diagnostics.'
        : 'Sign in to access your proctored diagnostic logs, assessments, and placement recommendations.',
      nameLabel: 'FULL CANDIDATE NAME',
      namePlaceholder: 'e.g. Ajay Kumar',
      emailLabel: 'STUDENT / ACADEMIC EMAIL',
      emailPlaceholder: 'candidate@university.edu',
      orgLabel: 'CURRENT COLLEGE / UNIVERSITY AFFILIATION',
      orgPlaceholder: 'e.g. Delhi Technological University',
      ctaText: isSignUp ? 'Register & Unlock Diagnostics →' : 'Authenticate & Launch Student Hub →',
      altSwitchText: 'Create Candidate Account'
    },
    institution: {
      userTerm: 'Academic Administrator',
      portalTitle: isSignUp ? 'Register Institution / University' : 'Institutional Dean & Faculty Portal',
      subDesc: isSignUp
        ? 'Onboard your university or department to monitor cohort skill readiness and curriculum gap matrices.'
        : 'Sign in to access live cohort analytics, curriculum alignment diagnostics, and student lookups.',
      nameLabel: 'DEAN / NODAL OFFICER NAME',
      namePlaceholder: 'e.g. Dr. Rajesh Sharma',
      emailLabel: 'OFFICIAL INSTITUTIONAL EMAIL (.edu / .ac.in)',
      emailPlaceholder: 'dean.academics@dtu.ac.in',
      orgLabel: 'UNIVERSITY / INSTITUTION NAME',
      orgPlaceholder: 'e.g. Delhi Technological University',
      ctaText: isSignUp ? 'Register Academic Entity →' : 'Access Institutional Analytics →',
      altSwitchText: 'Register Institution Profile'
    },
    company: {
      userTerm: 'Corporate Recruiter',
      portalTitle: isSignUp ? 'Register Enterprise Recruiter' : 'Corporate Talent Acquisition Portal',
      subDesc: isSignUp
        ? 'Create an enterprise employer profile to search verified skill vectors, post roles, and rank talent.'
        : 'Sign in to access candidate ranker, live skill demand telemetry, and recruitment pipelines.',
      nameLabel: 'TALENT LEAD / RECRUITER NAME',
      namePlaceholder: 'e.g. Sneha Kapoor',
      emailLabel: 'CORPORATE WORK EMAIL',
      emailPlaceholder: 'sneha.k@enterprise.com',
      orgLabel: 'COMPANY / ENTERPRISE ORGANIZATION',
      orgPlaceholder: 'e.g. Google India, Microsoft, Zomato',
      ctaText: isSignUp ? 'Create Corporate Account →' : 'Access Talent Ranker →',
      altSwitchText: 'Create Enterprise Account'
    }
  };

  const currentRoleConfig = roleConfig[selectedRole] || roleConfig.student;

  // Real FastAPI Backend Connected Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetEmail = formData.email.trim().toLowerCase();
    const targetPassword = formData.password.trim();

    if (!targetEmail || !targetPassword || (isSignUp && (!formData.name.trim() || !formData.phone.trim()))) {
      setError('Please provide all mandatory credentials including Phone Number.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp ? `${API_BASE_URL}/api/signup` : `${API_BASE_URL}/api/login`;
      const payload = isSignUp
        ? {
            name: formData.name.trim(),
            email: targetEmail,
            phone: formData.phone.trim(),
            password: targetPassword,
            role: selectedRole,
            organization: formData.organization.trim() || (selectedRole === 'student' ? 'Delhi Technological University' : 'Corporate Enterprise')
          }
        : {
            email: targetEmail,
            password: targetPassword
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed. Please verify your credentials.');
      }

      // Store JWT token in localStorage
      localStorage.setItem('sb_token', data.access_token);
      localStorage.setItem('sb_user_profile', JSON.stringify(data.user));

      if (setUserProfile) {
        setUserProfile(prev => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          organization: data.user.organization
        }));
      }

      if (setUserRole) setUserRole(data.user.role || selectedRole);
      if (setIsLoggedIn) setIsLoggedIn(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 - Send OTP Request
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.includes('@')) {
      setForgotError('Please enter a valid registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'User with this email not found.');
      }

      setForgotSuccess(`OTP sent to ${forgotEmail}. (Demo Verification OTP: ${data.demo_otp})`);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password: Step 2 - Verify OTP and Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!resetOtp.trim() || newPassword.length < 4) {
      setForgotError('Please provide a valid OTP and a password with at least 4 characters.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: resetOtp.trim(),
          new_password: newPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password.');
      }

      setSuccessMsg('Password reset successfully! Please sign in with your new password.');
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail('');
      setResetOtp('');
      setNewPassword('');
      setIsSignUp(false);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Google Account Chooser Handler
  const selectGoogleAccount = (acc) => {
    setShowGoogleModal(false);
    setLoading(true);

    setTimeout(() => {
      if (setUserProfile) {
        setUserProfile(prev => ({
          ...prev,
          name: acc.name,
          email: acc.email,
          organization: selectedRole === 'student' ? 'Delhi Technological University' : 'Enterprise Partner',
          avatarUrl: acc.avatar || prev?.avatarUrl
        }));
      }

      if (setUserRole) setUserRole(selectedRole);
      if (setIsLoggedIn) setIsLoggedIn(true);
      setLoading(false);
    }, 600);
  };

  const handleAddNewGoogleAccount = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.includes('@')) {
      alert('Please enter a valid Google Account email.');
      return;
    }
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const cleanName = customGoogleName.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    const newGoogleAcc = {
      name: cleanName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${cleanName}`,
      lastUsed: true
    };

    const updated = [newGoogleAcc, ...detectedGoogleAccounts.filter(a => a.email !== cleanEmail)];
    setDetectedGoogleAccounts(updated);
    localStorage.setItem('sb_device_google_accounts', JSON.stringify(updated));

    setShowAddGoogleAccount(false);
    selectGoogleAccount(newGoogleAcc);
  };

  return (
    <div className="sb-auth-page">
      <div className="auth-ambient-grid"></div>
      <div className="auth-glow-orb orb-left"></div>
      <div className="auth-glow-orb orb-right"></div>

      <div className="sb-auth-card">
        {/* Terminal Header */}
        <div className="auth-card-header">
          <div className="auth-badge-status">
            <span className="pulse-dot"></span>
            <span>SIH26044 // {selectedRole.toUpperCase()} GATEWAY</span>
          </div>
          <h1 className="auth-main-heading">
            {currentRoleConfig.portalTitle}
          </h1>
          <p className="auth-sub-desc">
            {currentRoleConfig.subDesc}
          </p>
        </div>

        {/* Tab Toggle: Sign Up vs Sign In */}
        <div className="auth-mode-tabs">
          <button 
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
          >
            {isSignUp ? '✦ Create Account' : 'Create Account'}
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
          >
            {!isSignUp ? '✦ Sign In' : 'Sign In'}
          </button>
        </div>

        {/* Role Selector */}
        <div className="auth-role-selector">
          <span className="role-selector-label">SELECT ACCESS VERTICAL:</span>
          <div className="role-pills-row">
            <button
              type="button"
              className={`role-pill ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              🎓 Student
            </button>
            <button
              type="button"
              className={`role-pill ${selectedRole === 'institution' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('institution')}
            >
              🏛 Institution
            </button>
            <button
              type="button"
              className={`role-pill ${selectedRole === 'company' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('company')}
            >
              🏢 Recruiter
            </button>
          </div>
        </div>

        {/* Google 1-Click Auth Trigger Button */}
        <button 
          type="button" 
          className="google-auth-btn" 
          onClick={() => setShowGoogleModal(true)}
          disabled={loading}
        >
          <svg className="google-icon-svg" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
          </svg>
          <span>{isSignUp ? `Sign up with Google as ${currentRoleConfig.userTerm}` : `Continue with Google`}</span>
        </button>

        <div className="auth-divider-line">
          <span>OR USE CREDENTIALS</span>
        </div>

        {error && <div className="auth-error-chip">⚠ {error}</div>}
        {successMsg && <div className="auth-success-chip">✓ {successMsg}</div>}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form-fields">
          {isSignUp && (
            <div className="auth-field">
              <label>{currentRoleConfig.nameLabel}</label>
              <input
                type="text"
                name="name"
                placeholder={currentRoleConfig.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>{currentRoleConfig.emailLabel}</label>
            <input
              type="email"
              name="email"
              placeholder={currentRoleConfig.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* New Phone Number Field in Signup */}
          {isSignUp && (
            <div className="auth-field">
              <label>CONTACT PHONE NUMBER</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {isSignUp && (
            <div className="auth-field">
              <label>{currentRoleConfig.orgLabel}</label>
              <input
                type="text"
                name="organization"
                placeholder={currentRoleConfig.orgPlaceholder}
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>ACCESS SECURITY KEY / PASSWORD</label>
              {/* Forgot Password Button for Login Mode */}
              {!isSignUp && (
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                  onClick={() => {
                    setForgotEmail(formData.email);
                    setForgotError('');
                    setForgotSuccess('');
                    setForgotStep(1);
                    setShowForgotModal(true);
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-action-btn" disabled={loading}>
            {loading ? (
              <span className="loader-text">VERIFYING WITH FASTAPI SERVER...</span>
            ) : (
              currentRoleConfig.ctaText
            )}
          </button>
        </form>

        {/* Card Footer */}
        <div className="auth-card-footer">
          {isSignUp ? (
            <p>
              Already registered as {currentRoleConfig.userTerm}?{' '}
              <button 
                type="button" 
                className="auth-switch-link" 
                onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
              >
                Sign In Instead
              </button>
            </p>
          ) : (
            <p>
              New {currentRoleConfig.userTerm}?{' '}
              <button 
                type="button" 
                className="auth-switch-link" 
                onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
              >
                {currentRoleConfig.altSwitchText}
              </button>
            </p>
          )}

          <button 
            type="button" 
            className="auth-return-home" 
            onClick={() => setActivePage('home')}
          >
            ← Return to Homepage
          </button>
        </div>
      </div>

      {/* ========================================================
          PASSWORD RECOVERY / FORGOT PASSWORD MODAL
          ======================================================== */}
      {showForgotModal && (
        <div className="google-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="google-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <span style={{ fontSize: '28px', marginBottom: '8px' }}>🔐</span>
              <h3>Account Recovery</h3>
              <p>Reset your SkillBridge credentials using verification OTP</p>
            </div>

            {forgotError && <div className="auth-error-chip" style={{ margin: '10px 15px' }}>⚠ {forgotError}</div>}
            {forgotSuccess && <div className="auth-success-chip" style={{ margin: '10px 15px' }}>✓ {forgotSuccess}</div>}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="add-google-acc-form">
                <div className="g-input-field">
                  <label>REGISTERED EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="g-btn-actions">
                  <button 
                    type="button" 
                    className="btn-g-cancel" 
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-g-confirm" disabled={forgotLoading}>
                    {forgotLoading ? 'Generating OTP...' : 'Send OTP →'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="add-google-acc-form">
                <div className="g-input-field">
                  <label>ENTER 6-DIGIT OTP</label>
                  <input
                    type="text"
                    placeholder="e.g. 849201"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="g-input-field">
                  <label>NEW SECURITY PASSWORD</label>
                  <input
                    type="password"
                    placeholder="New Secure Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="g-btn-actions">
                  <button 
                    type="button" 
                    className="btn-g-cancel" 
                    onClick={() => setForgotStep(1)}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-g-confirm" disabled={forgotLoading}>
                    {forgotLoading ? 'Updating Password...' : 'Reset & Save Password →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          GOOGLE ACCOUNT SELECTOR MODAL
          ======================================================== */}
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="google-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <svg className="google-header-logo" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
              </svg>
              <h3>Choose an account</h3>
              <p>to continue to <strong>SkillBridge AI</strong></p>
            </div>

            {!showAddGoogleAccount ? (
              <div className="google-accounts-list">
                {detectedGoogleAccounts.map((acc, idx) => (
                  <div 
                    key={idx} 
                    className="google-account-item" 
                    onClick={() => selectGoogleAccount(acc)}
                  >
                    <img src={acc.avatar} alt={acc.name} className="g-avatar-circle" />
                    <div className="g-account-details">
                      <div className="g-acc-name">{acc.name}</div>
                      <div className="g-acc-email">{acc.email}</div>
                    </div>
                  </div>
                ))}

                <div 
                  className="google-account-item use-another-acc" 
                  onClick={() => setShowAddGoogleAccount(true)}
                >
                  <div className="g-avatar-icon-circle">👤</div>
                  <div className="g-account-details">
                    <div className="g-acc-name">Use another account</div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddNewGoogleAccount} className="add-google-acc-form">
                <p className="add-acc-hint">Sign in with your other Google Account</p>
                
                <div className="g-input-field">
                  <label>YOUR NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Ajay Kumar"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                  />
                </div>

                <div className="g-input-field">
                  <label>GOOGLE EMAIL ID</label>
                  <input
                    type="email"
                    placeholder="your.name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="g-btn-actions">
                  <button 
                    type="button" 
                    className="btn-g-cancel" 
                    onClick={() => setShowAddGoogleAccount(false)}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-g-confirm">
                    Next &amp; Authorize →
                  </button>
                </div>
              </form>
            )}

            <div className="google-modal-footer">
              <span>To continue, Google will share your name, email address, and language preference with SkillBridge.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}