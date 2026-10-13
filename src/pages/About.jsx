import React, { useState } from 'react';
import './About.css';

export default function About({ setActivePage }) {
  // Active step for the 9-pipeline interactive section (default: 8 - Applications)
  const [activeStep, setActiveStep] = useState(8);

  const pipelineSteps = [
    { id: 1, tag: '01', title: 'Student Profile', desc: 'Holistic data collection across academics, verified projects, and candidate aspirations.' },
    { id: 2, tag: '02', title: 'Skill Assessment', desc: 'AI-calibrated proctored diagnostics targeting role-specific technical capabilities.' },
    { id: 3, tag: '03', title: 'Skill Mapping', desc: 'Deconstruct verified strengths and cross-map against industry taxonomy.' },
    { id: 4, tag: '04', title: 'Skill Gap Analysis', desc: 'Quantify delta between candidate competencies and entry-level prerequisites.' },
    { id: 5, tag: '05', title: 'Industry Requirements', desc: 'Real-time ingestion of hiring velocity, skill weights, and market demands.' },
    { id: 6, tag: '06', title: 'Smart Matching', desc: 'Vector cosine similarity matching candidate skill DNA to open requisitions.' },
    { id: 7, tag: '07', title: 'Internships & Jobs', desc: 'Direct discovery pipeline for verified roles across hiring partners.' },
    { id: 8, tag: '08', title: 'Applications', desc: 'Frictionless one-click application submission with tamper-proof skill dossiers.' },
    { id: 9, tag: '09', title: 'Career Progress', desc: 'Continuous feedback loops tracking on-job performance and upskilling milestones.' }
  ];

  const differentiators = [
    {
      feature: 'Core Philosophy',
      generic: 'Lists open jobs & stores static resume PDFs',
      skillbridge: 'Dynamic Skill Intelligence Profile that grows with you'
    },
    {
      feature: 'Opportunity Fit',
      generic: 'Basic keyword and title matching',
      skillbridge: 'Deep multi-dimensional vector matching + "Why you match" insights'
    },
    {
      feature: 'Skill Gap Detection',
      generic: 'Leaves users guessing what skills they lack',
      skillbridge: 'Automated gap prioritization (Critical, High, Medium) + Learning paths'
    },
    {
      feature: 'Continuous Evolution',
      generic: 'One-time application, no progress tracking',
      skillbridge: 'Real-time Skill DNA update with project and assessment completion'
    },
    {
      feature: 'Ecosystem Connection',
      generic: 'Isolated portal detached from university curriculum',
      skillbridge: 'Unifies Students, Higher Ed Curricula, and Industry Hiring in one loop'
    }
  ];

  const teamMembers = [
    { name: 'Ajay Kumar', role: 'Team Leader & Frontend Developer', id: '15114802725' },
    { name: 'Devang Kumar', role: 'Database Developer', id: '1814802725' },
    { name: 'Alok Kumar', role: 'Frontend Developer', id: '17614802725' },
    { name: 'Amitraj', role: 'Backend Developer', id: '24914802725' },
    { name: 'Deepanshu', role: 'Problem Analyst', id: '28514802725' },
    { name: 'Lara', role: 'Data Analytics', id: '00414804925' }
  ];

  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <span className="about-badge">SIH26044 // Smart Automation</span>
        <h1 className="about-title">
          Bridging Skills With <span className="cyan-glow">Opportunities</span>
        </h1>
        <p className="about-tagline">
          "From Skills to Opportunities — One Intelligent Ecosystem."
        </p>
        <p className="about-subtext">
          SkillBridge is an AI-powered unified Academia-Industry Skill Intelligence and Career
          Platform built to eliminate the divide between academic education and modern industry demands.
        </p>
      </section>

      {/* ========================================================
          SCREENSHOT INTEGRATION: CORE CONCEPT & 9-PIPELINE STEPS
          ======================================================== */}
      <section className="about-concept-section">
        <div className="concept-header">
          <span className="concept-category-tag">CORE CONCEPT</span>
          <h2 className="concept-main-title">From skills to opportunity</h2>
          <p className="concept-lead-text">
            A shared ecosystem for understanding capability, finding the next step, and connecting people around measurable outcomes.
          </p>
        </div>

        <div className="concept-split-layout">
          {/* Left: 9 Numbered Pipeline Steps */}
          <div className="pipeline-steps-col">
            {pipelineSteps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  className={`pipeline-step-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <span className="step-num-bubble">{step.tag}</span>
                  <div className="step-label-box">
                    <span className="step-label-text">{step.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Central Ecosystem Node Canvas */}
          <div className="ecosystem-visual-col">
            <div className="ecosystem-stage-box">
              <div className="eco-orbit-ring ring-outer"></div>
              <div className="eco-orbit-ring ring-middle"></div>
              <div className="eco-orbit-ring ring-inner"></div>

              <div className="eco-center-node">
                <div className="node-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="5" rx="1" />
                    <rect x="2" y="17" width="6" height="5" rx="1" />
                    <rect x="16" y="17" width="6" height="5" rx="1" />
                    <path d="M12 7v5" />
                    <path d="M5 17v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
                  </svg>
                </div>
                <h4 className="node-title">SKILLBRIDGE</h4>
                <span className="node-subtitle">Shared ecosystem</span>
              </div>

              {/* Dynamic Active Step Indicator */}
              <div className="active-step-dossier-pill">
                <span className="as-num">{pipelineSteps[activeStep - 1]?.tag}</span>
                <span className="as-title">{pipelineSteps[activeStep - 1]?.title}:</span>
                <span className="as-desc">{pipelineSteps[activeStep - 1]?.desc}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="about-pillars">
        <div className="pillar-card">
          <div className="pillar-icon">🎓</div>
          <h3>For Students</h3>
          <p>
            Understand your verified skills, identify priority learning gaps, and receive explainable
            recommendations paired with matched internships and placements.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">🏛️</div>
          <h3>For Institutions</h3>
          <p>
            Gain live visibility into changing industry skill demand, student cohort readiness,
            and precise curriculum alignment opportunities.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">⚡</div>
          <h3>For Companies</h3>
          <p>
            Discover and rank candidates based on verified competencies, readiness scores, and
            project proof rather than generic resume keywords.
          </p>
        </div>
      </section>

      {/* Unique Differentiation Section */}
      <section className="about-diff-section">
        <div className="section-head">
          <span className="section-tag">Core Distinction</span>
          <h2>More Than a Job Portal</h2>
          <p>How SkillBridge fundamentally transforms the education-to-employment pathway.</p>
        </div>

        <div className="diff-table-container">
          <table className="diff-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Generic Job Portals</th>
                <th className="highlight-col">SkillBridge AI Ecosystem</th>
              </tr>
            </thead>
            <tbody>
              {differentiators.map((row, i) => (
                <tr key={i}>
                  <td className="feature-name">{row.feature}</td>
                  <td className="generic-cell">{row.generic}</td>
                  <td className="skillbridge-cell">✓ {row.skillbridge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Projected 2026 Employability Impact */}
      <section className="about-impact-section">
        <div className="impact-box">
          <div className="impact-text">
            <span className="section-tag">National Impact</span>
            <h2>Solving the Employability Disconnect</h2>
            <p>
              According to projected national trends (AICTE, Wheebox & India Skills Report), traditional technical 
              streams still leave substantial employability gaps. SkillBridge accelerates real-world readiness 
              through automated Skill Gap Detection and Next Best Action interventions.
            </p>
            <div className="impact-metrics-row">
              <div className="impact-metric">
                <span className="num">76%</span>
                <span className="lbl">Engg Employability</span>
              </div>
              <div className="impact-metric">
                <span className="num">99%</span>
                <span className="lbl">Detection Accuracy</span>
              </div>
              <div className="impact-metric">
                <span className="num">3x</span>
                <span className="lbl">Faster Time-to-Hire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Roster */}
      <section className="about-team-section">
        <div className="section-head">
          <span className="section-tag">Binary Brains</span>
          <h2>Built for Smart India Hackathon 2026</h2>
          <p>Problem Statement SIH26044: Portal for Academia-Industry Collaboration</p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="avatar-placeholder">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="member-name">{member.name}</h4>
              <p className="member-role">{member.role}</p>
              <span className="member-id">ID: {member.id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final Action Callout */}
      <section className="about-cta">
        <h3>Ready to experience intelligent career navigation?</h3>
        <button className="btn-cyan-about" onClick={() => setActivePage('assessment')}>
          Start Skill Assessment Now →
        </button>
      </section>
    </div>
  );
}