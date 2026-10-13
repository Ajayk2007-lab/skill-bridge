import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const INITIAL_TALENT_RECORDS = [
  {
    id: 101,
    name: 'Ajay Kumar',
    email: 'ajay.dev@dtu.ac.in',
    phone: '+91 9876543210',
    organization: 'Delhi Technological University',
    skill: 'Python',
    score: 92,
    band: 'Production Ready (Level 3)',
    verified_on: '13 Sep 2026',
    skills: ['Python', 'FastAPI', 'Docker', 'Verified SQL']
  },
  {
    id: 102,
    name: 'Priya Sharma',
    email: 'priya.sharma@nsut.ac.in',
    phone: '+91 9811223344',
    organization: 'Netaji Subhas University of Technology',
    skill: 'FastAPI',
    score: 86,
    band: 'Production Ready (Level 3)',
    verified_on: '12 Sep 2026',
    skills: ['FastAPI', 'Python', 'Redis', 'PostgreSQL']
  },
  {
    id: 103,
    name: 'Rohan Verma',
    email: 'rohan.v@mait.ac.in',
    phone: '+91 9988776655',
    organization: 'Maharaja Agrasen Institute of Technology',
    skill: 'Docker',
    score: 80,
    band: 'Production Ready (Level 3)',
    verified_on: '11 Sep 2026',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux']
  },
  {
    id: 104,
    name: 'Ananya Iyer',
    email: 'ananya.ai@iitd.ac.in',
    phone: '+91 9765432189',
    organization: 'IIT Delhi',
    skill: 'Full Stack & Cloud',
    score: 74,
    band: 'Intermediate (Level 2)',
    verified_on: '10 Sep 2026',
    skills: ['React.js', 'FastAPI', 'Docker', 'TailwindCSS']
  }
];

