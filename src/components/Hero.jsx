import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero({ onStartAssessment, onExploreIntelligence }) {
  const [aiQuestion, setAiQuestion] = useState('');
  const canvasRef = useRef(null);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    alert(`SkillBridge AI analyzing prompt: "${aiQuestion}"`);
    setAiQuestion('');
  };

  // Interactive Autonomous Glowing Cyber-Nodes Network on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate floating nodes
    const nodeCount = 28;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 2,
      color: Math.random() > 0.3 ? '#00f0ff' : '#a855f7'
    }));

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting energy lines between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move each node
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce from walls
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Subtle repulsion on mouse hover
        if (mouse.x && mouse.y) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 90) {
            n.x += (mdx / mdist) * 1.5;
            n.y += (mdy / mdist) * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="sb-hero">
      {/* Background Animated Cyber Glows */}
      <div className="hero-glow-bg"></div>
      <div className="hero-purple-orb"></div>

      {/* Floating Interactive Canvas Layer */}
      <div className="hero-canvas-wrap">
        <canvas ref={canvasRef} className="hero-network-canvas"></canvas>
      </div>

      <div className="sb-hero-inner">
        {/* Animated Badge */}
        <div className="hero-tag-badge">
          <span className="sparkle-pip">✦</span>
          <span>Next-Gen Skill Intelligence Ecosystem</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-main-heading">
          <span className="heading-line line-1">Know What You</span>
          <span className="heading-line line-2">Know. Discover</span>
          <span className="heading-line line-3 glow-cyan-text">What You’re Missing.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-description">
          SkillBridge transforms your resume, projects and professional profiles into a living 
          Skill Intelligence Profile — connecting your skills to learning, institutions, 
          industry requirements and opportunities.
        </p>

        {/* CTAs with hover and pulse effects */}
        <div className="hero-cta-group">
          <button className="btn-primary-cyan" onClick={onStartAssessment}>
            <span className="btn-text">Start Skill Assessment</span>
            <span className="btn-glimmer"></span>
          </button>
          <button className="btn-secondary-dark" onClick={onExploreIntelligence}>
            <span className="btn-text">Explore Skill Intelligence</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Global AI Homepage Search Capsule */}
        <div className="hero-ai-search">
          <form onSubmit={handleAskAI} className="ai-search-capsule">
            <span className="search-sparkle">✦</span>
            <input
              type="text"
              placeholder="Ask me anything about your career, skills or SkillBridge..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="ai-search-field"
            />
            <button type="submit" className="ai-search-submit">
              Ask AI
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}