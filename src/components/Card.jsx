import React from 'react';
import './Card.css';

export default function Card({ 
  badge = "AI Core", 
  title, 
  description, 
  metric, 
  metricLabel, 
  actionText = "Explore Feature", 
  onAction,
  icon = "✦"
}) {
  return (
    <div className="sb-cyber-card">
      <div className="card-top-bar">
        <span className="card-glyph">{icon}</span>
        <span className="card-badge">{badge}</span>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>

      {metric && (
        <div className="card-metric-block">
          <span className="metric-val">{metric}</span>
          <span className="metric-lbl">{metricLabel}</span>
        </div>
      )}

      <div className="card-bottom">
        <button className="card-btn" onClick={onAction}>
          <span>{actionText}</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}