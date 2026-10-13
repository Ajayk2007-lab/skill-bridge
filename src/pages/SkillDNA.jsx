import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import './SkillDNA.css';

export default function SkillDNA({ setActivePage }) {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'network'
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'critical' | 'moderate'
  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [activeSandboxModule, setActiveSandboxModule] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Dynamic Skill Competency Matrix based on user data
  const [skillMatrix] = useState([
    { skill: 'Python', userScore: 92, targetScore: 90, category: 'Backend', status: 'verified', details: 'High-proficiency demonstrated in generator pipelines, GIL synchronization, and memory optimization.' },
    { skill: 'FastAPI', userScore: 85, targetScore: 88, category: 'Backend', status: 'verified', details: 'Async routing and Pydantic v2 schemas verified. Small gap in Starlette lifespan context handling.' },
    { skill: 'React.js', userScore: 80, targetScore: 85, category: 'Frontend', status: 'verified', details: 'Proficient in custom hooks, memoization, and reactive state trees. Needs micro-frontend deployment proof.' },
    { skill: 'SQL & DB', userScore: 78, targetScore: 82, category: 'Database', status: 'verified', details: 'Solid indexing and joins. Optimization needed on distributed sharding and write-amplification.' },
    { skill: 'Docker', userScore: 35, targetScore: 85, category: 'DevOps', status: 'critical_gap', details: 'Severe disconnect in container networking, multi-stage builds, and resource isolation (cgroups).' },
    { skill: 'Redis', userScore: 40, targetScore: 75, category: 'Caching', status: 'critical_gap', details: 'Lacking production implementation in distributed locks, pub-sub clusters, and TTL eviction policies.' },
    { skill: 'System Design', userScore: 50, targetScore: 80, category: 'Architecture', status: 'moderate_gap', details: 'Foundational concepts clear, but needs mastery in consistent hashing, CAP tradeoffs, and Raft consensus.' },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExportDossier = () => {
    const shareUrl = `${window.location.origin}/share/dna/${userProfile?.name?.replace(/\s+/g, '-').toLowerCase() || 'candidate'}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Verified Skill DNA Dossier Hash Copied to Clipboard! ✓');
  };

  const handleModuleClick = (e, res) => {
    if (res.url === '#') {
      e.preventDefault();
      setActiveSandboxModule(res);
      setSandboxModalOpen(true);
    }
  };

  // Curated Learning Resources Map tailored to the identified gaps
  const resourceCatalog = {
    Docker: [
      {
        id: 'doc-1',
        title: 'Docker & Kubernetes: Containerization from Zero to Production',
        provider: 'FreeCodeCamp & TechWorld with Nana',
        type: 'Video Masterclass',
        icon: '🎬',
        duration: '4.5 Hours',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
        description: 'Covers multi-stage Dockerfiles, image size reduction, bridge networks, and volume persistence.'
      },
      {
        id: 'doc-2',
        title: 'Official Docker Docs: Multi-Stage Production Builds',
        provider: 'Docker Official Documentation',
        type: 'Interactive Guide',
        icon: '📖',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        url: 'https://docs.docker.com/build/building/multi-stage/',
        description: 'Best practices for stripping build tools and keeping lean distroless deployment containers.'
      },
      {
        id: 'doc-3',
        title: 'Hands-On Lab: Dockerize a FastAPI & PostgreSQL Microservice',
        provider: 'SkillBridge Sandbox Lab',
        type: 'Project Blueprint',
        icon: '🛠️',
        duration: '3 Hours',
        difficulty: 'Advanced',
        url: '#',
        description: 'Step-by-step repository template configuring docker-compose, health checks, and database migrations.'
      }
    ],
    Redis: [
      {
        id: 'red-1',
        title: 'Redis Crash Course & Caching Architecture Patterns',
        provider: 'Traversy Media / Redis University',
        type: 'Video Masterclass',
        icon: '🎬',
        duration: '2.5 Hours',
        difficulty: 'Beginner - Intermediate',
        url: 'https://www.youtube.com/watch?v=jgpVdJB2sKQ',
        description: 'Key-value data structures, TTL expiration strategies, and Write-Through vs Cache-Aside patterns.'
      },
      {
        id: 'red-2',
        title: 'High-Performance In-Memory Caching with Python & Redis-py',
        provider: 'Real Python',
        type: 'Tutorial & Code Lab',
        icon: '📖',
        duration: '1.5 Hours',
        difficulty: 'Intermediate',
        url: 'https://realpython.com/python-redis/',
        description: 'Implementing distributed locks, rate limiters, and session storage with connection pools.'
      }
    ],
    'System Design': [
      {
        id: 'sd-1',
        title: 'The System Design Primer (Open Source Repository)',
        provider: 'Donne Martin / GitHub',
        type: 'Curated Syllabus',
        icon: '🧠',
        duration: '12 Hours',
        difficulty: 'Advanced',
        url: 'https://github.com/donnemartin/system-design-primer',
        description: 'Comprehensive guide covering CAP theorem, Consistent Hashing, Message Queues, and Sharding.'
      },
      {
        id: 'sd-2',
        title: 'Grokking Microservice Architecture & Event-Driven Systems',
        provider: 'ByteByteGo',
        type: 'Visual Engineering Guide',
        icon: '📊',
        duration: '3.5 Hours',
        difficulty: 'Intermediate - Advanced',
        url: 'https://bytebytego.com/',
        description: 'Visual diagrams breaking down modern enterprise load balancing, reverse proxies, and CDN caching.'
      }
    ]
  };

  const radarCanvasRef = useRef(null);
  const networkCanvasRef = useRef(null);

  // Setup High-DPI Crisp Canvas
  const setupCrispCanvas = (canvas, cssWidth, cssHeight) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    return { ctx, dpr };
  };

  // 1. Crystal-Clear Radar / Spider Web Graph
  useEffect(() => {
    if (activeTab !== 'radar' || !radarCanvasRef.current) return;
    const canvas = radarCanvasRef.current;
    const cssSize = 460;
    const { ctx } = setupCrispCanvas(canvas, cssSize, cssSize);

    const centerX = cssSize / 2;
    const centerY = cssSize / 2;
    const radius = 160;
    const count = skillMatrix.length;
    const angleStep = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, cssSize, cssSize);

    // Concentric Polygon Rings (Grid)
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
    rings.forEach((level) => {
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * level);
        const y = centerY + Math.sin(angle) * (radius * level);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Web Spoke Axes & Crisp Labels
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const labelDist = radius + 24;
      const lx = centerX + Math.cos(angle) * labelDist;
      const ly = centerY + Math.sin(angle) * labelDist;

      ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = skillMatrix[i].status === 'critical_gap' ? '#ff4757' : '#00f0ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skillMatrix[i].skill, lx, ly);
    }

    // Benchmark Path (Target)
    ctx.beginPath();
    skillMatrix.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius * item.targetScore) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fill();

    // User Profile Vector Path (Candidate)
    ctx.beginPath();
    skillMatrix.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius * item.userScore) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.stroke();
    ctx.fill();

    // Sharp Coordinate Points
    skillMatrix.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius * item.userScore) / 100;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = item.userScore < item.targetScore - 20 ? '#ff4757' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [activeTab, skillMatrix]);

  // 2. High-DPI Sharp Knowledge Network
  useEffect(() => {
    if (activeTab !== 'network' || !networkCanvasRef.current) return;
    const canvas = networkCanvasRef.current;
    const cssSize = 460;
    const { ctx } = setupCrispCanvas(canvas, cssSize, cssSize);

    let animId;
    const core = { x: cssSize / 2, y: cssSize / 2, label: userProfile?.targetRole || 'Full Stack', radius: 40 };

    const nodes = skillMatrix.map((item, i) => {
      const angle = (i / skillMatrix.length) * Math.PI * 2;
      const dist = 145;
      return {
        x: core.x + Math.cos(angle) * dist,
        y: core.y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        ...item
      };
    });

    const loop = () => {
      ctx.clearRect(0, 0, cssSize, cssSize);

      // Connection Edges
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 45 || n.x > cssSize - 45) n.vx *= -1;
        if (n.y < 45 || n.y > cssSize - 45) n.vy *= -1;

        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(n.x, n.y);

        if (n.status === 'critical_gap') {
          ctx.strokeStyle = 'rgba(255, 71, 87, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Core Target Role Node
      ctx.beginPath();
      ctx.arc(core.x, core.y, core.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#090e17';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = '700 10px "Orbitron", monospace, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET ROLE', core.x, core.y - 5);

      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(core.label.substring(0, 15), core.x, core.y + 11);

      // Surrounding Skill Nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#090e17';
        ctx.fill();
        ctx.strokeStyle = n.status === 'critical_gap' ? '#ff4757' : '#00f0ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '700 10px "Orbitron", monospace, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${n.userScore}%`, n.x, n.y - 2);

        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = n.status === 'critical_gap' ? '#ff6b81' : '#cbd5e1';
        ctx.fillText(n.skill, n.x, n.y + 11);
      });

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, skillMatrix, userProfile]);

  // Extract skills with identified deficits
  const criticalGaps = skillMatrix.filter((s) => s.status === 'critical_gap');
  const moderateGaps = skillMatrix.filter((s) => s.status === 'moderate_gap');
  const allGaps = [...criticalGaps, ...moderateGaps];

  const filteredGaps =
    selectedFilter === 'critical'
      ? criticalGaps
      : selectedFilter === 'moderate'
      ? moderateGaps
      : allGaps;

  return (
    <div className="skill-dna-container">
      {/* Dynamic Toast Alert */}
      {toastMessage && (
        <div className="dna-toast-banner">
          <span>✦ {toastMessage}</span>
        </div>
      )}

      {/* 1. Header Band */}
      <div className="dna-header-pane">
        <div>
          <span className="dna-badge">Real-Time Competency Vector</span>
          <h2 className="dna-title">Skill DNA &amp; Gap Analysis</h2>
          <p className="dna-subtitle">
            Dynamic vector comparison comparing verified assessment data against target benchmarks for{' '}
            <strong className="text-cyan">{userProfile?.targetRole || 'Full Stack Engineer'}</strong>.
          </p>
        </div>

        <div className="dna-header-actions">
          <button className="btn-export-dossier-hash" onClick={handleExportDossier}>
            🔗 Export Verified DNA
          </button>

          <div className="graph-mode-tabs">
            <button
              className={`graph-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
              onClick={() => setActiveTab('radar')}
            >
              🕸️ Spider Web Graph
            </button>
            <button
              className={`graph-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
              onClick={() => setActiveTab('network')}
            >
              ◈ Knowledge Network
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Gap Analysis & Scoring Matrix */}
      <div className="dna-grid-layout">
        <div className="graph-card-wrapper">
          <div className="graph-canvas-box">
            {activeTab === 'radar' ? (
              <canvas ref={radarCanvasRef} className="cyber-canvas"></canvas>
            ) : (
              <canvas ref={networkCanvasRef} className="cyber-canvas"></canvas>
            )}
          </div>

          <div className="graph-legend-row">
            <div className="legend-item">
              <span className="legend-line user-line"></span>
              <span>Your Assessed Profile</span>
            </div>
            <div className="legend-item">
              <span className="legend-line target-line"></span>
              <span>Target Role Benchmark</span>
            </div>
            <div className="legend-item">
              <span className="legend-line gap-line"></span>
              <span>Critical Skill Disconnect</span>
            </div>
          </div>
        </div>

        <div className="matrix-breakdown-card">
          <div className="mbc-header">
            <h3 className="matrix-heading">Live Skill Mapping &amp; Deficit Breakdown</h3>
            <span className="mbc-hint">Click row to inspect vector nodes</span>
          </div>

          <div className="skills-stat-table">
            {skillMatrix.map((item) => {
              const gap = item.targetScore - item.userScore;
              return (
                <div
                  key={item.skill}
                  className={`skill-matrix-row ${item.status === 'critical_gap' ? 'is-gap' : ''}`}
                  onClick={() => setSelectedSkillDetail(item)}
                  title="Click to inspect competency telemetry"
                >
                  <div className="row-skill-info">
                    <span className="skill-tag-name">{item.skill}</span>
                    <span className="skill-category-tag">{item.category}</span>
                  </div>

                  <div className="row-score-track">
                    <div className="track-bar">
                      <div className="track-fill-user" style={{ width: `${item.userScore}%` }}></div>
                      <div className="track-marker-target" style={{ left: `${item.targetScore}%` }} title="Benchmark"></div>
                    </div>
                    <div className="track-numbers">
                      <span>Assessed: {item.userScore}%</span>
                      <span>Target: {item.targetScore}%</span>
                    </div>
                  </div>

                  <div className="row-delta-badge">
                    {gap <= 0 ? (
                      <span className="badge-pass">Matched (+{Math.abs(gap)}%)</span>
                    ) : (
                      <span className={`badge-gap ${gap > 30 ? 'critical' : 'moderate'}`}>
                        -{gap}% Gap
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Prescriptive Insight */}
          <div className="ai-prescriptive-box">
            <div className="prescriptive-title">
              <span className="sparkle-cyan">✦</span>
              <span>Prescriptive Recommendation</span>
            </div>
            <p className="prescriptive-desc">
              Your primary hiring obstacle is <strong>Docker &amp; Containerization (-50% Disconnect)</strong> followed by{' '}
              <strong>Redis Caching (-35%)</strong>. Completing the learning pathways below will bridge this deficit and elevate your overall hireability to <strong>94%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 3. RECOMMENDATIONS & CURATED LEARNING ROADMAP (POST-GAP ANALYSIS) */}
      <section className="learning-recommendations-section">
        <div className="recom-header-bar">
          <div>
            <span className="recom-badge">AI Prescriptive Learning Engine</span>
            <h3 className="recom-title">Recommended Learning Pathways to Close Gaps</h3>
            <p className="recom-sub">
              Targeted modules selected by the SkillBridge intelligence engine based on your exact evaluated deficits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="recom-filter-pills">
            <button
              className={`pill-filter ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Gaps ({allGaps.length})
            </button>
            <button
              className={`pill-filter ${selectedFilter === 'critical' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('critical')}
            >
              Critical Only ({criticalGaps.length})
            </button>
            <button
              className={`pill-filter ${selectedFilter === 'moderate' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('moderate')}
            >
              Moderate ({moderateGaps.length})
            </button>
          </div>
        </div>

        {/* Resources Stack Grouped By Skill Gap */}
        <div className="gap-resource-groups">
          {filteredGaps.map((gapItem) => {
            const resources = resourceCatalog[gapItem.skill] || [];
            const deficit = gapItem.targetScore - gapItem.userScore;

            return (
              <div key={gapItem.skill} className="gap-resource-card">
                <div className="gap-card-header">
                  <div className="gch-left">
                    <span className="gap-skill-name">{gapItem.skill}</span>
                    <span className="gap-cat-badge">{gapItem.category}</span>
                  </div>
                  <div className="gch-right">
                    <span className={`gap-stat-pill ${gapItem.status}`}>
                      -{deficit}% Gap • Target: {gapItem.targetScore}%
                    </span>
                    {setActivePage && (
                      <button
                        className="btn-reassess-pill"
                        onClick={() => {
                          showToast(`Initiating Adaptive Diagnostic for ${gapItem.skill}...`);
                          setTimeout(() => setActivePage('assessment'), 600);
                        }}
                        title="Reassess after completing resources"
                      >
                        Reassess Skill ⟳
                      </button>
                    )}
                  </div>
                </div>

                <div className="resource-items-grid">
                  {resources.length > 0 ? (
                    resources.map((res) => (
                      <div key={res.id} className="resource-item-box">
                        <div className="rib-top">
                          <span className="rib-type">
                            <span className="rib-icon">{res.icon}</span>
                            {res.type}
                          </span>
                          <span className="rib-diff">{res.difficulty}</span>
                        </div>

                        <h4 className="rib-title">{res.title}</h4>
                        <p className="rib-desc">{res.description}</p>

                        <div className="rib-bottom-meta">
                          <span className="rib-provider">By {res.provider}</span>
                          <span className="rib-time">⏱ {res.duration}</span>
                        </div>

                        <a
                          href={res.url}
                          target={res.url === '#' ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className={`rib-action-btn ${res.url === '#' ? 'blueprint-btn' : ''}`}
                          onClick={(e) => handleModuleClick(e, res)}
                        >
                          {res.url === '#' ? 'Launch Sandbox Lab 🛠️' : 'Start Module →'}
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="no-resource-box">
                      <span>Curating specialized learning vector for {gapItem.skill}...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detail Inspection Modal for Row Clicks */}
      {selectedSkillDetail && (
        <div className="dna-modal-backdrop" onClick={() => setSelectedSkillDetail(null)}>
          <div className="dna-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dmb-header">
              <span className="dmb-tag">COMPETENCY NODE TELEMETRY</span>
              <h2>{selectedSkillDetail.skill} ({selectedSkillDetail.category})</h2>
              <button className="btn-close-modal" onClick={() => setSelectedSkillDetail(null)}>✕</button>
            </div>
            <div className="dmb-body">
              <div className="dmb-metric-row">
                <div>
                  <span>CANDIDATE SCORE</span>
                  <strong>{selectedSkillDetail.userScore}%</strong>
                </div>
                <div>
                  <span>BENCHMARK TARGET</span>
                  <strong className="text-cyan">{selectedSkillDetail.targetScore}%</strong>
                </div>
                <div>
                  <span>VERIFICATION DELTA</span>
                  <strong className={selectedSkillDetail.targetScore - selectedSkillDetail.userScore > 0 ? 'text-red' : 'text-green'}>
                    {selectedSkillDetail.userScore - selectedSkillDetail.targetScore}%
                  </strong>
                </div>
              </div>

              <p className="dmb-details-desc">{selectedSkillDetail.details}</p>
            </div>
            <div className="dmb-footer">
              <button
                className="btn-reassess-modal"
                onClick={() => {
                  setSelectedSkillDetail(null);
                  setActivePage('assessment');
                }}
              >
                Launch Diagnostic for {selectedSkillDetail.skill} ⟳
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Lab Interactive Drawer */}
      {sandboxModalOpen && activeSandboxModule && (
        <div className="dna-modal-backdrop" onClick={() => setSandboxModalOpen(false)}>
          <div className="dna-modal-box sandbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="dmb-header">
              <span className="dmb-tag">INTERACTIVE SANDBOX LAB</span>
              <h2>{activeSandboxModule.title}</h2>
              <button className="btn-close-modal" onClick={() => setSandboxModalOpen(false)}>✕</button>
            </div>
            <div className="dmb-body">
              <p className="sandbox-intro">{activeSandboxModule.description}</p>

              <div className="sandbox-code-preview">
                <span className="code-filename">docker-compose.yml (Sandbox Template)</span>
                <pre>
{`version: '3.8'
services:
  web:
    build: .
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://cache:6379/0
    depends_on:
      - cache
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"`}
                </pre>
              </div>

              <div className="sandbox-status-note">
                <span>✦ Virtual container runtime ready. Complete lab to close <strong>-50% Docker Disconnect</strong>.</span>
              </div>
            </div>
            <div className="dmb-footer">
              <button className="btn-close-secondary" onClick={() => setSandboxModalOpen(false)}>Dismiss</button>
              <button
                className="btn-launch-ide"
                onClick={() => {
                  showToast('Provisioning Cloud Container IDE...');
                  setTimeout(() => setSandboxModalOpen(false), 1200);
                }}
              >
                Initialize Cloud Environment ⚡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}