import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import './InstitutionDashboard.css';

export default function InstitutionDashboard() {
  const [cohortData, setCohortData] = useState(null);

  useEffect(() => {
    api.getInstitutionCohortStats().then(setCohortData);
  }, []);

  if (!cohortData) return <div className="inst-loading">Loading Institutional Analytics...</div>;

  return (
    <div className="institution-container">
      <div className="inst-header">
        <span className="inst-badge">Academic-Industry Bridge System</span>
        <h2>Cohort Curriculum & Placement Analytics</h2>
        <p>Real-time analytics aggregating 420 engineering candidates against industry recruitment requirements.</p>
      </div>

      {/* Metric Counters */}
      <div className="inst-counters">
        <div className="ic-card">
          <span className="ic-label">Enrolled Cohort</span>
          <span className="ic-val">{cohortData.cohortTotal}</span>
        </div>
        <div className="ic-card">
          <span className="ic-label">Average Readiness Index</span>
          <span className="ic-val text-cyan">{cohortData.avgReadiness}%</span>
        </div>
        <div className="ic-card">
          <span className="ic-label">Curriculum Deficit</span>
          <span className="ic-val text-red">3 Critical Areas</span>
        </div>
      </div>

      {/* Interactive Curriculum vs Industry Gap Graph */}
      <div className="inst-graph-card">
        <h3>Curriculum Coverage vs Industry Hiring Demand</h3>
        <p className="graph-sub">Gaps indicate syllabus modernization needed for ABET / NBA accreditation.</p>

        <div className="velocity-bars-stack">
          {cohortData.curriculumGaps.map((item, idx) => {
            const gap = item.industryDemand - item.curriculumCoverage;
            return (
              <div key={idx} className="velocity-row">
                <div className="vr-title-row">
                  <span className="vr-subject">{item.subject}</span>
                  <span className={`vr-gap-tag ${gap > 30 ? 'critical' : ''}`}>
                    {gap > 0 ? `-${gap}% Disconnect` : 'Aligned'}
                  </span>
                </div>

                <div className="vr-dual-track">
                  {/* Current Syllabus Coverage */}
                  <div className="track-pair">
                    <span className="track-tag">Syllabus: {item.curriculumCoverage}%</span>
                    <div className="bar-bg">
                      <div className="bar-fill-inst" style={{ width: `${item.curriculumCoverage}%` }}></div>
                    </div>
                  </div>

                  {/* Industry Market Velocity */}
                  <div className="track-pair">
                    <span className="track-tag">Market Need: {item.industryDemand}%</span>
                    <div className="bar-bg">
                      <div className="bar-fill-ind" style={{ width: `${item.industryDemand}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}