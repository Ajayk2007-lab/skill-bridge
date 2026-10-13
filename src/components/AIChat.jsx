import React, { useState, useRef, useEffect } from 'react';
import './AIChat.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function AIChat({ activePage, userRole = 'student', setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am SkillBridge Intelligence Assistant. Select any quick prompt below or ask me anything about proctored assessments, Skill DNA, or career opportunities.',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Role-based quick general questions
  const quickQuestions = {
    student: [
      "Skill DNA kaise kaam karta hai?",
      "Assessment me 3-strikes rule kya hai?",
      "Skill Gap Analysis kaise calculate hota hai?",
      "Placement recommendations kaise match hoti hain?"
    ],
    institution: [
      "Cohort readiness index kya hai?",
      "Curriculum alignment report kaise dekhein?",
      "Student competency verification flow kya hai?"
    ],
    company: [
      "Candidate readiness score kaise rank hota hai?",
      "Job requirements se DNA vector kaise match hota hai?",
      "Proctored verified badging kya hoti hai?"
    ]
  };

  const activePrompts = quickQuestions[userRole] || quickQuestions.student;

  // Local knowledge base fallback (in case backend is offline)
  const answerDatabase = [
    {
      keywords: ['skill dna', 'dna', 'spider graph'],
      answer: "Skill DNA ek dynamic multi-dimensional radar profile hai jo aapke verified technical skills, project proof aur proctored diagnostic scores se continuous generate hota hai. Jaise-jaise aap assessment aur projects complete karte hain, aapka DNA realtime update hota hai."
    },
    {
      keywords: ['strike', 'warning', 'disqualif', 'cheating', 'rule'],
      answer: "SkillBridge me biometric anti-cheat protocol active rehta hai: 1) Camera lens covered hone par, 2) Face screen se hatne par, 3) Eyes/gaze screen se deviate hone ya tab-switch karne par strikes lagte hain. Maximum 3 strikes milte hi session usi question par force-terminate ho jata hai."
    },
    {
      keywords: ['gap', 'analysis', 'deficiency'],
      answer: "Skill Gap Analysis aapke current verified skills ko industry entry-level benchmarks se compare karta hai. Yeh gaps ko 3 categories me divide karta hai: Critical, High, aur Medium Priority, aur unhe overcome karne ke liye targeted roadmap deta hai."
    },
    {
      keywords: ['match', 'placement', 'job', 'internship', 'opportunity'],
      answer: "Smart Matching keyword matching ki jagah vector cosine similarity use karta hai. Yeh aapke Skill DNA aur job role ke required technical taxonomy ke beech 0-100% readiness score nikalta hai."
    },
    {
      keywords: ['cohort', 'curriculum', 'institution'],
      answer: "Institutional Suite college aur universities ko student cohorts ki live technical readiness deta hai taaki professors dekh sakein ki unke syllabus aur industry demand ke beech kahan gap aa raha hai."
    },
    {
      keywords: ['candidate', 'rank', 'recruiter', 'hire'],
      answer: "Recruiters candidate ke static resume ki jagah proctored assessment score, project verification aur live skill vectors ke basis par top performers ko 1-click me rank aur filter kar sakte hain."
    },
    {
      keywords: ['level', 'beginner', 'intermediate', 'expert'],
      answer: "Platform par 3 difficulty tiers hain: Beginner (Cyan), Intermediate (Gold), aur Expert (Crimson). Yeh aapke GitHub activity, LinkedIn profile, aur resume experience se auto-calibrate hote hain."
    }
  ];

  const getLocalFallbackReply = (query) => {
    const clean = query.toLowerCase();
    for (const entry of answerDatabase) {
      if (entry.keywords.some((kw) => clean.includes(kw))) {
        return entry.answer;
      }
    }
    return "Query processed. For real-time intelligence, ensure backend server (FastAPI) and GEMINI_API_KEY are configured.";
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: currentTime
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    let finalReply = '';

    try {
      // Direct live research call to backend Gemini grounder
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_role: userRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          finalReply = data.reply;
        }
      }
    } catch (err) {
      console.warn('Backend live AI call unreachable, fallback invoked:', err);
    }

    // Fallback if backend returned empty or network dropped
    if (!finalReply) {
      finalReply = getLocalFallbackReply(text);
    }

    const aiMsg = {
      sender: 'ai',
      text: finalReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="sb-aichat-wrapper">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button className="aichat-launch-bubble" onClick={() => setIsOpen(true)}>
          <span className="launch-pulse-ring"></span>
          <span className="launch-icon">✦</span>
          <span className="launch-text">AI Assistant</span>
        </button>
      )}

      {/* Main Chat Drawer */}
      {isOpen && (
        <div className="aichat-panel">
          {/* Header */}
          <div className="aichat-header">
            <div className="ai-info-meta">
              <span className="ai-status-pip"></span>
              <div>
                <strong className="ai-name">SkillBridge AI</strong>
                <span className="ai-role-tag">Neural Query Engine</span>
              </div>
            </div>
            <button className="aichat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Quick Questions Strip */}
          <div className="quick-questions-strip">
            <span className="qq-title">POPULAR QUESTIONS:</span>
            <div className="qq-pills-row">
              {activePrompts.map((question, i) => (
                <button
                  key={i}
                  className="qq-pill"
                  onClick={() => handleSendMessage(question)}
                  disabled={isTyping}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Body */}
          <div className="aichat-messages-box">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble-row ${msg.sender === 'user' ? 'user-align' : 'ai-align'}`}>
                {msg.sender === 'ai' && <div className="ai-avatar-badge">SB</div>}
                <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  <p className="bubble-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  <span className="bubble-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row ai-align">
                <div className="ai-avatar-badge">SB</div>
                <div className="chat-bubble bubble-ai typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Controls */}
          <div className="aichat-input-bar">
            <input
              type="text"
              placeholder="Ask anything (technical, general facts, coding)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button 
              className="aichat-send-btn" 
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
            >
              Send →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}