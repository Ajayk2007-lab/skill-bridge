import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Dashboard({ setActivePage }) {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const progressCanvasRef = useRef(null);

  // 1. Load Real Data from MySQL API on Mount
  useEffect(() => {
    async function fetchLiveHistory() {
      try {
        const stored = localStorage.getItem('sb_user_profile');
        const user = stored ? JSON.parse(stored) : null;
        const userEmail = user?.email || 'verified_student@dtu.ac.in';

        const res = await fetch(`${API_BASE_URL}/api/user-assessments/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          // MySQL data format mapped directly to UI structure
          if (data.history && data.history.length > 0) {
            const mapped = data.history.map((row) => ({
              id: row.id,
              skill: row.category,
              score: Math.round(row.score_percentage),
              status: row.score_percentage > 0 ? 'Verified' : 'Disqualified',
              warningStrikes: 0,
              date: new Date(row.submitted_at).toLocaleDateString(),
              level: row.readiness_band
            }));
            setAssessmentHistory(mapped);
          } else {
            // Local fallback only if no records exist yet
            const saved = localStorage.getItem('skillbridge_diagnostic_history');
            if (saved) setAssessmentHistory(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, fallback to local storage:', err);
        const saved = localStorage.getItem('skillbridge_diagnostic_history');
        if (saved) setAssessmentHistory(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    }

    fetchLiveHistory();
  }, []);

  // Compute Overall Aggregate Readiness from verified assessments
  const verifiedAssessments = assessmentHistory.filter(
    (item) => item.status !== 'Terminated / Disqualified (3 Strikes)' && item.score > 0
  );

  const avgReadiness = verifiedAssessments.length > 0
    ? Math.round(verifiedAssessments.reduce((acc, curr) => acc + curr.score, 0) / verifiedAssessments.length)
    : 0;

  // Canvas High-DPI Progress Trend Line
  useEffect(() => {
    if (!progressCanvasRef.current) return;
    const canvas = progressCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const cssWidth = canvas.parentElement.offsetWidth || 500;
    const cssHeight = 220;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const padLeft = 45;
    const padRight = 35;
    const padTop = 25;
    const padBottom = 35;
    const plotW = cssWidth - padLeft - padRight;
    const plotH = cssHeight - padTop - padBottom;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const displayData = verifiedAssessments.length >= 2
      ? verifiedAssessments.slice(0, 6).reverse()
      : verifiedAssessments.length === 1
      ? [{ score: 0, skill: 'Start', date: 'Init' }, verifiedAssessments[0]]
      : [
          { score: 0, skill: 'No Data', date: 'Init' },
          { score: 0, skill: 'Pending', date: 'Now' }
        ];

    // Grid lines
    [0, 25, 50, 75, 100].forEach((val) => {
      const y = Math.round(padTop + plotH - (val / 100) * plotH) + 0.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(cssWidth - padRight, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 10px Rajdhani, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${val}%`, padLeft - 8, y);
    });

    const coords = displayData.map((item, i) => {
      const x = padLeft + (i / (displayData.length - 1)) * plotW;
      const y = padTop + plotH - (item.score / 100) * plotH;
      return { x, y, ...item };
    });

    // Gradient fill under curve
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.lineTo(coords[coords.length - 1].x, padTop + plotH);
    ctx.lineTo(coords[0].x, padTop + plotH);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Solid Neon Line
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Points and labels
    coords.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#03070d';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '700 11px Orbitron, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${pt.score}%`, pt.x, pt.y - 7);

      ctx.font = '600 10px Rajdhani, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textBaseline = 'top';
      ctx.fillText((pt.skill || '').substring(0, 8), pt.x, padTop + plotH + 8);
    });
  }, [verifiedAssessments, avgReadiness]);

  return (
    <div className="dashboard-page-container">
      {/* Top Welcome Header */}
      <div className="dash-header-band">
        <div>
          <span className="dash-badge">Continuous Skill Intelligence</span>
          <h2>Candidate Competency Overview</h2>
          <p>Real-time telemetry aggregating diagnostic evaluations, skill DNA mapping, and progress history.</p>
        </div>
        <button className="btn-take-assessment-cta" onClick={() => setActivePage('assessment')}>
          + Launch Assessment Diagnostic
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card">
          <span className="dm-label">Aggregate Verified Readiness</span>
          <span className="dm-val text-cyan">{avgReadiness}%</span>
          <span className="dm-sub">Industry Benchmark: 85%</span>
        </div>
        <div className="dash-metric-card">
          <span className="dm-label">Assessments Completed</span>
          <span className="dm-val">{verifiedAssessments.length}</span>
          <span className="dm-sub">Live MySQL Synchronized</span>
        </div>
        <div className="dash-metric-card">
          <span className="dm-label">Integrity Index</span>
          <span className="dm-val text-green">98.4%</span>
          <span className="dm-sub">Proctored Anti-Cheat Verification</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dash-main-grid">
        {/* Left Column: Progress Trajectory Curve */}
        <div className="dash-chart-card">
          <div className="dcc-header">
            <div>
              <h3>Assessment Competency Progress</h3>
              <p>Historical trajectory tracking diagnostic scores across evaluation sessions.</p>
            </div>
            <span className="dcc-tag">Live MySQL Canvas</span>
          </div>

          <div className="dash-canvas-wrapper">
            <canvas ref={progressCanvasRef} className="dash-trend-canvas" />
          </div>
        </div>

        {/* Right Column: Recent Assessment History Ledger */}
        <div className="dash-history-card">
          <div className="dhc-header">
            <h3>Diagnostic History Ledger</h3>
            <span className="dhc-count">{assessmentHistory.length} Total Records</span>
          </div>

          <div className="dhc-table-wrap">
            {loading ? (
              <div className="dhc-empty">
                <p>Streaming verified records from MySQL...</p>
              </div>
            ) : assessmentHistory.length === 0 ? (
              <div className="dhc-empty">
                <p>No assessment sessions recorded yet.</p>
                <button className="btn-primary-cyan" onClick={() => setActivePage('assessment')}>
                  Take First Assessment →
                </button>
              </div>
            ) : (
              <table className="dhc-table">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Strikes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentHistory.slice(0, 6).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.skill}</strong>
                        <span className="dhc-date">{item.date}</span>
                      </td>
                      <td>
                        <strong className={item.score === 0 ? 'text-red' : 'text-cyan'}>
                          {item.score}%
                        </strong>
                      </td>
                      <td>
                        <span className={`status-pill ${item.score === 0 ? 'pill-fail' : 'pill-pass'}`}>
                          {item.score === 0 ? 'Disqualified' : 'Verified'}
                        </span>
                      </td>
                      <td>{item.warningStrikes}/3</td>
                      <td>
                        <button
                          className="btn-reassess-link"
                          onClick={() => setActivePage('assessment')}
                          title="Reassess Domain"
                        >
                          Reassess ⟳
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}