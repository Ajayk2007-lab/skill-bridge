import React from 'react';
import './ProblemSection.css';

export default function ProblemSection() {
  const problems = [
    {
      id: '01',
      title: 'Academic Disconnect',
      desc: 'Traditional curricula often fail to align with the rapidly evolving skill demands of the modern industry landscape.',
      variant: 'cross',
    },
    {
      id: '02',
      title: 'Skills Gap Analysis',
      desc: 'Students struggle to identify the specific technical competencies required for entry-level roles, leading to significant time-to-hire delays.',
      variant: 'perspective-cross',
    },
    {
      id: '03',
      title: 'Opportunity Misalignment',
      desc: 'Generic job portals often list positions without providing the detailed skill intelligence needed to ensure a perfect fit.',
      variant: 'star-burst',
    },
    {
      id: '04',
      title: 'Industry Readiness',
      desc: 'Recruiters face immense difficulty in discovering candidates with the precise technical readiness required for complex software development.',
      variant: 'satellite',
    },
  ];

  const renderGraphic = (type) => {
    switch (type) {
      case 'cross':
        return (
          <svg viewBox="0 0 240 240" className="problem-svg">
            <line x1="50" y1="50" x2="190" y2="190" stroke="#00f0ff" strokeWidth="5" />
            <line x1="190" y1="50" x2="50" y2="190" stroke="#00f0ff" strokeWidth="5" />
            <circle cx="120" cy="120" r="28" className="svg-node core" />
            <circle cx="50" cy="50" r="16" className="svg-node" />
            <circle cx="190" cy="50" r="16" className="svg-node" />
            <circle cx="50" cy="190" r="16" className="svg-node" />
            <circle cx="190" cy="190" r="16" className="svg-node" />
          </svg>
        );

      case 'perspective-cross':
        return (
          <svg viewBox="0 0 260 180" className="problem-svg">
            <ellipse cx="130" cy="90" rx="40" ry="18" className="svg-node core" />
            <line x1="40" y1="40" x2="220" y2="140" stroke="#00f0ff" strokeWidth="4" />
            <line x1="220" y1="40" x2="40" y2="140" stroke="#00f0ff" strokeWidth="4" />
            <ellipse cx="40" cy="40" rx="14" ry="9" className="svg-node" />
            <ellipse cx="220" cy="40" rx="14" ry="9" className="svg-node" />
            <ellipse cx="40" cy="140" rx="14" ry="9" className="svg-node" />
            <ellipse cx="220" cy="140" rx="14" ry="9" className="svg-node" />
          </svg>
        );

      case 'star-burst':
        return (
          <svg viewBox="0 0 260 260" className="problem-svg">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x2 = 130 + 85 * Math.cos(rad);
              const y2 = 130 + 85 * Math.sin(rad);
              return (
                <g key={i}>
                  <line x1="130" y1="130" x2={x2} y2={y2} stroke="#00f0ff" strokeWidth="2.5" opacity="0.8" />
                  <circle cx={x2} cy={y2} r="10" className="svg-node" />
                </g>
              );
            })}
            <circle cx="130" cy="130" r="22" className="svg-node core" />
          </svg>
        );

      case 'satellite':
        return (
          <svg viewBox="0 0 240 240" className="problem-svg">
            <line x1="60" y1="60" x2="180" y2="180" stroke="#00f0ff" strokeWidth="4" />
            <line x1="180" y1="60" x2="60" y2="180" stroke="#00f0ff" strokeWidth="4" />
            <circle cx="120" cy="120" r="24" className="svg-node core" />
            <circle cx="60" cy="60" r="14" className="svg-node" />
            <circle cx="50" cy="50" r="6" className="svg-node sub" />
            <circle cx="180" cy="60" r="14" className="svg-node" />
            <circle cx="190" cy="50" r="6" className="svg-node sub" />
            <circle cx="60" cy="180" r="14" className="svg-node" />
            <circle cx="50" cy="190" r="6" className="svg-node sub" />
            <circle cx="180" cy="180" r="14" className="svg-node" />
            <circle cx="190" cy="190" r="6" className="svg-node sub" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section className="problem-section">
      <div className="section-title-wrap">
        <span className="title-bar"></span>
        <h2 className="section-heading">THE PROBLEM</h2>
      </div>

      <div className="problems-stack">
        {problems.map((p, idx) => (
          <div key={p.id} className={`problem-row ${idx % 2 === 1 ? 'reverse' : ''}`}>
            <div className="problem-text-pane">
              <h3 className="problem-item-title">{p.title}</h3>
              <p className="problem-item-desc">{p.desc}</p>
            </div>
            <div className="problem-graphic-pane">
              <div className="graphic-glow-halo"></div>
              {renderGraphic(p.variant)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}