import React, { useState } from 'react';
import './Opportunities.css';

export default function Opportunities({ setActivePage }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeModalJob, setActiveModalJob] = useState(null);
  const [actionAlert, setActionAlert] = useState('');

  const jobPool = [
    {
      id: 'job-1',
      title: 'Full Stack AI Engineer',
      company: 'Cognitive Systems',
      location: 'Bengaluru / Remote',
      stipend: '₹45,000 / mo',
      matchScore: 94,
      category: 'ai',
      type: 'Internship',
      tags: ['FastAPI', 'React', 'Vector DB', 'Docker'],
      description: 'Architecting resilient high-throughput LLM middleware APIs, real-time reactive dashboards, and deploying on isolated containerized Kubernetes clusters.'
    },
    {
      id: 'job-2',
      title: 'Backend Systems Engineer',
      company: 'ScaleGrid Cloud',
      location: 'Hyderabad, India',
      stipend: '₹55,000 / mo',
      matchScore: 88,
      category: 'backend',
      type: 'Full-time',
      tags: ['Python', 'PostgreSQL', 'Redis', 'Docker'],
      description: 'Building event-driven microservices, handling distributed locking, memory leak tracing, and optimizing database write-amplification.'
    },
    {
      id: 'job-3',
      title: 'MLOps Pipeline Intern',
      company: 'TensorFlow Labs',
      location: 'Gurugram / Hybrid',
      stipend: '₹40,000 / mo',
      matchScore: 82,
      category: 'ai',
      type: 'Internship',
      tags: ['Python', 'Docker', 'Kubernetes', 'CI/CD'],
      description: 'Automating continuous model drift evaluation, artifact versioning, and zero-downtime serving using Triton Inference Server.'
    },
    {
      id: 'job-4',
      title: 'Distributed Systems Architect',
      company: 'Nexus Infotech',
      location: 'Pune / Remote',
      stipend: '₹65,000 / mo',
      matchScore: 91,
      category: 'backend',
      type: 'Full-time',
      tags: ['FastAPI', 'gRPC', 'Kafka', 'Docker'],
      description: 'Leading consensus protocol implementations (Raft), message streaming architectures, and high-performance socket routing.'
    }
  ];

  const filteredJobs = jobPool.filter((job) => {
    const matchesFilter = filter === 'all' || job.category === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const triggerNotification = (msg) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(''), 3000);
  };

  const handleApply = (job) => {
    if (appliedJobs.includes(job.id)) {
      triggerNotification(`Already applied for ${job.title} at ${job.company}`);
      return;
    }
    setAppliedJobs(prev => [...prev, job.id]);
    triggerNotification(`Application Dossier Dispatched to ${job.company} ✓`);
    setActiveModalJob(null);
  };

  const handleToggleSave = (jobId) => {
    setSavedJobs(prev => {
      const isSaved = prev.includes(jobId);
      triggerNotification(isSaved ? 'Opportunity removed from bookmarks.' : 'Saved to target bookmarks ✓');
      return isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
    });
  };

  return (
    <div className="opportunities-page">
      {actionAlert && (
        <div className="opp-toast-alert">
          <span>✦ {actionAlert}</span>
        </div>
      )}

      <div className="opp-header-row">
        <div>
          <span className="opp-badge">AI OPPORTUNITY DISPATCH</span>
          <h1 className="opp-main-title">Matched Industry Openings</h1>
          <p className="opp-desc">Vector-similarity matches dynamically filtered using your verified Skill DNA tier.</p>
        </div>

        <div className="opp-stats-pills">
          <div className="osp-card">
            <span>APPLIED</span>
            <strong>{appliedJobs.length}</strong>
          </div>
          <div className="osp-card">
            <span>SAVED</span>
            <strong>{savedJobs.length}</strong>
          </div>
        </div>
      </div>

      {/* Control Filters and Live Search */}
      <div className="opp-controls-bar">
        <div className="opp-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by role, stack (e.g. FastAPI, Docker), or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="opp-filter-tabs">
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All Roles ({jobPool.length})
          </button>
          <button className={`tab-btn ${filter === 'backend' ? 'active' : ''}`} onClick={() => setFilter('backend')}>
            Backend
          </button>
          <button className={`tab-btn ${filter === 'ai' ? 'active' : ''}`} onClick={() => setFilter('ai')}>
            AI &amp; MLOps
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="opp-grid">
        {filteredJobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);
          const isSaved = savedJobs.includes(job.id);

          return (
            <div key={job.id} className="job-action-card">
              <div className="jac-top">
                <div className="jac-company-meta">
                  <div className="jac-logo">{job.company.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="jac-title">{job.title}</h3>
                    <span className="jac-company">{job.company} • {job.location}</span>
                  </div>
                </div>

                <div className="jac-match-pill" style={{ borderColor: job.matchScore > 90 ? '#00f0ff' : '#fbbf24' }}>
                  <span className="match-num">{job.matchScore}%</span>
                  <span className="match-lbl">DNA MATCH</span>
                </div>
              </div>

              <p className="jac-snippet">{job.description}</p>

              <div className="jac-tags-row">
                {job.tags.map((t, idx) => (
                  <span key={idx} className="jac-tag-pill">{t}</span>
                ))}
              </div>

              <div className="jac-footer">
                <div className="jac-stipend">
                  <span>COMPENSATION</span>
                  <strong>{job.stipend}</strong>
                </div>

                <div className="jac-actions-btns">
                  <button
                    className={`btn-save-opp ${isSaved ? 'saved' : ''}`}
                    onClick={() => handleToggleSave(job.id)}
                    title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
                  >
                    {isSaved ? '★' : '☆'}
                  </button>

                  <button className="btn-view-details" onClick={() => setActiveModalJob(job)}>
                    Inspect DNA
                  </button>

                  <button
                    className={`btn-apply-direct ${isApplied ? 'applied' : ''}`}
                    onClick={() => handleApply(job)}
                  >
                    {isApplied ? 'Applied ✓' : 'One-Click Apply →'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Quick Dispatch Modal */}
      {activeModalJob && (
        <div className="opp-modal-backdrop" onClick={() => setActiveModalJob(null)}>
          <div className="opp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="om-header">
              <div>
                <span className="om-tag">{activeModalJob.type.toUpperCase()} SPECIFICATION</span>
                <h2>{activeModalJob.title}</h2>
                <span className="om-sub">{activeModalJob.company} • {activeModalJob.location}</span>
              </div>
              <button className="om-close-btn" onClick={() => setActiveModalJob(null)}>✕</button>
            </div>

            <div className="om-body">
              <div className="om-match-box">
                <div className="om-vector-score">
                  <span className="score-big">{activeModalJob.matchScore}%</span>
                  <span>Calculated Vector Compatibility</span>
                </div>
                <p>Calculated via Cosine Similarity between your verified skills and active enterprise hiring requisition weights.</p>
              </div>

              <div className="om-section">
                <h4>ROLE BRIEF &amp; OBJECTIVES</h4>
                <p>{activeModalJob.description}</p>
              </div>

              <div className="om-section">
                <h4>VERIFIED STACK PREREQUISITES</h4>
                <div className="om-tags">
                  {activeModalJob.tags.map((t, i) => (
                    <span key={i} className="om-tag-pill">✓ {t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="om-footer">
              <button className="btn-modal-cancel" onClick={() => setActiveModalJob(null)}>Close</button>
              <button
                className={`btn-modal-apply ${appliedJobs.includes(activeModalJob.id) ? 'applied' : ''}`}
                onClick={() => handleApply(activeModalJob)}
              >
                {appliedJobs.includes(activeModalJob.id) ? 'Application Transmitted ✓' : 'Confirm Direct Application →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}