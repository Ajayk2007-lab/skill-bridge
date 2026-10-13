import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [escalated, setEscalated] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null); // Click to expand answer state
  const [ticketSuccess, setTicketSuccess] = useState('');

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'Technical Issue',
    message: ''
  });

  const knowledgeVectors = [
    {
      id: 1,
      question: 'How does reverse opportunity matching work?',
      answer: 'Reverse Opportunity Matching bypasses traditional keyword resume screening. Our vector engine computes semantic cosine similarity between the student’s verified proctor code proofs and enterprise requisition thresholds, continuously matching candidates directly to high-CTC roles without manual applications.'
    },
    {
      id: 2,
      question: 'Why is my Skill DNA missing a technical node?',
      answer: 'Skill DNA nodes only light up when a candidate achieves ≥75% in a real-time surveillance proctored evaluation. If a node (e.g. Distributed Caching) is missing, the student needs to complete that module or submit a code test via the verified node sandbox.'
    },
    {
      id: 3,
      question: 'How do institutions sync their curriculum data?',
      answer: 'University nodes (such as DTU or NSUT) stream syllabus topics via our FastAPI institutional endpoints. The engine calculates the deviation between academic syllabi and current market hiring requisitions, outputting a real-time Curriculum Gap Index.'
    }
  ];

  const handleToggleFaq = (id) => {
    setActiveFaq(prev => (prev === id ? null : id));
  };

  const handleEscalatedSubmit = (e) => {
    e.preventDefault();
    const refId = `SIH26044-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketSuccess(`✓ Support request dispatched to Team Binary Brains (Ref: ${refId})`);
    setContactForm({ name: '', email: '', category: 'Technical Issue', message: '' });
    setEscalated(false);

    setTimeout(() => {
      setTicketSuccess('');
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-head">
        <span className="contact-badge">Support Escalation Protocol</span>
        <h2>SkillBridge Assistance</h2>
        <p>AI-First triage backed by direct team escalation.</p>
      </div>

      {ticketSuccess && (
        <div style={{
          background: 'rgba(0, 240, 255, 0.12)',
          border: '1px solid #00f0ff',
          padding: '14px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#00f0ff',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {ticketSuccess}
        </div>
      )}

      <div className="ai-triage-card">
        <div className="triage-icon">✦</div>
        <h3>Can SkillBridge AI Solve This Immediately?</h3>
        <p>Common concerns can be resolved dynamically through our knowledge vectors:</p>

        {/* CLICKABLE QUESTION ACCORDION */}
        <div className="quick-troubleshoot-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {knowledgeVectors.map((item) => {
            const isOpen = activeFaq === item.id;
            return (
              <div
                key={item.id}
                style={{
                  background: isOpen ? '#09152b' : 'rgba(2, 6, 23, 0.85)',
                  border: isOpen ? '1px solid #00f0ff' : '1px solid #1e293b',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 0 16px rgba(0, 240, 255, 0.15)' : 'none'
                }}
              >
                {/* QUESTION ROW */}
                <button
                  type="button"
                  onClick={() => handleToggleFaq(item.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: isOpen ? '#00f0ff' : '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{ color: '#00f0ff', fontSize: '13px', marginLeft: '10px' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {/* EXPANDED ANSWER BOX */}
                {isOpen && (
                  <div
                    style={{
                      padding: '14px 20px 18px 20px',
                      borderTop: '1px solid #0e223d',
                      background: 'rgba(4, 13, 31, 0.95)',
                      color: '#cbd5e1',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }}
                  >
                    <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      ✦ VERIFIED KNOWLEDGE VECTOR:
                    </div>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!escalated ? (
          <div className="escalate-action" style={{ marginTop: '28px' }}>
            <span>Issue requires human team intervention?</span>
            <button className="btn-escalate" onClick={() => setEscalated(true)}>
              Escalate to Binary Brains Team →
            </button>
          </div>
        ) : (
          <form onSubmit={handleEscalatedSubmit} className="escalated-form" style={{ marginTop: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0 }}>Direct SIH26044 Team Ticket</h4>
              <button
                type="button"
                onClick={() => setEscalated(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕ Cancel
              </button>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Ajay Kumar"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="user@skillbridge.ai"
              />
            </div>
            <div className="form-group">
              <label>Issue Category</label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
              >
                <option value="Technical Issue">Technical / Prototype Bug</option>
                <option value="Skill DNA Assessment">Skill DNA Assessment Anomaly</option>
                <option value="Institution Data">Higher Ed Institution Integration</option>
                <option value="Feedback">General SIH Feedback</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                required
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Explain what happened..."
              />
            </div>
            <button type="submit" className="btn-send-ticket">Submit Escalated Ticket</button>
          </form>
        )}
      </div>
    </div>
  );
}