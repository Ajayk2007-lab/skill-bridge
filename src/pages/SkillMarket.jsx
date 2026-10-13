import React from 'react';
import './SkillMarket.css';

export default function SkillMarket() {
  const marketTrends = [
    { name: 'Generative AI & LLM Inference', category: 'Emerging', growth: '+44%', status: 'Surging' },
    { name: 'FastAPI & Async Microservices', category: 'Rising', growth: '+31%', status: 'High Demand' },
    { name: 'Docker & Kubernetes Orchestration', category: 'Rising', growth: '+28%', status: 'Core Requirement' },
    { name: 'Python Data Engineering (Pandas/SQL)', category: 'Stable', growth: '+12%', status: 'Baseline Expectation' },
    { name: 'Static Monolithic Server Rendering', category: 'Declining', growth: '-19%', status: 'Diminishing' }
  ];

  return (
    <div className="skillmarket-page">
      <div className="market-head">
        <span className="market-badge">Live Industry Demand Feed</span>
        <h2>Skill Market Intelligence</h2>
        <p>Real-time competency velocity aggregated across national hiring boards & partner firms.</p>
      </div>

      <div className="market-cards-grid">
        {marketTrends.map((t, i) => (
          <div key={i} className={`trend-card ${t.category.toLowerCase()}`}>
            <div className="trend-top">
              <span className="trend-cat">{t.category}</span>
              <span className="trend-growth">{t.growth}</span>
            </div>
            <h3 className="trend-name">{t.name}</h3>
            <span className="trend-status">Market Status: {t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}