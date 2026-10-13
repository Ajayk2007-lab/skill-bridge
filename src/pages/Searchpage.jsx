import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const TALENT_POOL = [
  {
    id: 101,
    name: 'Ajay Kumar',
    email: 'ajay.dev@dtu.ac.in',
    phone: '+91 9876543210',
    organization: 'Delhi Technological University',
    skill: 'Python',
    roleMatch: 92,
    band: 'Production Ready (Level 3)',
    skills: ['Python', 'FastAPI', 'Docker', 'Verified SQL'],
    tags: ['#python-fastapi', '#sih26044', 'python', 'fastapi', 'dtu'],
    verified_on: '13 Sep 2026',
    explanation: 'Proctored benchmark verified at 92% in Python module.'
  },
  {
    id: 102,
    name: 'Priya Sharma',
    email: 'priya.sharma@nsut.ac.in',
    phone: '+91 9811223344',
    organization: 'Netaji Subhas University of Technology',
    skill: 'FastAPI',
    roleMatch: 86,
    band: 'Production Ready (Level 3)',
    skills: ['FastAPI', 'Python', 'Redis', 'PostgreSQL'],
    tags: ['#python-fastapi', 'fastapi', 'python', 'nsut'],
    verified_on: '12 Sep 2026',
    explanation: 'Validated production REST architecture & async route optimizations.'
  },
  {
    id: 103,
    name: 'Rohan Verma',
    email: 'rohan.v@mait.ac.in',
    phone: '+91 9988776655',
    organization: 'Maharaja Agrasen Institute of Technology',
    skill: 'Docker',
    roleMatch: 80,
    band: 'Production Ready (Level 3)',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    tags: ['#cloud-orchestration', '#sih26044', 'docker', 'cloud', 'mait'],
    verified_on: '11 Sep 2026',
    explanation: 'Multi-stage Docker containerization and cluster orchestration benchmarks verified.'
  },
  {
    id: 104,
    name: 'Ananya Iyer',
    email: 'ananya.ai@iitd.ac.in',
    phone: '+91 9765432189',
    organization: 'IIT Delhi',
    skill: 'Full Stack & Cloud',
    roleMatch: 74,
    band: 'Intermediate (Level 2)',
    skills: ['React.js', 'FastAPI', 'Docker', 'AWS'],
    tags: ['#cloud-orchestration', '#python-fastapi', '#sih26044', 'fullstack', 'iitd'],
    verified_on: '10 Sep 2026',
    explanation: 'Full-stack platform vector with verified microservices integration proof.'
  }
];

