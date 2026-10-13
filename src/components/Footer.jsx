import React from 'react';
import './Footer.css';

export default function Footer({ setActivePage }) {
  return (
    <footer className="sb-cyber-footer">
      <div className="cyber-footer-glow-bar"></div>

      <div className="cyber-footer-dock">
        {/* Brand Zone */}
        <div className="dock-brand-zone" onClick={() => setActivePage('home')}>
          <div className="brand-logo-glow">
            <span className="brand-icon-prism">◆</span>
            <span className="brand-text-cyber">SKILLBRIDGE</span>
            <span className="brand-badge-ai">AI</span>
          </div>
          <div className="dock-live-status">
            <span className="live-pulse-dot"></span>
            <span className="status-code">SIH26044 // ENGINE ONLINE</span>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="dock-nav-pills">
          <button className="dock-nav-btn" onClick={() => setActivePage('home')}>
            Home
          </button>
          <button className="dock-nav-btn" onClick={() => setActivePage('assessment', 'signup')}>
            Assessment
          </button>
          <button className="dock-nav-btn" onClick={() => setActivePage('skill-dna', 'signup')}>
            Skill DNA
          </button>
          
          {/* Analytics direct Signup page trigger karega */}
          <button className="dock-nav-btn" onClick={() => setActivePage('analysis', 'signup')}>
            Analytics
          </button>

          <button className="dock-nav-btn" onClick={() => setActivePage('opportunities')}>
            Opportunities
          </button>
          <button className="dock-nav-btn" onClick={() => setActivePage('contact')}>
            Contact
          </button>
        </nav>

        {/* Right Zone */}
        <div className="dock-right-zone">
          <div className="cyber-social-cluster">
            <a href="#github" className="holo-soc-pill" title="GitHub">
              <span className="soc-text">GH</span>
            </a>
            <a href="#linkedin" className="holo-soc-pill" title="LinkedIn">
              <span className="soc-text">IN</span>
            </a>
            <a href="#x" className="holo-soc-pill" title="X (Twitter)">
              <span className="soc-text">𝕏</span>
            </a>
            <a href="#youtube" className="holo-soc-pill" title="YouTube">
              <span className="soc-text">YT</span>
            </a>
          </div>

          <a href="mailto:contact@skillbridge.ai" className="dock-contact-badge">
            <span className="mail-icon">✉</span>
            <span>contact@skillbridge.ai</span>
          </a>
        </div>
      </div>

      <div className="cyber-footer-ribbon">
        <span>© 2026 SkillBridge AI • Developed by Team Binary Brains</span>
        <span className="ribbon-glow-text">Continuous Academic-Industry Skill Alignment</span>
      </div>
    </footer>
  );
}