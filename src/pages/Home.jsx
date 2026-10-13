import React from 'react';
import Hero from '../components/Hero';
import './Home.css';

export default function Home({ setActivePage }) {
  const problems = [
    {
      id: 'disconnect',
      title: 'Academic Disconnect',
      desc: 'Traditional curricula often fail to align with the rapidly evolving skill demands of the modern industry landscape.',
      graphicType: 'cross'
    },
    {
      id: 'gaps',
      title: 'Skills Gap Analysis',
      desc: 'Students struggle to identify the specific technical competencies required for entry-level roles, leading to significant time-to-hire delays.',
      graphicType: 'isometric'
    },
    {
      id: 'misalignment',
      title: 'Opportunity Misalignment',
      desc: 'Generic job portals often list positions without providing the detailed skill intelligence needed to ensure a perfect fit.',
      graphicType: 'star'
    },
    {
      id: 'readiness',
      title: 'Industry Readiness',
      desc: 'Recruiters face immense difficulty in discovering candidates with the precise technical readiness required for complex software development.',
      graphicType: 'cluster'
    }
  ];

  const capabilities = [
    {
      id: 'cap-1',
      title: 'Skill Mapping',
      desc: 'Compare your technical and soft skills against industry-specific role requirements with precision.',
      type: 'neural'
    },
    {
      id: 'cap-2',
      title: 'Skill Gap Analysis',
      desc: 'Identify critical skill deficiencies and receive personalized learning paths to bridge the gap.',
      type: 'radar'
    },
    {
      id: 'cap-3',
      title: 'Opportunity Matching',
      desc: 'Connect with internships and placements that align with your unique skill intelligence profile.',
      type: 'constellation'
    }
  ];

  const workflowSteps = [
    { id: 1, title: 'Student Profile' },
    { id: 2, title: 'AI Skill Intelligence' },
    { id: 3, title: 'Skills Mapping' },
    { id: 4, title: 'Gap Analysis' },
    { id: 5, title: 'Upskilling' },
    { id: 6, title: 'Opportunities' },
    { id: 7, title: 'Industry Feedback' }
  ];

  const comparisonData = [
    {
      feature: 'Resume Storage',
      generic: 'Static text listing.',
      skillbridge: 'Dynamic Skill Intelligence Profile.'
    },
    {
      feature: 'Job Matching',
      generic: 'Keyword-based search.',
      skillbridge: 'AI-driven opportunity matching with skill readiness analysis.'
    },
    {
      feature: 'Learning Paths',
      generic: 'External links only.',
      skillbridge: 'Personalized upskilling recommendations and project suggestions.'
    },
    {
      feature: 'Industry Insights',
      generic: 'Basic listings.',
      skillbridge: 'Real-time skill demand intelligence and career readiness tracking.'
    }
  ];

  return (
    <div className="sb-home-container">
      {/* 1. TOP HERO (Original mouse interaction preserved) */}
      <Hero 
        onStartAssessment={() => setActivePage('assessment')}
        onExploreIntelligence={() => setActivePage('skill-dna')}
      />

      {/* 2. 4 ECOSYSTEM PROBLEM STATEMENTS */}
      <section className="sb-problem-section">
        <div className="problem-cards-stack">
          {problems.map((item, idx) => (
            <div key={item.id} className={`problem-card-row ${idx % 2 === 1 ? 'reverse' : ''}`}>
              <div className="pc-content">
                <h2 className="pc-heading">{item.title}</h2>
                <p className="pc-description">{item.desc}</p>
              </div>

              <div className="pc-graphic-wrapper">
                <div className="cyber-network-box">
                  {item.graphicType === 'cross' && (
                    <>
                      <svg className="node-svg-canvas" viewBox="0 0 200 200">
                        <line x1="100" y1="100" x2="35" y2="35" className="laser-line" />
                        <line x1="100" y1="100" x2="165" y2="35" className="laser-line" />
                        <line x1="100" y1="100" x2="35" y2="165" className="laser-line" />
                        <line x1="100" y1="100" x2="165" y2="165" className="laser-line" />
                      </svg>
                      <div className="node-core"></div>
                      <div className="satellite-node n-tl"></div>
                      <div className="satellite-node n-tr"></div>
                      <div className="satellite-node n-bl"></div>
                      <div className="satellite-node n-br"></div>
                    </>
                  )}

                  {item.graphicType === 'isometric' && (
                    <div className="isometric-graphic-container">
                      <svg className="iso-svg-canvas" viewBox="0 0 220 160">
                        <ellipse cx="110" cy="80" rx="36" ry="16" className="iso-core-ring" />
                        <ellipse cx="110" cy="80" rx="20" ry="9" className="iso-core-inner" />
                        <line x1="110" y1="80" x2="25" y2="40" className="laser-line" />
                        <line x1="110" y1="80" x2="195" y2="40" className="laser-line" />
                        <line x1="110" y1="80" x2="25" y2="120" className="laser-line" />
                        <line x1="110" y1="80" x2="195" y2="120" className="laser-line" />
                        <ellipse cx="25" cy="40" rx="16" ry="8" className="iso-node-pill" />
                        <ellipse cx="195" cy="40" rx="16" ry="8" className="iso-node-pill" />
                        <ellipse cx="25" cy="120" rx="16" ry="8" className="iso-node-pill" />
                        <ellipse cx="195" cy="120" rx="16" ry="8" className="iso-node-pill" />
                      </svg>
                    </div>
                  )}

                  {item.graphicType === 'star' && (
                    <div className="star-graphic-container">
                      <svg className="node-svg-canvas" viewBox="0 0 200 200">
                        <polygon points="100,20 155,45 180,100 155,155 100,180 45,155 20,100 45,45" className="star-outer-mesh" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
                          const rad = (ang * Math.PI) / 180;
                          const x = 100 + Math.cos(rad) * 75;
                          const y = 100 + Math.sin(rad) * 75;
                          return (
                            <g key={ang}>
                              <line x1="100" y1="100" x2={x} y2={y} className="laser-line" />
                              <circle cx={x} cy={y} r="8" className="star-node-dot" />
                            </g>
                          );
                        })}
                        <circle cx="100" cy="100" r="14" className="star-center-node" />
                      </svg>
                    </div>
                  )}

                  {item.graphicType === 'cluster' && (
                    <div className="cluster-graphic-container">
                      <svg className="node-svg-canvas" viewBox="0 0 200 200">
                        <line x1="100" y1="100" x2="40" y2="40" className="laser-line" />
                        <line x1="100" y1="100" x2="160" y2="40" className="laser-line" />
                        <line x1="100" y1="100" x2="40" y2="160" className="laser-line" />
                        <line x1="100" y1="100" x2="160" y2="160" className="laser-line" />
                      </svg>
                      <div className="node-core"></div>
                      <div className="cluster-node-group c-tl">
                        <div className="satellite-node"></div>
                        <span className="tiny-pip tp-1"></span>
                        <span className="tiny-pip tp-2"></span>
                      </div>
                      <div className="cluster-node-group c-tr">
                        <div className="satellite-node"></div>
                        <span className="tiny-pip tp-1"></span>
                        <span className="tiny-pip tp-2"></span>
                      </div>
                      <div className="cluster-node-group c-bl">
                        <div className="satellite-node"></div>
                        <span className="tiny-pip tp-1"></span>
                        <span className="tiny-pip tp-2"></span>
                      </div>
                      <div className="cluster-node-group c-br">
                        <div className="satellite-node"></div>
                        <span className="tiny-pip tp-1"></span>
                        <span className="tiny-pip tp-2"></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE CAPABILITIES */}
      <section className="sb-capabilities-section">
        <div className="cap-header-center">
          <h2 className="cap-main-title">Core Capabilities</h2>
          <p className="cap-subtitle">AI-powered intelligence connecting your skills to industry opportunities.</p>
        </div>

        <div className="capabilities-grid-3">
          {capabilities.map((cap) => (
            <div key={cap.id} className="capability-card" onClick={() => setActivePage('skill-dna')}>
              <div className="cap-visual-box">
                {cap.type === 'neural' && (
                  <svg viewBox="0 0 160 160" className="cap-svg">
                    <circle cx="80" cy="80" r="16" className="cap-svg-core" />
                    {[0, 60, 120, 180, 240, 300].map((a, i) => {
                      const rad = (a * Math.PI) / 180;
                      const x1 = 80 + Math.cos(rad) * 35;
                      const y1 = 80 + Math.sin(rad) * 35;
                      const x2 = 80 + Math.cos(rad + 0.2) * 60;
                      const y2 = 80 + Math.sin(rad + 0.2) * 60;
                      return (
                        <g key={i}>
                          <line x1="80" y1="80" x2={x1} y2={y1} className="cap-line" />
                          <circle cx={x1} cy={y1} r="4" className="cap-dot" />
                          <line x1={x1} y1={y1} x2={x2} y2={y2} className="cap-line" />
                          <circle cx={x2} cy={y2} r="3" className="cap-dot" />
                        </g>
                      );
                    })}
                  </svg>
                )}

                {cap.type === 'radar' && (
                  <svg viewBox="0 0 160 160" className="cap-svg">
                    <circle cx="80" cy="80" r="60" className="radar-ring r3" />
                    <circle cx="80" cy="80" r="42" className="radar-ring r2" />
                    <circle cx="80" cy="80" r="24" className="radar-ring r1" />
                    <line x1="20" y1="80" x2="140" y2="80" className="radar-cross" />
                    <line x1="80" y1="20" x2="80" y2="140" className="radar-cross" />
                    <line x1="80" y1="80" x2="135" y2="35" className="radar-active-beam" />
                  </svg>
                )}

                {cap.type === 'constellation' && (
                  <svg viewBox="0 0 160 160" className="cap-svg">
                    <polygon points="80,25 125,50 135,105 95,135 45,120 35,65" className="const-mesh" />
                    <line x1="80" y1="25" x2="95" y2="135" className="const-line" />
                    <line x1="125" y1="50" x2="45" y2="120" className="const-line" />
                    <line x1="135" y1="105" x2="35" y2="65" className="const-line" />
                    <circle cx="80" cy="25" r="5" className="cap-dot" />
                    <circle cx="125" cy="50" r="5" className="cap-dot" />
                    <circle cx="135" cy="105" r="5" className="cap-dot" />
                    <circle cx="95" cy="135" r="5" className="cap-dot" />
                    <circle cx="45" cy="120" r="5" className="cap-dot" />
                    <circle cx="35" cy="65" r="5" className="cap-dot" />
                  </svg>
                )}
              </div>

              <h3 className="cap-card-title">{cap.title}</h3>
              <p className="cap-card-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE UNIFIED WORKFLOW */}
      <section className="sb-workflow-section">
        <div className="wf-header">
          <h2 className="wf-main-title">The Unified Workflow</h2>
          <p className="wf-subtitle">A continuous ecosystem connecting education to industry readiness through SkillBridge AI.</p>
        </div>

        <div className="workflow-blocks-grid">
          {workflowSteps.map((step) => (
            <div key={step.id} className="workflow-card-pill" onClick={() => setActivePage('assessment')}>
              <span className="wf-pill-title">{step.title}</span>
              <span className="wf-accent-line"></span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MORE THAN A JOB PORTAL */}
      <section className="sb-portal-comparison-section">
        <div className="portal-comp-grid">
          <div className="comp-text-col">
            <h2 className="comp-main-title">More Than a Job Portal</h2>

            <div className="comp-table">
              <div className="comp-row comp-header-row">
                <span className="col-feat">FEATURE</span>
                <span className="col-gen">GENERIC PORTALS</span>
                <span className="col-sb">SKILLBRIDGE AI</span>
              </div>

              {comparisonData.map((row, i) => (
                <div key={i} className="comp-row">
                  <span className="col-feat">{row.feature}</span>
                  <span className="col-gen">{row.generic}</span>
                  <span className="col-sb">{row.skillbridge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="comp-graphic-col">
            <div className="cyber-brain-display">
              <div className="brain-glow-aura"></div>
              <svg viewBox="0 0 240 220" className="brain-svg">
                <path
                  d="M120,40 C90,40 60,60 55,90 C45,100 40,120 50,140 C55,160 80,180 120,185 C160,180 185,160 190,140 C200,120 195,100 185,90 C180,60 150,40 120,40 Z"
                  className="brain-outer-lobe"
                />
                <path d="M120,45 C115,80 115,140 120,185" className="brain-hemisphere-divider" />
                <path d="M70,95 Q100,80 120,105 Q140,80 170,95" className="brain-neural-circuit c1" />
                <path d="M60,125 Q95,115 120,140 Q145,115 180,125" className="brain-neural-circuit c2" />
                <path d="M85,155 Q105,145 120,165 Q135,145 155,155" className="brain-neural-circuit c3" />
                <circle cx="120" cy="105" r="5" className="synapse-pip" />
                <circle cx="120" cy="140" r="5" className="synapse-pip" />
                <line x1="120" y1="185" x2="120" y2="215" className="brain-stem" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTINUOUS SKILL EVOLUTION */}
      <section className="sb-evolution-section">
        <h2 className="evo-main-title">Continuous Skill Evolution</h2>

        <div className="hud-circular-loop-wrapper">
          <div className="hud-ring r-outer"></div>
          <div className="hud-ring r-middle"></div>
          <div className="hud-ring r-inner"></div>
          <div className="hud-center-lens">
            <span className="lens-main-text">Industry &amp;<br />Student Skills</span>
          </div>
        </div>

        <div className="evo-footer-text">
          <p className="evo-lead-p">From Skills to Opportunities — One Intelligent Ecosystem.</p>
          <p className="evo-desc-p">
            SkillBridge bridges the gap between academic education and industry expectations through a continuous feedback loop of skill assessment and opportunity matching.
          </p>
        </div>
      </section>

      {/* 7. PRE-FOOTER BANNER: "Know What You Know..." */}
      <section className="sb-prefooter-cta-section">
        <div className="prefooter-grid">
          <div className="prefooter-content">
            <h2 className="prefooter-headline">
              Know What <br />You Know. <br />Discover <br />What You’re <br />Missing. See <br />Where You <br />Fit.
            </h2>
            <p className="prefooter-subtext">
              SkillBridge transforms your resume, projects and professional profiles into a living Skill Intelligence Profile—connecting your skills to learning, institutions, industry requirements and opportunities.
            </p>
            <div className="prefooter-btn-row">
              <button className="btn-cyan-solid" onClick={() => setActivePage('assessment')}>
                start skill assessment
              </button>
              <button className="btn-cyan-outline" onClick={() => setActivePage('skill-dna')}>
                Explore Skill Intelligence
              </button>
            </div>
          </div>

          <div className="prefooter-graphic-col">
            <div className="hero-sphere-stage">
              <div className="stat-card sc-tl">
                <span className="sc-label">Readiness</span>
                <strong className="sc-val">94%</strong>
              </div>
              <div className="stat-card sc-tr">
                <span className="sc-label">Matched</span>
                <strong className="sc-val">12 Roles</strong>
              </div>
              <div className="stat-card sc-bl">
                <span className="sc-label">DNA Nodes</span>
                <strong className="sc-val">28 Verified</strong>
              </div>
              <div className="stat-card sc-br">
                <span className="sc-label">Gap Index</span>
                <strong className="sc-val">-12%</strong>
              </div>

              <div className="geodesic-sphere">
                <svg viewBox="0 0 200 200" className="sphere-svg">
                  <polygon points="100,20 155,50 175,110 135,170 65,170 25,110 45,50" className="sphere-outer" />
                  <line x1="100" y1="20" x2="100" y2="100" className="sp-line" />
                  <line x1="155" y1="50" x2="100" y2="100" className="sp-line" />
                  <line x1="175" y1="110" x2="100" y2="100" className="sp-line" />
                  <line x1="135" y1="170" x2="100" y2="100" className="sp-line" />
                  <line x1="65" y1="170" x2="100" y2="100" className="sp-line" />
                  <line x1="25" y1="110" x2="100" y2="100" className="sp-line" />
                  <line x1="45" y1="50" x2="100" y2="100" className="sp-line" />

                  <circle cx="100" cy="20" r="4.5" className="sp-node" />
                  <circle cx="155" cy="50" r="4.5" className="sp-node" />
                  <circle cx="175" cy="110" r="4.5" className="sp-node" />
                  <circle cx="135" cy="170" r="4.5" className="sp-node" />
                  <circle cx="65" cy="170" r="4.5" className="sp-node" />
                  <circle cx="25" cy="110" r="4.5" className="sp-node" />
                  <circle cx="45" cy="50" r="4.5" className="sp-node" />
                  <circle cx="100" cy="100" r="7" className="sp-core-node" />
                </svg>
              </div>
              <div className="pedestal-ring"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}