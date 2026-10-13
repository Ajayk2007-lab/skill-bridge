import React, { useState, useEffect } from 'react';
import './StatsCounter.css';

export default function StatsCounter() {
  const [counts, setCounts] = useState({
    assessments: 0,
    readiness: 0,
    matched: 0,
    accuracy: 0
  });

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        assessments: Math.floor(progress * 100),
        readiness: Math.floor(progress * 98),
        matched: Math.floor(progress * 50),
        accuracy: Math.floor(progress * 99)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts({
          assessments: 100,
          readiness: 98,
          matched: 50,
          accuracy: 99
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-container">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-value">{counts.assessments}K+</div>
          <div className="stat-label">SKILL ASSESSMENTS</div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-value">{counts.readiness}%</div>
          <div className="stat-label">INDUSTRY READINESS</div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-value">{counts.matched}K+</div>
          <div className="stat-label">OPPORTUNITIES MATCHED</div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-value">{counts.accuracy}%</div>
          <div className="stat-label">GAP DETECTION ACCURACY</div>
        </div>
      </div>
    </section>
  );
}