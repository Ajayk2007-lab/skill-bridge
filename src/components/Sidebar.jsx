import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ activePage, setActivePage, userRole = 'student', userProfile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 1. Role: Student Specific Navigation Links (Only students have Skill Diagnostic)
  const studentNav = [
    { id: 'dashboard', label: 'My Dashboard', icon: '▤' },
    { id: 'skill-dna', label: 'Skill DNA Network', icon: '◈' },
    { id: 'career-twin', label: 'AI Career Twin', icon: '◬' },
    { id: 'opportunities', label: 'Matched Opportunities', icon: '⌬' },
    { id: 'assessment', label: 'Skill Diagnostic', icon: '✦' },
    { id: 'skill-market', label: 'Skill Market Feed', icon: '📈' },
  ];

  // 2. Role: Institution (College / University) Navigation Links (No Assessment)
  const institutionNav = [
    { id: 'institution-dashboard', label: 'Cohort Analytics', icon: '🏛️' },
    { id: 'skill-market', label: 'Curriculum Gaps', icon: '📈' },
    { id: 'opportunities', label: 'Placement Pipeline', icon: '⌬' },
    { id: 'search', label: 'Student Search', icon: '🔍' },
    { id: 'about', label: 'SIH26044 Specs', icon: '▤' }
  ];

  // 3. Role: Company (Recruiter / Enterprise) Navigation Links (No Assessment)
  const companyNav = [
    { id: 'company-dashboard', label: 'Candidate Ranker', icon: '⚡' },
    { id: 'search', label: 'Skill-First Discovery', icon: '🔍' },
    { id: 'opportunities', label: 'Manage Postings', icon: '⌬' },
    { id: 'skill-market', label: 'Industry Vectors', icon: '📈' },
    { id: 'contact', label: 'Support & Escalation', icon: '✦' }
  ];

  const navItems = 
    userRole === 'institution'
      ? institutionNav
      : userRole === 'company'
      ? companyNav
      : studentNav;

  // Protected Click Handler
  const handleNavClick = (itemId) => {
    // Non-student ko assessment kholne se block karein
    if (itemId === 'assessment' && userRole !== 'student') {
      return;
    }
    setActivePage(itemId);
  };

  // Dynamic Initials from Profile
  const initials = (userProfile?.name || 'Ajay Kumar')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className={`sb-role-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Role Header Banner */}
      <div className="sidebar-role-header">
        {!isCollapsed && (
          <div className="role-title-box">
            <span className={`role-badge-dot ${userRole}`}></span>
            <span className="role-heading-text">{userRole.toUpperCase()} CONSOLE</span>
          </div>
        )}
        <button
          className="toggle-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Role Specific Navigation Items */}
      <nav className="role-nav-list">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`role-nav-btn ${activePage === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            title={item.label}
          >
            <span className="nav-glyph">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
            {!isCollapsed && activePage === item.id && <span className="nav-active-pip"></span>}
          </button>
        ))}
      </nav>

      {/* Role Specific Custom Widget */}
      {!isCollapsed && (
        <div className="role-custom-widget">
          {userRole === 'student' && (
            <div className="widget-box student-box">
              <div className="wb-top">
                <span>Profile Integrity</span>
                <strong>82%</strong>
              </div>
              <div className="wb-track">
                <div className="wb-fill" style={{ width: '82%' }}></div>
              </div>
              <p className="wb-hint">✦ Add Docker project to reach 95%</p>
            </div>
          )}

          {userRole === 'institution' && (
            <div className="widget-box institution-box">
              <div className="wb-top">
                <span>Cohort Readiness</span>
                <strong>71%</strong>
              </div>
              <div className="wb-track">
                <div className="wb-fill inst-color" style={{ width: '71%' }}></div>
              </div>
              <p className="wb-hint">✦ 68% students need Cloud lab</p>
            </div>
          )}

          {userRole === 'company' && (
            <div className="widget-box company-box">
              <div className="wb-top">
                <span>Hiring Pipeline</span>
                <strong>18 Active</strong>
              </div>
              <p className="wb-hint">✦ 3 candidates match &gt;90% vector</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Profile Details (Synced with userProfile & Google data) */}
      {!isCollapsed && (
        <div className="sidebar-persona-card">
          <div className={`persona-avatar ${userRole}`}>
            {userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="persona-avatar-img" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="persona-info">
            <span className="persona-name">
              {userProfile?.name || (userRole === 'student' ? 'Ajay Kumar' : userRole === 'institution' ? 'Delhi Tech Univ' : 'Cognitive Systems')}
            </span>
            <span className="persona-type">
              {userRole === 'student'
                ? (userProfile?.headline || 'Engineering Final Year')
                : userRole === 'institution'
                ? (userProfile?.organization || 'Academic Partner')
                : (userProfile?.organization || 'Verified Recruiter')}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}