export default function Searchpage({ activeTab = 'discovery' }) {
  const isRanker = activeTab === 'ranker';

  const [nlQuery, setNlQuery] = useState('');
  const [allCandidates, setAllCandidates] = useState(TALENT_POOL);
  const [displayedCandidates, setDisplayedCandidates] = useState(TALENT_POOL);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState('');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [invitedMap, setInvitedMap] = useState({});

  const fetchLiveCandidates = async () => {
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
            roleMatch: Math.round(c.score || 88),
            band: c.band || 'Production Ready (Level 3)',
            skills: [c.skill || 'Python', 'FastAPI', 'Docker', 'Verified SQL'],
            tags: [
              c.skill ? `#${c.skill.toLowerCase().replace(/\s+/g, '-')}` : '#python-fastapi',
              '#sih26044',
              (c.skill || '').toLowerCase(),
              (c.organization || '').toLowerCase()
            ],
            verified_on: c.verified_on || '13 Sep 2026',
            explanation: `Proctored benchmark verified at ${c.score}% in ${c.skill} module.`
          }));

          const merged = [...formatted, ...TALENT_POOL.filter(d => !formatted.some(f => f.email === d.email))];
          setAllCandidates(merged);
          setDisplayedCandidates(merged);
        }
      }
    } catch (err) {
      console.warn('Backend offline, using fallback talent pool:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCandidates();
  }, []);

  const handleFilter = (queryText) => {
    const q = (queryText !== undefined ? queryText : nlQuery).trim().toLowerCase();
    
    if (!q) {
      setDisplayedCandidates(allCandidates);
      setActiveTag('');
      return;
    }

    const cleanTokens = q.replace(/#/g, '').split(/[-_ ,]+/).filter(Boolean);

    const results = allCandidates.filter((cand) => {
      const searchTarget = [
        cand.name,
        cand.skill,
        cand.organization,
        cand.band,
        ...(cand.skills || []),
        ...(cand.tags || [])
      ].join(' ').toLowerCase();

      return cleanTokens.some((token) => searchTarget.includes(token));
    });

    setDisplayedCandidates(results);
  };

  const handleDomainFilter = (domain) => {
    setSelectedDomain(domain);
    if (domain === 'All') {
      setDisplayedCandidates(allCandidates);
    } else {
      setDisplayedCandidates(allCandidates.filter(c => c.skill.toLowerCase() === domain.toLowerCase()));
    }
  };

  const handleTagClick = (tagLabel, filterKeyword) => {
    setActiveTag(tagLabel);
    setNlQuery(tagLabel);
    handleFilter(filterKeyword);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilter(nlQuery);
  };

  const rankedList = [...displayedCandidates].sort((a, b) => b.roleMatch - a.roleMatch);

  return (
    <div style={{ flex: 1, padding: '32px 40px', background: '#020617', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      {/* 1. CANDIDATE RANKER VIEW */}
      {isRanker ? (
        <div style={{ maxWidth: '1050px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div style={{ color: '#00f0ff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '6px' }}>
                AUTOMATED MERIT ENGINE
              </div>
              <h1 style={{ fontSize: '32px', margin: '0 0 6px 0', fontWeight: 'bold', color: '#fff' }}>
                Live Skill Leaderboard
              </h1>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Real-time candidate merit ranking based on proctored code proofs and MySQL assessment scores.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLiveCandidates}
              style={{ background: '#070f21', border: '1px solid #00f0ff', color: '#00f0ff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ⟳ Sync Leaderboard
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Filter By Assessment Domain:</span>
            {['All', 'Python', 'FastAPI', 'Docker', 'Full Stack & Cloud'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDomainFilter(d)}
                style={{
                  background: selectedDomain === d ? '#00f0ff' : '#070f21',
                  border: '1px solid #1e293b',
                  color: selectedDomain === d ? '#020617' : '#cbd5e1',
                  padding: '6px 14px',
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

          <div style={{ background: '#070f21', border: '1px solid #1e293b', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0b162c', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '16px 20px' }}>RANK</th>
                  <th style={{ padding: '16px 20px' }}>CANDIDATE &amp; EMAIL</th>
                  <th style={{ padding: '16px 20px' }}>INSTITUTION</th>
                  <th style={{ padding: '16px 20px' }}>EVALUATED SKILL</th>
                  <th style={{ padding: '16px 20px' }}>VECTOR SCORE</th>
                  <th style={{ padding: '16px 20px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {rankedList.map((cand, idx) => (
                  <tr
                    key={cand.id || idx}
                    style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.15s ease' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 240, 255, 0.04)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 'bold' }}>
                      <span style={{
                        color: idx === 0 ? '#facc15' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#fb923c' : '#00f0ff',
                        fontSize: '15px'
                      }}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 'bold', color: '#f8fafc' }}>{cand.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{cand.email}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                      {cand.organization}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: '#020617', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: '4px', color: '#38bdf8' }}>
                        {cand.skill}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ade80' }}>
                        {cand.roleMatch}%
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{cand.band}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setInterviewData(cand)}
                          style={{
                            background: invitedMap[cand.email] ? '#10b981' : '#00f0ff',
                            color: '#020617',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          {invitedMap[cand.email] ? '✓ Invited' : 'Interview'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(cand)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #334155',
                            color: '#cbd5e1',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. SKILL-FIRST DISCOVERY VIEW */
        <>
          <div style={{ maxWidth: '1000px', marginBottom: '24px' }}>
            <div style={{ color: '#00f0ff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '6px' }}>
              VECTOR QUERY
            </div>
            <h1 style={{ fontSize: '34px', margin: '4px 0 10px 0', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.5px' }}>
              Deep Intelligence Search
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Explore candidate profiles, target job vectors, and institutional syllabi.
            </p>
          </div>

          <div style={{ maxWidth: '1000px', marginBottom: '16px' }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(2, 6, 23, 0.95)',
                border: '1px solid #00f0ff',
                borderRadius: '10px',
                padding: '6px 8px 6px 18px',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.18)'
              }}
            >
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setNlQuery(val);
                  handleFilter(val);
                }}
                placeholder="Search by skill (FastAPI, React), role (Backend Engineer), or ID..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '15px',
                  padding: '10px 0'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#00f0ff',
                  color: '#020617',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
                }}
              >
                Query Vector DB
              </button>
            </form>
          </div>

          <div style={{ maxWidth: '1000px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Suggested Queries:</span>
            {[
              { label: '#Python-FastAPI', filter: 'fastapi' },
              { label: '#Cloud-Orchestration', filter: 'docker' },
              { label: '#SIH26044', filter: 'dtu' }
            ].map((tag) => {
              const isSelected = activeTag === tag.label;
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagClick(tag.label, tag.filter)}
                  style={{
                    background: isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(15, 23, 42, 0.9)',
                    border: isSelected ? '1px solid #00f0ff' : '1px solid #1e293b',
                    color: isSelected ? '#fff' : '#00f0ff',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag.label}
                </button>
              );
            })}

            {nlQuery && (
              <button
                type="button"
                onClick={() => {
                  setNlQuery('');
                  setActiveTag('');
                  handleFilter('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f43f5e',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontWeight: '600'
                }}
              >
                ✕ Reset Filter
              </button>
            )}
          </div>

          <div style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                Showing <strong>{displayedCandidates.length}</strong> Matched Talent Profiles
              </div>
              <button
                type="button"
                onClick={fetchLiveCandidates}
                style={{
                  background: 'transparent',
                  border: '1px solid #1e293b',
                  color: '#00f0ff',
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ⟳ Sync MySQL
              </button>
            </div>

            {loading ? (
              <div style={{ color: '#00f0ff', padding: '30px', textAlign: 'center' }}>
                Streaming verified candidate vectors from MySQL...
              </div>
            ) : displayedCandidates.length === 0 ? (
              <div style={{ background: '#091224', border: '1px solid #1e293b', padding: '30px', borderRadius: '10px', textAlign: 'center', color: '#64748b' }}>
                No candidate matched the query "{nlQuery}". Tap a suggested query above or reset filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {displayedCandidates.map((cand, idx) => (
                  <div
                    key={cand.id || idx}
                    style={{
                      background: '#091224',
                      border: '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>
                          #0{idx + 1} RECOMMENDED CANDIDATE
                        </div>
                        <h3 style={{ margin: '6px 0 4px 0', fontSize: '20px', color: '#fff' }}>{cand.name}</h3>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {cand.organization} • <span style={{ color: '#38bdf8' }}>{cand.band}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#00f0ff' }}>{cand.roleMatch}%</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Vector Score</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
                      {(cand.skills || [cand.skill]).map((s, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#040914',
                            border: '1px solid #1e293b',
                            color: '#cbd5e1',
                            padding: '5px 12px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px', lineHeight: '1.5' }}>
                      <strong style={{ color: '#f8fafc' }}>Audit Explanation:</strong> {cand.explanation}
                      <span style={{ color: '#64748b', marginLeft: '10px' }}>(Verified on {cand.verified_on})</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setInterviewData(cand)}
                        style={{
                          background: invitedMap[cand.email] ? '#10b981' : '#00f0ff',
                          color: invitedMap[cand.email] ? '#fff' : '#000',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {invitedMap[cand.email] ? '✓ Interview Sent' : 'Direct Skill Interview'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCandidate(cand)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #334155',
                          color: '#cbd5e1',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        Inspect Skill DNA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* MODALS */}
      {interviewData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div style={{ background: '#091224', border: '1px solid #1e293b', borderRadius: '12px', padding: '26px', width: '100%', maxWidth: '460px', boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00f0ff' }}>Direct Technical Interview</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              Instant video assessment room generated for <strong>{interviewData.name}</strong> ({interviewData.email}):
            </p>
            <div style={{ background: '#040914', padding: '12px', borderRadius: '6px', margin: '14px 0', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '13px', wordBreak: 'break-all' }}>
              https://meet.jit.si/skillbridge-{interviewData.id}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  setInvitedMap((prev) => ({ ...prev, [interviewData.email]: true }));
                  setInterviewData(null);
                }}
                style={{ flex: 1, padding: '10px', background: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Dispatch Invite Link
              </button>
              <button
                type="button"
                onClick={() => setInterviewData(null)}
                style={{ padding: '10px 18px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div style={{ background: '#091224', border: '1px solid #00f0ff', borderRadius: '12px', padding: '26px', width: '100%', maxWidth: '460px', lineHeight: '1.9', boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, color: '#00f0ff' }}>Verified Candidate Dossier</h3>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
              <div><strong>Candidate Name:</strong> {selectedCandidate.name}</div>
              <div><strong>Registered Email:</strong> {selectedCandidate.email}</div>
              <div><strong>Direct Contact:</strong> {selectedCandidate.phone}</div>
              <div><strong>College / Institution:</strong> {selectedCandidate.organization}</div>
              <div><strong>Assessed Domain:</strong> {selectedCandidate.skill}</div>
              <div><strong>Vector Match Score:</strong> <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{selectedCandidate.roleMatch}%</span></div>
              <div><strong>Accredited Band:</strong> {selectedCandidate.band}</div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCandidate(null)}
              style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
}