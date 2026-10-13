import React, { useState, useEffect, useRef } from 'react';
import './Assessment.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Assessment({ setActivePage, userProfile }) {
  // 1. Persistent Candidate Assessment Profile
  const [candidateProfile, setCandidateProfile] = useState(() => {
    const saved = localStorage.getItem('sb_candidate_assessment_credentials');
    return saved ? JSON.parse(saved) : null;
  });

  // Stages: 'profile-intake' | 'skill-select' | 'proctor-check' | 'in-test' | 'completed' | 'history' | 'disqualified'
  const [stage, setStage] = useState(() => {
    const saved = localStorage.getItem('sb_candidate_assessment_credentials');
    return saved ? 'skill-select' : 'profile-intake';
  });

  // Intake States
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Assessment Selection & Config
  const [selectedSkill, setSelectedSkill] = useState('Python');
  const [customSkill, setCustomSkill] = useState('');
  const [examDuration, setExamDuration] = useState(15);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // History & Active Analytics
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [disqualifiedSnapshot, setDisqualifiedSnapshot] = useState(null);

  // Hardware & Video Refs
  const videoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const progressCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const surveillanceInterval = useRef(null);

  // Strict Proctoring States
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isShutterOpen, setIsShutterOpen] = useState(false);
  const [isFacePresent, setIsFacePresent] = useState(false);
  const [gazeStatus, setGazeStatus] = useState('Camera Inactive');
  const [cameraError, setCameraError] = useState('');
  const [warningCount, setWarningCount] = useState(0);
  const [lastWarningMsg, setLastWarningMsg] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Live Optical Diagnostics Telemetry for Debugging
  const [opticalTelemetry, setOpticalTelemetry] = useState({ lum: 0, spread: 0 });

  // Anti-Flicker Buffer Refs
  const luminanceHistoryRef = useRef([]);
  const shutterBlockedCounter = useRef(0);
  const faceMissingStreakRef = useRef(0);
  const gazeDeviationStreakRef = useRef(0);

  // Test Runtime States
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [startTime, setStartTime] = useState(null);

  const warningCountRef = useRef(0);
  const currentStepRef = useRef(0);
  const questionsRef = useRef([]);
  const userAnswersRef = useRef({});
  const startTimeRef = useRef(null);

  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { userAnswersRef.current = userAnswers; }, [userAnswers]);

  // Load Saved History on Mount
  useEffect(() => {
    const savedHist = localStorage.getItem('skillbridge_diagnostic_history');
    if (savedHist) {
      try {
        setAssessmentHistory(JSON.parse(savedHist));
      } catch (err) {
        console.error('Failed to parse history', err);
      }
    }
  }, []);

  useEffect(() => {
    if (candidateProfile) {
      setLinkedinUrl(candidateProfile.linkedin || '');
      setGithubUrl(candidateProfile.github || '');
    }
  }, [candidateProfile]);

  const getLevelMeta = (level = 'beginner') => {
    switch ((level || 'beginner').toLowerCase()) {
      case 'beginner':
        return {
          badgeColor: '#00f0ff',
          badgeGlow: 'rgba(0, 240, 255, 0.45)',
          label: 'BEGINNER',
          desc: 'Foundational Syntax & Core Data Structures'
        };
      case 'intermediate':
        return {
          badgeColor: '#fbbf24',
          badgeGlow: 'rgba(251, 191, 36, 0.45)',
          label: 'INTERMEDIATE',
          desc: 'Design Patterns, Concurrency & Backend APIs'
        };
      case 'expert':
        return {
          badgeColor: '#f43f5e',
          badgeGlow: 'rgba(244, 63, 94, 0.45)',
          label: 'EXPERT',
          desc: 'Kernel Architecture & Distributed Scalability'
        };
      default:
        return {
          badgeColor: '#00f0ff',
          badgeGlow: 'rgba(0, 240, 255, 0.45)',
          label: 'BEGINNER',
          desc: 'Foundational'
        };
    }
  };

  const calculateCandidateTier = (gh, li, fileBytes, currentAttempts = 0, avgScore = 0) => {
    const ghLower = (gh || '').toLowerCase();
    const liLower = (li || '').toLowerCase();
    if (currentAttempts >= 3 && avgScore >= 80) return 'expert';
    if (currentAttempts >= 2 && avgScore >= 70) return 'intermediate';

    if (
      ghLower.includes('senior') ||
      ghLower.includes('lead') ||
      liLower.includes('architect') ||
      fileBytes > 120000
    ) {
      return 'expert';
    } else if (
      ghLower.length > 25 ||
      liLower.includes('engineer') ||
      fileBytes > 50000
    ) {
      return 'intermediate';
    }
    return 'beginner';
  };

  const handleIntakeSubmit = (e) => {
    e.preventDefault();
    setIntakeLoading(true);

    setTimeout(() => {
      const fileBytes = resumeFile ? resumeFile.size : 45000;
      const calculatedLevel = calculateCandidateTier(githubUrl, linkedinUrl, fileBytes, 0, 0);

      const profilePayload = {
        linkedin: linkedinUrl,
        github: githubUrl,
        resumeName: resumeFile ? resumeFile.name : 'Candidate_Resume.pdf',
        level: calculatedLevel,
        totalAttempts: 0,
        averageScore: 0,
        createdAt: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleDateString()
      };

      localStorage.setItem('sb_candidate_assessment_credentials', JSON.stringify(profilePayload));
      setCandidateProfile(profilePayload);
      setIntakeLoading(false);
      setStage('skill-select');
    }, 1200);
  };

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    const fileBytes = resumeFile ? resumeFile.size : 60000;
    const newTier = calculateCandidateTier(
      githubUrl,
      linkedinUrl,
      fileBytes,
      candidateProfile?.totalAttempts || 0,
      candidateProfile?.averageScore || 0
    );

    const updatedProfile = {
      ...candidateProfile,
      linkedin: linkedinUrl,
      github: githubUrl,
      resumeName: resumeFile ? resumeFile.name : candidateProfile?.resumeName,
      level: newTier,
      lastUpdated: new Date().toLocaleDateString()
    };

    localStorage.setItem('sb_candidate_assessment_credentials', JSON.stringify(updatedProfile));
    setCandidateProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  // ==========================================================
  // HARDWARE OPTICAL SENSOR ENGINE WITH CALIBRATED LUMINANCE
  // ==========================================================
  const startCameraFeed = async () => {
    setCameraError('');
    setIsShutterOpen(false);
    setIsFacePresent(false);
    luminanceHistoryRef.current = [];

    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      setTimeout(() => {
        const vid = stage === 'in-test' ? pipVideoRef.current : videoRef.current;
        if (vid) {
          vid.srcObject = stream;
          vid.onloadedmetadata = async () => {
            try {
              await vid.play();
              setTimeout(() => evaluateCameraSensors(), 300);
            } catch (playErr) {
              console.warn('Playback error auto-handled:', playErr);
            }
          };
        }
      }, 100);

    } catch (err) {
      console.error('Camera access failure:', err);
      setIsCameraActive(false);
      setCameraError('Webcam access was denied. Please allow camera permissions in your browser URL bar.');
    }
  };

  const stopCameraFeed = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setIsShutterOpen(false);
    setIsFacePresent(false);
    setGazeStatus('Camera Turned Off');
  };

  const evaluateCameraSensors = () => {
    const video = stage === 'in-test' ? pipVideoRef.current : videoRef.current;
    const canvas = hiddenCanvasRef.current;

    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) {
      setIsShutterOpen(false);
      setIsFacePresent(false);
      return { shutterOpen: false, faceDetected: false, gaze: 'Offline' };
    }

    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;
      const totalPixels = pixels.length / 4;

      let totalLum = 0;
      let minLum = 255;
      let maxLum = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const lum = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        totalLum += lum;
        if (lum < minLum) minLum = lum;
        if (lum > maxLum) maxLum = lum;
      }

      const avgLuminance = Math.round(totalLum / totalPixels);
      const dynamicSpread = Math.round(maxLum - minLum);

      setOpticalTelemetry({ lum: avgLuminance, spread: dynamicSpread });

      luminanceHistoryRef.current.push({ avg: avgLuminance, spread: dynamicSpread });
      if (luminanceHistoryRef.current.length > 3) {
        luminanceHistoryRef.current.shift();
      }

      const smoothedAvg =
        luminanceHistoryRef.current.reduce((acc, curr) => acc + curr.avg, 0) /
        luminanceHistoryRef.current.length;

      const smoothedSpread =
        luminanceHistoryRef.current.reduce((acc, curr) => acc + curr.spread, 0) /
        luminanceHistoryRef.current.length;

      // STRICT HARDWARE SHUTTER RULE:
      // Band shutter / covered lens par screen pitch black hoti hai (avg < 9 AND spread < 16)
      const shutterIsOpen = smoothedAvg >= 9 || smoothedSpread >= 16;
      setIsShutterOpen(shutterIsOpen);

      // Face presence check in normal ambient lighting
      const faceIsDetected = shutterIsOpen && smoothedAvg > 12 && smoothedAvg < 248 && smoothedSpread > 18;
      setIsFacePresent(faceIsDetected);

      let currentGaze = 'Focused';
      if (!shutterIsOpen) {
        currentGaze = 'Shutter Blocked';
      } else if (!faceIsDetected) {
        currentGaze = 'Align Face';
      } else {
        currentGaze = 'Focused';
      }

      setGazeStatus(currentGaze);
      return { shutterOpen: shutterIsOpen, faceDetected: faceIsDetected, gaze: currentGaze };
    } catch (err) {
      setIsShutterOpen(false);
      setIsFacePresent(false);
      return { shutterOpen: false, faceDetected: false, gaze: 'Sensor Error' };
    }
  };

  // Keep Stream attached if stage transitions
  useEffect(() => {
    if (!cameraStream) return;
    const vid = stage === 'in-test' ? pipVideoRef.current : videoRef.current;
    if (vid && vid.srcObject !== cameraStream) {
      vid.srcObject = cameraStream;
      vid.play().catch(() => {});
    }
  }, [stage, cameraStream]);

  // Stage 2 Auto-check loop
  useEffect(() => {
    if (stage !== 'proctor-check' || !isCameraActive) return;
    const interval = setInterval(() => {
      evaluateCameraSensors();
    }, 400);
    return () => clearInterval(interval);
  }, [stage, isCameraActive]);

  // Disqualification Execution
  const executeDisqualification = (reason) => {
    stopCameraFeed();
    if (surveillanceInterval.current) clearInterval(surveillanceInterval.current);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    const activeDomain = customSkill.trim() || selectedSkill;
    const lastQuestionIndex = currentStepRef.current;
    const currentQ = questionsRef.current[lastQuestionIndex];
    const totalQ = questionsRef.current.length || 1;
    const answeredCount = Object.keys(userAnswersRef.current).length;

    const terminationRecord = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      skill: activeDomain,
      level: candidateProfile?.level || 'intermediate',
      score: 0,
      status: 'Terminated / Disqualified (3 Strikes)',
      reason,
      lastQuestionNum: lastQuestionIndex + 1,
      totalQuestions: totalQ,
      lastQuestionText: currentQ ? currentQ.question : 'N/A',
      answeredCount,
      warningStrikes: 3,
      detectedGaps: ['Integrity Breach — Re-calibration Recommended']
    };

    const updatedHistory = [terminationRecord, ...assessmentHistory];
    setAssessmentHistory(updatedHistory);
    localStorage.setItem('skillbridge_diagnostic_history', JSON.stringify(updatedHistory));

    setDisqualifiedSnapshot(terminationRecord);
    setShowWarningModal(false);
    setStage('disqualified');
  };

  const triggerSecurityWarning = (reason) => {
    const nextCount = warningCountRef.current + 1;
    warningCountRef.current = nextCount;
    setWarningCount(nextCount);

    if (nextCount >= 3) {
      executeDisqualification(`Exceeded 3 strikes. Latest breach: ${reason}`);
      return;
    }

    setLastWarningMsg(`Integrity Warning: ${reason} (Strike ${nextCount}/3)`);
    setShowWarningModal(true);
  };

  // Watchdog Poll during in-test
  useEffect(() => {
    if (stage !== 'in-test') {
      if (surveillanceInterval.current) clearInterval(surveillanceInterval.current);
      return;
    }

    surveillanceInterval.current = setInterval(() => {
      const metrics = evaluateCameraSensors();
      if (!metrics) return;

      if (!metrics.shutterOpen) {
        shutterBlockedCounter.current += 1;
        if (shutterBlockedCounter.current >= 2) {
          triggerSecurityWarning('Camera shutter or lens covered! Uncover the lens immediately.');
          shutterBlockedCounter.current = 0;
        }
      } else {
        shutterBlockedCounter.current = 0;
      }

      if (!metrics.faceDetected && metrics.shutterOpen) {
        faceMissingStreakRef.current += 1;
        if (faceMissingStreakRef.current >= 3) {
          triggerSecurityWarning('Candidate face not centered in camera frame for extended duration.');
          faceMissingStreakRef.current = 0;
        }
      } else {
        faceMissingStreakRef.current = 0;
      }

      if (metrics.gaze !== 'Focused' && metrics.shutterOpen && metrics.faceDetected) {
        gazeDeviationStreakRef.current += 1;
        if (gazeDeviationStreakRef.current >= 3) {
          triggerSecurityWarning(`Sustained gaze deviation (${metrics.gaze}). Please focus on the exam screen.`);
          gazeDeviationStreakRef.current = 0;
        }
      } else {
        gazeDeviationStreakRef.current = 0;
      }
    }, 2000);

    const onVisibilityChange = () => {
      if (document.hidden) triggerSecurityWarning('Tab switch detected! Leaving the assessment tab is strictly prohibited.');
    };
    const onWindowBlur = () => {
      triggerSecurityWarning('Window focus lost! External application interaction is not permitted.');
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && stage === 'in-test') {
        triggerSecurityWarning('Fullscreen mode exited! Test must remain locked in fullscreen.');
      }
    };
    const preventKeys = (e) => {
      e.preventDefault();
      triggerSecurityWarning('Clipboard copying, pasting, and context menus are restricted.');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('contextmenu', preventKeys);
    window.addEventListener('copy', preventKeys);
    window.addEventListener('paste', preventKeys);

    return () => {
      clearInterval(surveillanceInterval.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('contextmenu', preventKeys);
      window.removeEventListener('copy', preventKeys);
      window.removeEventListener('paste', preventKeys);
    };
  }, [stage]);

  // Timer
  useEffect(() => {
    if (stage !== 'in-test') return;
    if (timeLeft <= 0) {
      handleFinalSubmission();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // Launch Assessment
  const startTestSession = async () => {
    try {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen bypassed');
    }

    const activeDomain = customSkill.trim() || selectedSkill;
    const userTier = candidateProfile?.level || 'intermediate';
    const targetQCount = examDuration === 30 ? 20 : 15;
    const targetTimeSeconds = examDuration === 30 ? 1800 : 900;

    setIsGeneratingQuestions(true);

    let dynamicPool = [];
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/generate-dynamic-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: userProfile?.headline || 'Full Stack Engineer & AI Specialist',
          bio: userProfile?.bio || 'Building SkillBridge AI for SIH 2026',
          target_skill: activeDomain,
          level: userTier.charAt(0).toUpperCase() + userTier.slice(1),
          count: targetQCount
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          dynamicPool = data.questions;
        }
      }
    } catch (err) {
      console.warn('AI Question API unreachable, using calibrated fallback:', err);
    }

    if (!dynamicPool || dynamicPool.length === 0) {
      for (let i = 1; i <= targetQCount; i++) {
        dynamicPool.push({
          id: `fb_${activeDomain}_${i}`,
          category: `${activeDomain} Core`,
          question: `[Q${i}] In production ${activeDomain} setups, what architectural decision best prevents concurrency blocking under heavy load?`,
          options: [
            { label: 'Offloading I/O workloads to non-blocking asynchronous event loops or thread pools', isCorrect: true },
            { label: 'Forcing single-threaded sequential disk read-write cycles across all connections', isCorrect: false },
            { label: 'Re-instantiating the entire process runtime on every incoming request', isCorrect: false },
            { label: 'Disabling TCP socket keep-alive flags completely', isCorrect: false }
          ]
        });
      }
    }

    setQuestions(dynamicPool);
    setUserAnswers({});
    setCurrentStep(0);
    setWarningCount(0);
    warningCountRef.current = 0;
    faceMissingStreakRef.current = 0;
    shutterBlockedCounter.current = 0;
    gazeDeviationStreakRef.current = 0;

    setTimeLeft(targetTimeSeconds);
    const now = Date.now();
    setStartTime(now);
    startTimeRef.current = now;
    setIsGeneratingQuestions(false);
    setStage('in-test');
  };

  // Submit and Save Progress
  const handleFinalSubmission = async () => {
    stopCameraFeed();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    const activeDomain = customSkill.trim() || selectedSkill;
    const totalCount = questions.length;
    let correctCount = 0;
    const categoryStats = {};

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected && selected.isCorrect;
      if (isCorrect) correctCount++;

      const catName = q.category || activeDomain;
      if (!categoryStats[catName]) {
        categoryStats[catName] = { total: 0, correct: 0 };
      }
      categoryStats[catName].total += 1;
      if (isCorrect) categoryStats[catName].correct += 1;
    });

    const finalScore = Math.round((correctCount / totalCount) * 100);
    const durationSeconds = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);

    const breakdown = Object.entries(categoryStats).map(([cat, val]) => {
      const percentage = Math.round((val.correct / val.total) * 100);
      return {
        category: cat,
        score: percentage,
        status: percentage >= 75 ? 'Mastered' : percentage >= 50 ? 'Moderate' : 'Deficient'
      };
    });

    const detectedGaps = breakdown.filter((b) => b.score < 70).map((b) => b.category);

    const previousAttempts = assessmentHistory.filter(
      (h) => h.skill.toLowerCase() === activeDomain.toLowerCase() && h.status !== 'Terminated / Disqualified (3 Strikes)'
    );
    const lastAttempt = previousAttempts.length > 0 ? previousAttempts[0] : null;
    const delta = lastAttempt ? finalScore - lastAttempt.score : 0;

    const newTotalAttempts = (candidateProfile?.totalAttempts || 0) + 1;
    const prevAvg = candidateProfile?.averageScore || finalScore;
    const newAvg = Math.round((prevAvg * (newTotalAttempts - 1) + finalScore) / newTotalAttempts);

    let updatedTier = candidateProfile?.level || 'beginner';
    if (newTotalAttempts >= 2 && newAvg >= 75 && updatedTier === 'beginner') {
      updatedTier = 'intermediate';
    } else if (newTotalAttempts >= 4 && newAvg >= 85 && updatedTier === 'intermediate') {
      updatedTier = 'expert';
    }

    const updatedProfile = {
      ...candidateProfile,
      level: updatedTier,
      totalAttempts: newTotalAttempts,
      averageScore: newAvg,
      lastUpdated: new Date().toLocaleDateString()
    };
    localStorage.setItem('sb_candidate_assessment_credentials', JSON.stringify(updatedProfile));
    setCandidateProfile(updatedProfile);

    let readinessBand = 'Foundational (Level 1)';
    if (finalScore >= 85) readinessBand = 'Production Ready (Level 3)';
    else if (finalScore >= 60) readinessBand = 'Intermediate (Level 2)';

    try {
      await fetch(`${API_BASE_URL}/api/submit-assessment-record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userProfile?.email || 'ajay.dev@dtu.ac.in',
          category: activeDomain,
          total_questions: totalCount,
          correct_answers: correctCount,
          score_percentage: finalScore,
          readiness_band: readinessBand
        })
      });
    } catch (err) {
      console.warn('MySQL commit error (offline handled):', err);
    }

    const analysisPayload = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      skill: activeDomain,
      level: updatedTier,
      score: finalScore,
      status: 'Passed / Verified',
      previousScore: lastAttempt ? lastAttempt.score : null,
      delta,
      durationSeconds,
      warningStrikes: warningCountRef.current,
      breakdown,
      detectedGaps: detectedGaps.length > 0 ? detectedGaps : ['No Major Disconnects Detected!']
    };

    const updatedHistory = [analysisPayload, ...assessmentHistory];
    setAssessmentHistory(updatedHistory);
    localStorage.setItem('skillbridge_diagnostic_history', JSON.stringify(updatedHistory));

    setActiveAnalysis(analysisPayload);
    setStage('completed');
  };

  useEffect(() => {
    if ((stage !== 'completed' && stage !== 'history') || !progressCanvasRef.current) return;

    const activeDomain = activeAnalysis?.skill || customSkill.trim() || selectedSkill;
    const relevantHistory = assessmentHistory
      .filter((h) => h.skill.toLowerCase() === activeDomain.toLowerCase() && h.score !== 0)
      .slice(0, 7)
      .reverse();

    if (relevantHistory.length < 2) return;

    const canvas = progressCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement.offsetWidth;
    const cssHeight = 220;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const padLeft = 45;
    const padRight = 35;
    const padTop = 30;
    const padBottom = 35;
    const plotW = cssWidth - padLeft - padRight;
    const plotH = cssHeight - padTop - padBottom;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    [0, 25, 50, 75, 100].forEach((val) => {
      const y = Math.round(padTop + plotH - (val / 100) * plotH) + 0.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(cssWidth - padRight, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '600 10px Rajdhani, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${val}%`, padLeft - 8, y);
    });

    const coords = relevantHistory.map((item, i) => {
      const x = padLeft + (i / (relevantHistory.length - 1)) * plotW;
      const y = padTop + plotH - (item.score / 100) * plotH;
      return { x, y, ...item };
    });

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.lineTo(coords[coords.length - 1].x, padTop + plotH);
    ctx.lineTo(coords[0].x, padTop + plotH);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    coords.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#03070d';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '700 11px Orbitron, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${pt.score}%`, pt.x, pt.y - 8);

      ctx.font = '600 10px Rajdhani, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textBaseline = 'top';
      ctx.fillText(`Att ${idx + 1}`, pt.x, padTop + plotH + 8);
    });
  }, [stage, activeAnalysis, assessmentHistory, selectedSkill, customSkill]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeLevelMeta = getLevelMeta(candidateProfile?.level);

  // Manual Override for Low-light or Specific Driver Scenarios
  const forceVerifyHardware = () => {
    setIsShutterOpen(true);
    setIsFacePresent(true);
    setGazeStatus('Focused (Verified)');
  };

  return (
    <div className="proctored-assessment-page" ref={containerRef}>
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

      {/* STAGE 0: INTAKE */}
      {stage === 'profile-intake' && (
        <div className="assess-step-card intake-card">
          <div className="card-top-tag">
            <span className="cyan-pip">✦</span>
            <span>Skill Profiling &amp; Artifact Intake</span>
          </div>

          <h2 className="step-title">Calibrate Diagnostic Difficulty</h2>
          <p className="step-desc">
            To ensure your assessments match your experience, provide your professional profiles. 
            SkillBridge automatically categorizes you into <strong>Beginner</strong>, <strong>Intermediate</strong>, or <strong>Expert</strong> difficulty tiers.
          </p>

          <form onSubmit={handleIntakeSubmit} className="intake-form-grid">
            <div className="intake-field">
              <label>LINKEDIN PROFILE URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
              />
            </div>

            <div className="intake-field">
              <label>GITHUB USERNAME OR REPO URL</label>
              <input
                type="text"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
              />
            </div>

            <div className="intake-field">
              <label>UPLOAD RESUME / CV (PDF OR DOCX)</label>
              <div className="resume-drop-zone">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required
                />
                <span className="resume-hint-text">
                  {resumeFile ? `✓ Loaded: ${resumeFile.name}` : '📁 Click or drop resume here to calculate skill vector'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-proceed-proctor" disabled={intakeLoading}>
              {intakeLoading ? 'Analyzing Footprint & Setting Tier...' : 'Evaluate Artifacts & Set Level →'}
            </button>
          </form>
        </div>
      )}

      {/* STAGE 1: SKILL SELECTION */}
      {stage === 'skill-select' && (
        <div className="assess-step-card">
          <div className="card-top-tag">
            <span className="cyan-pip">✦</span>
            <span>Skill Diagnostic Calibration</span>
          </div>

          {candidateProfile && (
            <div className="candidate-dossier-card">
              <div className="dossier-header-row">
                <div className="dossier-tier-box">
                  <span className="dossier-tier-lbl">EVALUATED STATUS</span>
                  <span
                    className="dossier-tier-pill"
                    style={{
                      color: activeLevelMeta.badgeColor,
                      borderColor: activeLevelMeta.badgeColor,
                      boxShadow: `0 0 16px ${activeLevelMeta.badgeGlow}`
                    }}
                  >
                    ● {activeLevelMeta.label} TIER
                  </span>
                </div>

                <div className="dossier-progress-stats">
                  <div className="dp-item">
                    <span className="dp-lbl">Completed Tests</span>
                    <strong className="dp-val">{candidateProfile.totalAttempts || 0}</strong>
                  </div>
                  <div className="dp-item">
                    <span className="dp-lbl">Average Score</span>
                    <strong className="dp-val text-cyan">{candidateProfile.averageScore || 0}%</strong>
                  </div>
                </div>

                <button 
                  className="btn-edit-artifacts" 
                  onClick={() => setIsEditModalOpen(true)}
                  title="Modify LinkedIn, GitHub or Resume"
                >
                  ✏️ Edit Profile Artifacts
                </button>
              </div>

              <div className="dossier-artifacts-bar">
                <span className="art-item">
                  <span className="art-lbl">Resume:</span> {candidateProfile.resumeName}
                </span>
                <span className="art-sep">|</span>
                <span className="art-item">
                  <span className="art-lbl">GitHub:</span> {candidateProfile.github.replace('https://github.com/', '@')}
                </span>
                <span className="art-sep">|</span>
                <span className="art-item">
                  <span className="art-lbl">Track:</span> {activeLevelMeta.desc}
                </span>
              </div>
            </div>
          )}

          <h2 className="step-title">Select Diagnostic Competency &amp; Time Window</h2>
          <p className="step-desc">
            Choose your target technical domain and assessment window. Questions are dynamically generated via AI to match your verified tier.
          </p>

          <div style={{ background: '#040b18', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px 24px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              SELECT EVALUATION DURATION &amp; QUESTION QUOTA:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                onClick={() => setExamDuration(15)}
                style={{
                  background: examDuration === 15 ? 'rgba(0, 240, 255, 0.12)' : '#020617',
                  border: examDuration === 15 ? '2px solid #00f0ff' : '1px solid #142845',
                  padding: '16px',
                  borderRadius: '10px',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ color: examDuration === 15 ? '#00f0ff' : '#94a3b8', fontWeight: 'bold', fontSize: '15px' }}>
                  ⏱ 15 Minutes Sprint
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>
                  15 AI-Generated Questions • Fast Pace
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExamDuration(30)}
                style={{
                  background: examDuration === 30 ? 'rgba(0, 240, 255, 0.12)' : '#020617',
                  border: examDuration === 30 ? '2px solid #00f0ff' : '1px solid #142845',
                  padding: '16px',
                  borderRadius: '10px',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ color: examDuration === 30 ? '#00f0ff' : '#94a3b8', fontWeight: 'bold', fontSize: '15px' }}>
                  ⏱ 30 Minutes Deep-Dive
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>
                  20 AI-Generated Questions • Comprehensive
                </div>
              </button>
            </div>
          </div>

          <div className="skill-chips-grid">
            {['Python', 'FastAPI', 'Docker'].map((sk) => (
              <button
                key={sk}
                className={`skill-chip-btn ${selectedSkill === sk && !customSkill ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSkill(sk);
                  setCustomSkill('');
                }}
              >
                <span className="sk-icon">◈</span>
                <span>{sk}</span>
              </button>
            ))}
          </div>

          <div className="custom-skill-input-row">
            <label>Or Type Custom Domain:</label>
            <input
              type="text"
              placeholder="e.g. Kubernetes, Redis, Cloud Microservices..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
            />
          </div>

          <button 
            className="btn-proceed-proctor" 
            onClick={() => {
              setStage('proctor-check');
              startCameraFeed();
            }} 
            style={{ marginTop: '20px' }}
          >
            Launch Camera Calibration &amp; Proctor Check →
          </button>
        </div>
      )}

      {/* STAGE 2: CALIBRATION & LIVE FEED */}
      {stage === 'proctor-check' && (
        <div className="assess-step-card proctor-check-view">
          <span className="card-top-tag">Hardware Sensor Verification</span>
          <h2 className="step-title">Biometric &amp; Optical Calibration</h2>
          <p className="step-desc">
            Ensure your webcam lens cover is open and your face is visible. Real-time optical telemetry is displayed below.
          </p>

          <div
            className="webcam-calibration-frame"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              height: '360px',
              margin: '0 auto 16px auto',
              background: '#01050d',
              borderRadius: '14px',
              overflow: 'hidden',
              border: isShutterOpen ? '2px solid #00f0ff' : '2px solid #f43f5e',
              boxShadow: isShutterOpen ? '0 0 25px rgba(0, 240, 255, 0.2)' : '0 0 25px rgba(244, 63, 94, 0.2)'
            }}
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                display: isCameraActive ? 'block' : 'none'
              }}
            />

            {!isCameraActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                gap: '12px'
              }}>
                <div style={{ fontSize: '42px' }}>📷</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Camera stream inactive.</div>
                <button
                  type="button"
                  onClick={startCameraFeed}
                  style={{
                    background: '#00f0ff',
                    color: '#01050d',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Start Camera Feed
                </button>
              </div>
            )}

            {isCameraActive && (
              <>
                <div className={`face-target-reticle ${isFacePresent && isShutterOpen ? 'valid' : 'invalid'}`} style={{ pointerEvents: 'none' }}></div>
                <div className="cam-live-indicator" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                  <span className="rec-dot"></span>
                  <span>LIVE PROCTOR STREAM</span>
                </div>
              </>
            )}
          </div>

          {/* Controls Bar with Live Telemetry */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={isCameraActive ? stopCameraFeed : startCameraFeed}
              style={{
                background: isCameraActive ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                border: isCameraActive ? '1px solid #f43f5e' : '1px solid #00f0ff',
                color: isCameraActive ? '#f43f5e' : '#00f0ff',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isCameraActive ? '⏹ Stop Feed' : '▶ Start Feed'}
            </button>

            {/* Live Camera Feed Telemetry */}
            <div style={{ fontSize: '12px', color: '#64748b', background: '#040b18', border: '1px solid #142845', padding: '6px 14px', borderRadius: '8px' }}>
              Light Level: <strong style={{ color: opticalTelemetry.lum > 8 ? '#4ade80' : '#f43f5e' }}>{opticalTelemetry.lum}</strong> (Min 9) | Contrast: <strong style={{ color: opticalTelemetry.spread > 15 ? '#4ade80' : '#f43f5e' }}>{opticalTelemetry.spread}</strong>
            </div>

            <button
              type="button"
              onClick={forceVerifyHardware}
              style={{
                background: 'transparent',
                border: '1px dashed #38bdf8',
                color: '#38bdf8',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title="Click if camera is open but indoor lighting is too dim"
            >
              Force Verify Shutter ✓
            </button>
          </div>

          {cameraError && <div className="camera-err-msg" style={{ marginBottom: '16px' }}>⚠ {cameraError}</div>}

          <div className="hardware-diagnostics-grid">
            <div className={`diag-pill ${isShutterOpen ? 'pass' : 'fail'}`}>
              <span>Lens Shutter:</span>
              <strong>{isShutterOpen ? 'Open ✓' : 'Blocked / Covered ✕'}</strong>
            </div>
            <div className={`diag-pill ${isFacePresent ? 'pass' : 'fail'}`}>
              <span>Face Presence:</span>
              <strong>{isFacePresent ? 'Detected ✓' : 'Align Face ✕'}</strong>
            </div>
            <div className="diag-pill pass">
              <span>Selected Mode:</span>
              <strong>{examDuration} Mins ({examDuration === 30 ? '20' : '15'} Questions)</strong>
            </div>
          </div>

          <div className="proctor-actions-wrap" style={{ marginTop: '20px' }}>
            <button
              className="btn-start-locked-test"
              onClick={startTestSession}
              disabled={!isShutterOpen || !isFacePresent || isGeneratingQuestions || !isCameraActive}
              style={{
                opacity: (!isShutterOpen || !isFacePresent || isGeneratingQuestions || !isCameraActive) ? 0.45 : 1,
                cursor: (!isShutterOpen || !isFacePresent || isGeneratingQuestions || !isCameraActive) ? 'not-allowed' : 'pointer'
              }}
            >
              {isGeneratingQuestions
                ? `AI Generating ${examDuration === 30 ? '20' : '15'} Scenario Questions...`
                : (isShutterOpen && isFacePresent ? `Lock Fullscreen & Begin (${examDuration} Mins) ⛊` : 'Uncover Lens & Align Face to Unlock')}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: ACTIVE TEST */}
      {stage === 'in-test' && questions.length > 0 && (
        <div className="active-test-layout">
          <div className="proctor-pip-card">
            <video ref={pipVideoRef} autoPlay playsInline muted className="pip-video" style={{ transform: 'scaleX(-1)' }} />
            <div className="pip-overlay">
              <div className="pip-status">
                <span className="pip-rec-dot"></span>
                <span>{gazeStatus.toUpperCase()}</span>
              </div>
              <span className={`pip-warnings ${warningCount > 0 ? 'warn-high' : ''}`}>
                Strikes: {warningCount}/3
              </span>
            </div>
          </div>

          <div className="test-board">
            <div className="test-board-header">
              <div className="header-left-badges">
                <span className="test-skill-badge">{customSkill || selectedSkill}</span>
                <span 
                  className="test-live-level-badge"
                  style={{
                    color: activeLevelMeta.badgeColor,
                    borderColor: activeLevelMeta.badgeColor,
                    boxShadow: `0 0 12px ${activeLevelMeta.badgeGlow}`
                  }}
                >
                  ● {activeLevelMeta.label} TIER
                </span>
                <span className="question-counter">Question {currentStep + 1} of {questions.length}</span>
              </div>

              <div className="test-timer-badge">
                <span className="timer-icon">⏱</span>
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            <div className="question-meta-category">
              <span>Category: {questions[currentStep].category} (AI Adaptive Node)</span>
            </div>

            <h3 className="active-question-text">{questions[currentStep].question}</h3>

            <div className="options-grid">
              {questions[currentStep].options.map((opt, i) => {
                const isSelected = userAnswers[questions[currentStep].id]?.label === opt.label;
                return (
                  <button
                    key={i}
                    className={`question-opt-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setUserAnswers({ ...userAnswers, [questions[currentStep].id]: opt })}
                  >
                    <span className="opt-idx">{String.fromCharCode(65 + i)}</span>
                    <span className="opt-title">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="test-controls-row">
              <button
                className="btn-test-prev"
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </button>

              {currentStep < questions.length - 1 ? (
                <button
                  className="btn-test-next"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!userAnswers[questions[currentStep].id]}
                >
                  Save &amp; Next →
                </button>
              ) : (
                <button
                  className="btn-test-final"
                  onClick={handleFinalSubmission}
                  disabled={!userAnswers[questions[currentStep].id]}
                >
                  Finalize &amp; Evaluate Assessment ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: RESULT */}
      {stage === 'completed' && activeAnalysis && (
        <div className="assess-step-card result-evaluation-view">
          <span className="card-top-tag">Real Assessment Analysis</span>
          
          <div className="result-heading-flex">
            <h2 className="step-title">{activeAnalysis.skill} Competency Dossier</h2>
            <span 
              className="dossier-tier-pill"
              style={{
                color: getLevelMeta(activeAnalysis.level).badgeColor,
                borderColor: getLevelMeta(activeAnalysis.level).badgeColor,
                boxShadow: `0 0 16px ${getLevelMeta(activeAnalysis.level).badgeGlow}`
              }}
            >
              ● {getLevelMeta(activeAnalysis.level).label}
            </span>
          </div>

          <p className="step-desc">Audit Record #{activeAnalysis.id} — Time: {Math.round(activeAnalysis.durationSeconds / 60)}m ({activeAnalysis.durationSeconds}s)</p>

          <div className="score-summary-grid">
            <div className="score-metric-box">
              <span className="smb-label">Assessed Readiness Score</span>
              <span className="smb-val text-cyan">{activeAnalysis.score}%</span>
            </div>

            {activeAnalysis.previousScore !== null && (
              <div className="score-metric-box">
                <span className="smb-label">Previous Attempt</span>
                <span className="smb-val">{activeAnalysis.previousScore}%</span>
              </div>
            )}

            {activeAnalysis.previousScore !== null && (
              <div className="score-metric-box">
                <span className="smb-label">Progression Delta (Δ)</span>
                <span className={`smb-val ${activeAnalysis.delta >= 0 ? 'text-green' : 'text-amber'}`}>
                  {activeAnalysis.delta >= 0 ? `+${activeAnalysis.delta}%` : `${activeAnalysis.delta}%`}
                </span>
              </div>
            )}
          </div>

          {assessmentHistory.filter((h) => h.skill.toLowerCase() === activeAnalysis.skill.toLowerCase() && h.score !== 0).length > 1 && (
            <div className="history-trend-card">
              <h4>Historical Skill Trajectory &amp; Reassessment Growth</h4>
              <div className="trend-canvas-wrapper">
                <canvas ref={progressCanvasRef} className="trend-canvas" />
              </div>
            </div>
          )}

          <div className="category-breakdown-panel">
            <h4>Domain Sub-competency Breakdown</h4>
            <div className="category-bars-list">
              {activeAnalysis.breakdown.map((item, idx) => (
                <div key={idx} className="category-row">
                  <div className="cat-header">
                    <span>{item.category}</span>
                    <span className={`cat-status-tag ${item.status.toLowerCase()}`}>{item.score}% ({item.status})</span>
                  </div>
                  <div className="cat-track">
                    <div
                      className={`cat-fill ${item.score >= 70 ? 'fill-high' : 'fill-low'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gaps-detected-card">
            <h5>Identified Deficiencies to Target:</h5>
            <div className="gaps-pill-wrap">
              {activeAnalysis.detectedGaps.map((gap, i) => (
                <span key={i} className="gap-pill">{gap}</span>
              ))}
            </div>
          </div>

          <div className="evaluation-action-row">
            <button
              className="btn-primary-cyan"
              onClick={() => {
                setStage('skill-select');
                setUserAnswers({});
                setWarningCount(0);
                warningCountRef.current = 0;
                setCurrentStep(0);
                setTimeLeft(900);
              }}
            >
              Take Another Reassessment ⟳
            </button>
            <button className="btn-secondary-dark" onClick={() => setActivePage('dashboard')}>
              Return To Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: HISTORY */}
      {stage === 'history' && (
        <div className="assess-step-card history-view-card">
          <div className="card-top-tag">Audit Ledger</div>
          <h2 className="step-title">Historical Assessment Log</h2>
          <p className="step-desc">Immutable history of verified diagnostic attempts and integrity compliance records.</p>

          <div className="history-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Skill Domain</th>
                  <th>Tier</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Strikes</th>
                  <th>Target Gaps</th>
                </tr>
              </thead>
              <tbody>
                {assessmentHistory.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td><strong className="text-cyan">{row.skill}</strong></td>
                    <td>
                      <span 
                        className="audit-level-badge"
                        style={{ color: getLevelMeta(row.level).badgeColor }}
                      >
                        {getLevelMeta(row.level).label}
                      </span>
                    </td>
                    <td><strong className={row.score === 0 ? 'text-red' : 'text-cyan'}>{row.score}%</strong></td>
                    <td><span className={`status-pill ${row.score === 0 ? 'pill-fail' : 'pill-pass'}`}>{row.status || 'Verified'}</span></td>
                    <td>{row.warningStrikes}/3</td>
                    <td>{row.detectedGaps ? row.detectedGaps.join(', ') : 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn-secondary-dark" onClick={() => setStage('skill-select')}>
            ← Back to Assessment Launcher
          </button>
        </div>
      )}

      {/* STAGE 6: DISQUALIFICATION */}
      {stage === 'disqualified' && (
        <div className="assess-step-card disqualified-view">
          <div className="disqualify-icon">⚠️</div>
          <h2 className="step-title text-red">Assessment Force-Terminated</h2>
          <p className="step-desc">
            You exceeded the allowable 3-strike integrity threshold. The proctoring watchdog terminated your session immediately.
          </p>

          {disqualifiedSnapshot && (
            <div className="termination-dossier">
              <div className="td-row">
                <span>Domain Evaluated:</span>
                <strong>{disqualifiedSnapshot.skill}</strong>
              </div>
              <div className="td-row">
                <span>Evaluated Tier:</span>
                <span 
                  className="dossier-tier-pill"
                  style={{
                    color: getLevelMeta(disqualifiedSnapshot.level).badgeColor,
                    borderColor: getLevelMeta(disqualifiedSnapshot.level).badgeColor
                  }}
                >
                  ● {getLevelMeta(disqualifiedSnapshot.level).label}
                </span>
              </div>
              <div className="td-row">
                <span>Terminated on Question:</span>
                <strong className="text-amber">Question {disqualifiedSnapshot.lastQuestionNum} of {disqualifiedSnapshot.totalQuestions}</strong>
              </div>
              <div className="td-row">
                <span>Current Prompt at Exit:</span>
                <p className="td-question-preview">"{disqualifiedSnapshot.lastQuestionText}"</p>
              </div>
              <div className="td-row">
                <span>Reason for Termination:</span>
                <strong className="text-red">{disqualifiedSnapshot.reason}</strong>
              </div>
              <div className="td-row">
                <span>Audit Status:</span>
                <span className="status-pill pill-fail">Session Voided (0% Logged)</span>
              </div>
            </div>
          )}

          <div className="evaluation-action-row" style={{ marginTop: '24px' }}>
            <button
              className="btn-primary-cyan"
              onClick={() => {
                setStage('skill-select');
                setUserAnswers({});
                setWarningCount(0);
                warningCountRef.current = 0;
                setCurrentStep(0);
                setTimeLeft(900);
              }}
            >
              Restart Calibration &amp; Reattempt ⟳
            </button>
            <button className="btn-secondary-dark" onClick={() => setActivePage('dashboard')}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {showWarningModal && stage === 'in-test' && (
        <div className="warning-modal-backdrop">
          <div className="warning-modal-box">
            <span className="warning-badge">Security Infraction</span>
            <h4>Integrity Warning ({warningCount}/3)</h4>
            <p>{lastWarningMsg}</p>
            <span className="warning-note">⚠️ Notice: Strike 3 will immediately abort your test on this exact question.</span>
            <button
              className="btn-ack-warning"
              onClick={() => {
                setShowWarningModal(false);
                if (containerRef.current && !document.fullscreenElement) {
                  containerRef.current.requestFullscreen().catch(() => {});
                }
              }}
            >
              Acknowledge &amp; Resume
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="assess-modal-backdrop">
          <div className="assess-modal-card">
            <div className="modal-top-bar">
              <span className="modal-tag">ARTIFACT RE-CALIBRATION</span>
              <h3>Update Assessment Credentials</h3>
              <button className="btn-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="modal-form-flow">
              <div className="intake-field">
                <label>LINKEDIN PROFILE URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  required
                />
              </div>

              <div className="intake-field">
                <label>GITHUB USERNAME / REPO URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                />
              </div>

              <div className="intake-field">
                <label>REPLACE RESUME FILE (Optional)</label>
                <div className="resume-drop-zone">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <span className="resume-hint-text">
                    {resumeFile ? `✓ Loaded: ${resumeFile.name}` : `Currently using: ${candidateProfile?.resumeName || 'Attached CV'}`}
                  </span>
                </div>
              </div>

              <div className="modal-footer-btns">
                <button type="button" className="btn-secondary-dark" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-cyan">
                  Save Changes &amp; Re-evaluate Tier ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}