/**
 * SkillBridge Central Intelligence & REST Service
 * Future FastAPI Endpoints:
 * GET  /api/v1/skills/assessment-results
 * GET  /api/v1/career-twin/trajectory
 * GET  /api/v1/institution/cohort-analytics
 * GET  /api/v1/company/talent-rankings
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // 1. Submit Diagnostic Assessment & Calculate Gaps
  async submitAssessment(answers) {
    // When FastAPI is ready:
    // const res = await fetch(`${BASE_URL}/api/v1/assessment/submit`, { method: 'POST', body: JSON.stringify(answers) });
    // return res.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        let correctCount = 0;
        Object.values(answers).forEach((ans) => {
          if (ans.isCorrect) correctCount++;
        });

        const calculatedScore = Math.round((correctCount / Object.keys(answers).length) * 100) || 72;

        resolve({
          status: 'success',
          overallReadiness: calculatedScore,
          breakdown: [
            { category: 'Backend Architecture', score: 88, benchmark: 85 },
            { category: 'Frontend Development', score: 82, benchmark: 80 },
            { category: 'DevOps & Containers', score: 38, benchmark: 82 },
            { category: 'Cloud Infrastructure', score: 45, benchmark: 75 },
            { category: 'Database & Caching', score: 79, benchmark: 80 }
          ],
          criticalGaps: ['Docker', 'Kubernetes', 'Redis']
        });
      }, 700);
    });
  },

  // 2. Fetch Career Twin Growth Trajectory Curve
  async getCareerTwinTrajectory(targetRole = 'Full Stack') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          currentReadiness: 74,
          projectedAfterMilestone1: 86,
          projectedTarget: 96,
          milestones: [
            { stage: 'Current Baseline', readiness: 74, timeMonths: 0 },
            { stage: 'Docker & Microservices', readiness: 84, timeMonths: 1.5 },
            { stage: 'Redis Caching & Scale', readiness: 89, timeMonths: 3 },
            { stage: 'Production Deployment', readiness: 96, timeMonths: 4.5 }
          ]
        });
      }, 400);
    });
  },

  // 3. Institutional Cohort Gap Analytics
  async getInstitutionCohortStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          cohortTotal: 420,
          avgReadiness: 68.4,
          curriculumGaps: [
            { subject: 'Cloud & DevOps', curriculumCoverage: 32, industryDemand: 88 },
            { subject: 'Data Engineering & SQL', curriculumCoverage: 65, industryDemand: 82 },
            { subject: 'Core Algorithms & DSA', curriculumCoverage: 90, industryDemand: 85 },
            { subject: 'REST APIs & Web Microservices', curriculumCoverage: 58, industryDemand: 92 }
          ]
        });
      }, 400);
    });
  },

  // 4. Recruiter Candidate Vector Fit
  async getCompanyCandidateFit() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Ajay Kumar', matchScore: 91, verifiedSkills: 9, criticalMissing: 1 },
          { name: 'Neha Sharma', matchScore: 86, verifiedSkills: 8, criticalMissing: 2 },
          { name: 'Rahul Verma', matchScore: 78, verifiedSkills: 6, criticalMissing: 3 },
          { name: 'Priya Singh', matchScore: 94, verifiedSkills: 11, criticalMissing: 0 }
        ]);
      }, 400);
    });
  }
};