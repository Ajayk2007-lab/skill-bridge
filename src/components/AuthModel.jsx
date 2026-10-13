import React, { useState } from 'react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please provide all credentials.');
      return;
    }
    setError('');

    // Successful login object
    const candidateData = {
      name: isSignUp ? name : email.split('@')[0],
      email: email
    };

    onSuccess(candidateData);
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-frame">
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-modal-header">
          <div className="auth-shield-icon">⛊</div>
          <span className="auth-security-tag">AUTHENTICATION REQUIRED</span>
          <h2 className="auth-modal-title">
            {isSignUp ? 'Create Candidate Account' : 'Sign In to SkillBridge'}
          </h2>
          <p className="auth-modal-subtext">
            Diagnostic skill assessments and biometric verification require an authenticated account.
          </p>
        </div>

        {error && <div className="auth-error-banner">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-body">
          {isSignUp && (
            <div className="auth-input-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="e.g. Ajay Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <label>COLLEGE / WORK EMAIL</label>
            <input
              type="email"
              placeholder="candidate@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isSignUp ? 'Create Account & Start Assessment →' : 'Sign In & Start Assessment →'}
          </button>
        </form>

        <div className="auth-modal-footer">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" className="auth-toggle-link" onClick={() => { setIsSignUp(false); setError(''); }}>
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" className="auth-toggle-link" onClick={() => { setIsSignUp(true); setError(''); }}>
                Create One
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}