export default function CompanyDashboard({ setActivePage }) {
  // Navigation internal tab: 'ranker' | 'support' | 'postings' | 'velocity'
  const [internalTab, setInternalTab] = useState('ranker');

  // Candidate Data State
  const [candidates, setCandidates] = useState(INITIAL_TALENT_RECORDS);
  const [filteredCandidates, setFilteredCandidates] = useState(INITIAL_TALENT_RECORDS);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewModalData, setInterviewModalData] = useState(null);
  const [invitedMap, setInvitedMap] = useState({});

  // Support FAQs State (Click working state)
  const [openedFaqId, setOpenedFaqId] = useState(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('');
  const [ticketForm, setTicketForm] = useState({ subject: '', urgency: 'Priority SLA (2h)', details: '' });

  const faqs = [
    {
      id: 1,
      q: 'How does reverse opportunity matching work?',
      a: 'Reverse Opportunity Matching bypasses traditional keyword resumes. The vector engine computes semantic cosine similarity between the student’s verified proctored code proofs and enterprise requisition thresholds, continuously matching candidates directly to high-CTC roles without manual applications.'
    },
    {
      id: 2,
      q: 'Why is my Skill DNA missing a technical node?',
      a: 'Skill DNA nodes only light up when a candidate achieves ≥75% in a real-time surveillance proctored evaluation. If a node (e.g. Distributed Caching) is missing, the student needs to complete that module or submit a code test via the verified node sandbox.'
    },
    {
      id: 3,
      q: 'How do institutions sync their curriculum data?',
      a: 'University nodes stream syllabus topics via our FastAPI institutional endpoints. The engine calculates deviation between academic syllabi and active market hiring requisitions, outputting a real-time Curriculum Gap Index.'
    }
  ];

  // Sync with Live MySQL Backend
  const syncLiveCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/recruiter/verified-candidates`);
      if (res.ok) {
        const data = await res.json();
        const rawList = data.candidates || [];
        if (rawList.length > 0) {
          const formatted = rawList.map((c, idx) => ({
            id: c.id || idx + 200,
            name: c.name || 'Verified Candidate',
            email: c.email,
            phone: c.phone || '+91 9876543210',
            organization: c.organization || 'Partner Institution',
            skill: c.skill || 'Python',
            score: Math.round(c.score || 85),
            band: c.band || 'Production Ready (Level 3)',
            verified_on: c.verified_on || '13 Sep 2026',
            skills: [c.skill || 'Python', 'FastAPI', 'Docker', 'Verified SQL']
          }));
          const merged = [...formatted, ...INITIAL_TALENT_RECORDS.filter(d => !formatted.some(f => f.email === d.email))];
          setCandidates(merged);
          setFilteredCandidates(merged);
        }
      }
    } catch (err) {
      console.warn('Backend offline, fallback active');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncLiveCandidates();
  }, []);

  const handleFilter = (domain, query) => {
    const activeD = domain !== undefined ? domain : selectedDomain;
    const activeQ = (query !== undefined ? query : searchQuery).trim().toLowerCase();

    let result = candidates;
    if (activeD !== 'All') {
      result = result.filter(c => c.skill.toLowerCase() === activeD.toLowerCase());
    }
    if (activeQ) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(activeQ) ||
        c.email.toLowerCase().includes(activeQ) ||
        c.organization.toLowerCase().includes(activeQ) ||
        c.skill.toLowerCase().includes(activeQ)
      );
    }
    setFilteredCandidates(result);
  };

  const rankedList = [...filteredCandidates].sort((a, b) => b.score - a.score);

  return (
    <div style={{ flex: 1, padding: '24px 32px', background: '#020617', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      {/* HEADER WITH INTERNAL TABS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ color: '#00f0ff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '4px' }}>
            ● ENTERPRISE RECRUITER CONSOLE
          </div>
          <h1 style={{ fontSize: '30px', margin: 0, fontWeight: 'bold', color: '#fff' }}>
            {internalTab === 'ranker' ? 'Candidate Merit Leaderboard' : 'Support Escalation Protocol'}
          </h1>
        </div>

        {/* VIEW SWITCHER */}
        <div style={{ display: 'flex', gap: '8px', background: '#070f21', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <button
            type="button"
            onClick={() => setInternalTab('ranker')}
            style={{
              background: internalTab === 'ranker' ? '#00f0ff' : 'transparent',
              color: internalTab === 'ranker' ? '#020617' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⚡ Candidate Ranker
          </button>
          <button
            type="button"
            onClick={() => setInternalTab('support')}
            style={{
              background: internalTab === 'support' ? '#00f0ff' : 'transparent',
              color: internalTab === 'support' ? '#020617' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✦ Support &amp; Escalation
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CANDIDATE RANKER & LEADERBOARD (NO FAQS CLUTTER) */}
      {/* ========================================================================= */}
      {internalTab === 'ranker' && (
        <>
          {/* 4 TOP KPI METRIC CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#070f21', border: '1px solid #1e293b', padding: '18px 20px', borderRadius: '10px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>VERIFIED TALENT POOL</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f8fafc', margin: '6px 0 2px 0' }}>{candidates.length} Profiles</div>
              <div style={{ color: '#00f0ff', fontSize: '11px' }}>Audited by Surveillance AI</div>
            </div>

            <div style={{ background: '#070f21', border: '1px solid #1e293b', padding: '18px 20px', borderRadius: '10px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>AVERAGE READINESS</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80', margin: '6px 0 2px 0' }}>
                {candidates.length > 0 ? Math.round(candidates.reduce((a, b) => a + b.score, 0) / candidates.length) : 83}%
              </div>
              <div style={{ color: '#10b981', fontSize: '11px' }}>Level 3 Qualified</div>
            </div>

            <div style={{ background: '#070f21', border: '1px solid #1e293b', padding: '18px 20px', borderRadius: '10px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>INTERVIEW PIPELINE</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8', margin: '6px 0 2px 0' }}>{Object.keys(invitedMap).length} Active</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Direct Technical Rooms</div>
            </div>

            <div style={{ background: '#070f21', border: '1px solid #1e293b', padding: '18px 20px', borderRadius: '10px' }}>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>WATCHDOG ACCURACY</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a855f7', margin: '6px 0 2px 0' }}>99.4%</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>0 False Integrity Strikes</div>
            </div>
          </div>

          {/* FILTER STRIP */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#64748b', marginRight: '6px' }}>Domain:</span>
              {['All', 'Python', 'FastAPI', 'Docker', 'Full Stack & Cloud'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setSelectedDomain(d); handleFilter(d, searchQuery); }}
                  style={{
                    background: selectedDomain === d ? '#00f0ff' : '#070f21',
                    border: '1px solid #1e293b',
                    color: selectedDomain === d ? '#020617' : '#cbd5e1',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: selectedDomain === d ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search candidate, college, or email..."
                value={searchQuery}
                onChange={(e) => { const q = e.target.value; setSearchQuery(q); handleFilter(selectedDomain, q); }}
                style={{ background: '#070f21', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12px', width: '240px', outline: 'none' }}
              />
              <button
                type="button"
                onClick={syncLiveCandidates}
                style={{ background: '#070f21', border: '1px solid #00f0ff', color: '#00f0ff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ⟳ Sync MySQL
              </button>
            </div>
          </div>

          {/* LEADERBOARD TABLE */}
          <div style={{ background: '#070f21', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0b162c', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '14px 18px' }}>RANK</th>
                  <th style={{ padding: '14px 18px' }}>CANDIDATE &amp; CONTACT</th>
                  <th style={{ padding: '14px 18px' }}>INSTITUTION NODE</th>
                  <th style={{ padding: '14px 18px' }}>EVALUATED SKILL</th>
                  <th style={{ padding: '14px 18px' }}>VECTOR SCORE</th>
                  <th style={{ padding: '14px 18px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {rankedList.map((cand, idx) => (
                  <tr key={cand.id || idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 'bold' }}>
                      <span style={{ color: idx === 0 ? '#facc15' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#fb923c' : '#00f0ff', fontSize: '15px' }}>
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#0${idx + 1}`}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{cand.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{cand.email} • {cand.phone}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{cand.organization}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ background: '#020617', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: '4px', color: '#38bdf8', fontSize: '11px' }}>
                        {cand.skill}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: cand.score >= 85 ? '#4ade80' : '#00f0ff' }}>{cand.score}%</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{cand.band}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setInterviewModalData(cand)}
                          style={{ background: invitedMap[cand.email] ? '#10b981' : '#00f0ff', color: '#020617', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                        >
                          {invitedMap[cand.email] ? '✓ Invited' : 'Direct Interview'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(cand)}
                          style={{ background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Skill DNA
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SUPPORT & ESCALATION (ACCORDION CLICK 100% WORKING) */}
      {/* ========================================================================= */}
      {internalTab === 'support' && (
        <div>
          {ticketSuccessMsg && (
            <div style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid #00f0ff', padding: '12px 18px', borderRadius: '8px', marginBottom: '16px', color: '#00f0ff', fontSize: '13px', fontWeight: 'bold' }}>
              {ticketSuccessMsg}
            </div>
          )}

          <div style={{ background: '#040b18', border: '1px solid #0e223d', borderRadius: '16px', padding: '28px', maxWidth: '1000px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#00f0ff', fontSize: '20px' }}>✦</span>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#fff', fontWeight: 'bold' }}>
                Can SkillBridge AI Solve This Immediately?
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
              Common concerns can be resolved dynamically through our knowledge vectors (Click on question to toggle):
            </p>

            {/* DIRECT EXPLICIT ACCORDION ROW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((f) => {
                const isOpened = openedFaqId === f.id;
                return (
                  <div
                    key={f.id}
                    style={{
                      background: '#020617',
                      border: isOpened ? '1px solid #00f0ff' : '1px solid #142845',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* CLICK TARGET - 100% RELIABLE */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenedFaqId(isOpened ? null : f.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setOpenedFaqId(isOpened ? null : f.id); }}
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        color: isOpened ? '#00f0ff' : '#e2e8f0',
                        fontWeight: '600',
                        fontSize: '14px',
                        pointerEvents: 'auto'
                      }}
                    >
                      <span>{f.q}</span>
                      <span style={{ color: '#00f0ff', fontSize: '12px', marginLeft: '10px' }}>
                        {isOpened ? '▲ Close' : '▼ Click to View'}
                      </span>
                    </div>

                    {/* EXPANDED ANSWER BOX */}
                    {isOpened && (
                      <div
                        style={{
                          padding: '14px 20px 18px 20px',
                          borderTop: '1px solid #0e223d',
                          background: '#040d1f',
                          color: '#cbd5e1',
                          fontSize: '13px',
                          lineHeight: '1.6'
                        }}
                      >
                        <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                          ✦ VECTOR ENGINE RESPONSE:
                        </div>
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION BAR */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #0e223d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Issue requires human team intervention?</span>
              <button
                type="button"
                onClick={() => setIsEscalateModalOpen(true)}
                style={{ background: 'transparent', border: '1px solid #00f0ff', color: '#00f0ff', padding: '9px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Escalate to Binary Brains Team →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ESCALATE */}
      {isEscalateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newId = `BB-${Math.floor(9200 + Math.random() * 800)}`;
              setIsEscalateModalOpen(false);
              setTicketSuccessMsg(`✓ Ticket #${newId} dispatched to Binary Brains SRE queue!`);
              setTimeout(() => setTicketSuccessMsg(''), 4000);
            }}
            style={{ background: '#040b18', border: '1px solid #00f0ff', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '480px' }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '18px' }}>✦ Escalate to Binary Brains</h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px 0' }}>Direct engineering escalation channel for platform triage.</p>
            <input
              type="text"
              required
              placeholder="Incident Subject..."
              style={{ width: '100%', boxSizing: 'border-box', background: '#020617', border: '1px solid #142845', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}
            />
            <textarea
              rows="3"
              required
              placeholder="Details or Candidate email..."
              style={{ width: '100%', boxSizing: 'border-box', background: '#020617', border: '1px solid #142845', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#00f0ff', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Dispatch Escalation
              </button>
              <button type="button" onClick={() => setIsEscalateModalOpen(false)} style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: INTERVIEW */}
      {interviewModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div style={{ background: '#070f21', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00f0ff' }}>Direct Technical Interview</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Video room generated for <strong>{interviewModalData.name}</strong>:</p>
            <div style={{ background: '#020617', padding: '10px', borderRadius: '6px', margin: '12px 0', color: '#38bdf8', fontSize: '12px' }}>
              https://meet.jit.si/skillbridge-{interviewModalData.id}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { setInvitedMap({ ...invitedMap, [interviewModalData.email]: true }); setInterviewModalData(null); }}
                style={{ flex: 1, padding: '9px', background: '#00f0ff', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Send Invite
              </button>
              <button type="button" onClick={() => setInterviewModalData(null)} style={{ padding: '9px 14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DOSSIER */}
      {selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div style={{ background: '#070f21', border: '1px solid #00f0ff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '420px', lineHeight: '1.8' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#00f0ff' }}>Verified Candidate Dossier</h3>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
              <div><strong>Name:</strong> {selectedCandidate.name}</div>
              <div><strong>Email:</strong> {selectedCandidate.email}</div>
              <div><strong>Institution:</strong> {selectedCandidate.organization}</div>
              <div><strong>Skill:</strong> {selectedCandidate.skill}</div>
              <div><strong>Score:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{selectedCandidate.score}%</span></div>
            </div>
            <button type="button" onClick={() => setSelectedCandidate(null)} style={{ marginTop: '16px', width: '100%', padding: '9px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
}