import React, { useState } from 'react';
import './CareerTwin.css';

export default function CareerTwin({ setActivePage }) {
  const [activeTab, setActiveTab] = useState('simulation');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [simulatedScore, setSimulatedScore] = useState(82);
  const [activeStackGaps, setActiveStackGaps] = useState(['Docker Swarm', 'Distributed Locking (Redis)']);
  const [addedSkills, setAddedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const targetRole = 'Senior Distributed Backend Engineer';

  const roadmapMilestones = [
    {
      id: 1,
      phase: 'Phase 01',
      title: 'CPython Memory & Concurrency',
      status: 'Completed',
      impact: '+12% Readiness',
      deliverable: 'Thread-safety with GIL workarounds, memory profiler tracing, cyclic reference resolution.',
      actionCta: 'View Benchmark Log'
    },
    {
      id: 2,
      phase: 'Phase 02',
      title: 'Asynchronous Microservices & Starlette',
      status: 'Completed',
      impact: '+18% Readiness',
      deliverable: 'Async context managers, connection pooling, Redis Pub/Sub ring message brokering.',
      actionCta: 'Inspect Code DNA'
    },
    {
      id: 3,
      phase: 'Phase 03',
      title: 'Container Orchestration & Namespaces',
      status: 'Action Required',
      impact: '+15% Readiness',
      deliverable: 'Building minimal multi-stage distroless containers, cgroup memory quotas, OverlayFS.',
      actionCta: 'Launch Diagnostic Test'
    },
    {
      id: 4,
      phase: 'Phase 04',
      title: 'Distributed Consensus & WAL Compaction',
      status: 'Upcoming',
      impact: '+22% Readiness',
      deliverable: 'Raft state machine replication, write-ahead logs, and RocksDB compaction strategies.',
      actionCta: 'Unlock Syllabus'
    }
  ];

  const handleSimulateAddSkill = (skill) => {
    if (addedSkills.includes(skill)) return;
    setAddedSkills(prev => [...prev, skill]);
    setSimulatedScore(prev => Math.min(100, prev + 6));
    setActiveStackGaps(prev => prev.filter(s => s !== skill));
  };

  const handleCustomSkillAdd = (e) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    handleSimulateAddSkill(customSkillInput.trim());
    setCustomSkillInput('');
  };

  return (
    <div className="career-twin-page">
      <div className="ct-top-banner">
        <div>
          <span className="ct-badge">NEURAL VECTOR SIMULATOR</span>
          <h1 className="ct-title">AI Career Twin Engine</h1>
          <p className="ct-sub">Synthesizing predictive career projection for <strong>{targetRole}</strong></p>
        </div>

        <div className="ct-score-dial">
          <div className="dial-circle">
            <span className="dial-value">{simulatedScore}%</span>
            <span className="dial-lbl">FIT INDEX</span>
          </div>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="ct-tab-strip">
        <button
          className={`ct-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          ⚡ Live Trajectory Simulation
        </button>
        <button
          className={`ct-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          🗺️ Deterministic Next-Best-Action Roadmap
        </button>
      </div>

      {/* Tab 1: Live Interactive Skill Vector Simulator */}
      {activeTab === 'simulation' && (
        <div className="ct-sim-grid">
          <div className="sim-control-card">
            <h3>Inject Hypothetical Competencies</h3>
            <p>Select or type technical proficiencies to evaluate real-time score delta before taking diagnostic assessments.</p>

            <div className="sim-pill-group">
              {['Docker Swarm', 'Distributed Locking (Redis)', 'eBPF Kernel Tracing', 'Raft Consensus'].map((sk) => (
                <button
                  key={sk}
                  className={`sim-skill-chip ${addedSkills.includes(sk) ? 'injected' : ''}`}
                  onClick={() => handleSimulateAddSkill(sk)}
                  disabled={addedSkills.includes(sk)}
                >
                  {addedSkills.includes(sk) ? `✓ Injected: ${sk}` : `+ Add ${sk}`}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSkillAdd} className="sim-custom-input-row">
              <input
                type="text"
                placeholder="Type custom skill (e.g. Apache Kafka)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
              />
              <button type="submit" className="btn-inject-skill">Simulate Impact</button>
            </form>

            <div className="sim-delta-alert">
              <strong>Simulated Delta: +{addedSkills.length * 6}%</strong>
              <span>Target Role: Enterprise Grade Readiness achieved when score crosses 90%.</span>
            </div>
          </div>

          <div className="sim-feedback-card">
            <h3>Twin Synthesis Telemetry</h3>
            <div className="twin-diagnostics-list">
              <div className="td-item">
                <span className="td-k">Current Verified Baseline</span>
                <strong className="td-v text-cyan">82% Verified</strong>
              </div>
              <div className="td-item">
                <span className="td-k">Simulated Forecast Level</span>
                <strong className="td-v text-green">{simulatedScore}% Projected</strong>
              </div>
              <div className="td-item">
                <span className="td-k">Remaining Critical Blockers</span>
                <span className="td-v text-amber">{activeStackGaps.length} Gaps Remaining</span>
              </div>
            </div>

            <button className="btn-launch-assessment-sync" onClick={() => setActivePage('assessment')}>
              Verify Injected Skills in Diagnostic Test →
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Milestone Roadmap with Action Buttons */}
      {activeTab === 'roadmap' && (
        <div className="ct-roadmap-flow">
          {roadmapMilestones.map((node) => (
            <div key={node.id} className={`roadmap-node-card ${node.status.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="rnc-meta">
                <span className="rnc-phase">{node.phase}</span>
                <span className={`rnc-status-badge ${node.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  ● {node.status}
                </span>
              </div>

              <div className="rnc-content">
                <div className="rnc-header-flex">
                  <h3 className="rnc-title">{node.title}</h3>
                  <span className="rnc-impact">{node.impact}</span>
                </div>
                <p className="rnc-desc">{node.deliverable}</p>
              </div>

              <div className="rnc-actions">
                <button
                  className="btn-rnc-action"
                  onClick={() => {
                    setSelectedMilestone(node);
                    if (node.actionCta.includes('Diagnostic')) {
                      setActivePage('assessment');
                    }
                  }}
                >
                  {node.actionCta} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap Milestone Detail Modal */}
      {selectedMilestone && !selectedMilestone.actionCta.includes('Diagnostic') && (
        <div className="ct-modal-backdrop" onClick={() => setSelectedMilestone(null)}>
          <div className="ct-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ct-mb-header">
              <span className="ct-badge">{selectedMilestone.phase} BENCHMARK</span>
              <h2>{selectedMilestone.title}</h2>
              <button className="btn-close-modal" onClick={() => setSelectedMilestone(null)}>✕</button>
            </div>
            <div className="ct-mb-body">
              <p>{selectedMilestone.deliverable}</p>
              <div className="verified-proof-stamp">
                <span>VERIFICATION STATUS:</span>
                <strong>{selectedMilestone.status.toUpperCase()}</strong>
              </div>
            </div>
            <div className="ct-mb-footer">
              <button className="btn-modal-close-main" onClick={() => setSelectedMilestone(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}