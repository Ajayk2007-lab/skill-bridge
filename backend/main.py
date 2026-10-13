import os
import random
import json
import re
from datetime import datetime
from typing import Dict, List, Optional
from dotenv import load_dotenv
load_dotenv()

import requests
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from pydantic import BaseModel

from app.database import engine, Base, get_db
import app.models as models
from app.schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    TokenResponse
)
from app.auth import hash_password, verify_password, create_access_token

# Automatically sync all tables with MySQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge AI - Backend Core",
    description="Skill Intelligence Layer API for SIH26044",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API Key (AQ format directly configured)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.get("/")
def home():
    return {
        "status": "Success",
        "message": "SkillBridge AI Backend & MySQL Connected Successfully!"
    }

# ==========================================
# 0. AI INTELLIGENCE CORE (REST CLIENT)
# ==========================================

class AIChatRequest(BaseModel):
    message: str
    user_role: Optional[str] = "student"

@app.post("/api/ai/chat")
def get_ai_response(payload: AIChatRequest):
    user_query = payload.message.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    system_instruction = (
        "You are the central intelligence core of SkillBridge AI. "
        "Answer the user's question directly, accurately, and concisely. "
        "Do NOT write any meta-announcements, greetings, or conversational filler "
        "(e.g., do NOT say 'Based on search...', 'According to sources...', or 'Sure, here is...'). "
        "Jump straight into the factual answer."
    )

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    body = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {
                "parts": [{"text": user_query}]
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=body, timeout=15)
        if response.status_code == 200:
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if candidates:
                reply_text = candidates[0]["content"]["parts"][0]["text"].strip()
                return {"reply": reply_text}
        else:
            print("Gemini API Error:", response.status_code, response.text)
    except Exception as e:
        print("Request failed:", e)

    if "skill" in user_query.lower() or "bridge" in user_query.lower():
        return {
            "reply": "SkillBridge AI is an autonomous career pathway and skill validation platform that connects verified candidate assessments with high-impact industry requisitions using vector intelligence."
        }

    return {"reply": f"Direct response: Verified data processed for '{user_query}'."}

# ==========================================
# DYNAMIC AI QUESTION GENERATOR (15 OR 20 QUESTIONS)
# ==========================================

class DynamicQuestionRequest(BaseModel):
    headline: str = ""
    bio: str = ""
    target_skill: Optional[str] = "Python"
    level: Optional[str] = "Intermediate"
    count: Optional[int] = 15  # 15 for 15 mins, 20 for 30 mins

@app.post("/api/ai/generate-dynamic-questions")
def generate_dynamic_questions(payload: DynamicQuestionRequest):
    skill = payload.target_skill or "Python"
    level = payload.level or "Intermediate"
    q_count = payload.count if payload.count in [15, 20] else 15
    nonce = random.randint(1000, 9999)

    prompt = f"""
Generate exactly {q_count} unique, completely randomized, practical multiple-choice assessment questions for:
Domain: {skill}
Difficulty Level: {level}
Session Nonce: {nonce}

Requirements:
1. Every question must be distinct, non-repetitive, and test real-world scenarios.
2. Provide exactly {q_count} questions.
3. Return ONLY a valid JSON array of objects. Do not include markdown codeblocks, notes, or extra text.
Format:
[
  {{
    "id": "gen_1",
    "category": "{skill} Engineering",
    "question": "Clear technical problem statement?",
    "options": [
      {{"label": "Option A text", "isCorrect": false}},
      {{"label": "Option B text", "isCorrect": true}},
      {{"label": "Option C text", "isCorrect": false}},
      {{"label": "Option D text", "isCorrect": false}}
    ]
  }}
]
"""

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.85}
    }

    try:
        response = requests.post(url, headers=headers, json=body, timeout=30)
        if response.status_code == 200:
            res_data = response.json()
            raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            raw_text = re.sub(r"^```json\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)
            questions_list = json.loads(raw_text)
            if len(questions_list) >= q_count:
                return {
                    "detected_skill": skill,
                    "detected_level": level,
                    "questions": questions_list[:q_count]
                }
    except Exception as err:
        print("Gemini Question Gen Error:", err)

    # Fallback pool for 15 or 20 questions
    fallback_pool = []
    subtopics = ["Architecture", "Concurrency", "Memory Optimization", "Security Protocols", "Error Handling", "Distributed I/O"]
    for i in range(1, q_count + 1):
        topic = subtopics[(i - 1) % len(subtopics)]
        fallback_pool.append({
            "id": f"q_{nonce}_{i}",
            "category": f"{skill} - {topic}",
            "question": f"[{level}] In production {skill} architectures, how should high-throughput {topic} bottlenecks be systematically mitigated?",
            "options": [
                {"label": "By isolating execution into non-blocking event loops or specialized workers", "isCorrect": True},
                {"label": "By locking global thread access across all available OS cores", "isCorrect": False},
                {"label": "By purging execution memory tables after every sequential request", "isCorrect": False},
                {"label": "By disabling network keep-alive headers completely", "isCorrect": False}
            ]
        })

    return {
        "detected_skill": skill,
        "detected_level": level,
        "questions": fallback_pool
    }

# ==========================================
# 1. AUTHENTICATION & USER MANAGEMENT
# ==========================================

@app.post("/api/signup", response_model=TokenResponse)
def signup(user_data: UserRegisterSchema, db: Session = Depends(get_db)):
    email = user_data.email.lower()

    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pwd = hash_password(user_data.password)

    new_user = models.User(
        name=user_data.name,
        email=email,
        phone=user_data.phone,
        password=hashed_pwd,
        role=user_data.role,
        organization=user_data.organization
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "sub": new_user.email,
        "role": new_user.role,
        "name": new_user.name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone or "",
            "role": new_user.role,
            "organization": new_user.organization
        }
    }

@app.post("/api/login", response_model=TokenResponse)
def login(login_data: UserLoginSchema, db: Session = Depends(get_db)):
    email = login_data.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email credentials or incorrect password."
        )

    token = create_access_token({
        "sub": user.email,
        "role": user.role,
        "name": user.name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user.name,
            "email": user.email,
            "phone": user.phone or "",
            "role": user.role,
            "organization": user.organization
        }
    }

@app.post("/api/forgot-password")
def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registered user found with this email."
        )

    otp = str(random.randint(100000, 999999))
    db.query(models.PasswordResetOTP).filter(models.PasswordResetOTP.email == email).delete()

    reset_entry = models.PasswordResetOTP(email=email, otp=otp)
    db.add(reset_entry)
    db.commit()

    return {
        "status": "Success",
        "message": f"OTP successfully generated for {email}",
        "demo_otp": otp
    }

@app.post("/api/reset-password")
def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    otp_record = db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.email == email,
        models.PasswordResetOTP.otp == payload.otp
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP."
        )

    user.password = hash_password(payload.new_password)
    db.delete(otp_record)
    db.commit()

    return {
        "status": "Success",
        "message": "Password updated successfully."
    }

# ==========================================
# 2. REAL-TIME ASSESSMENT AUDIT ENGINES
# ==========================================

@app.get("/api/questions/{category}")
def get_questions_by_skill(category: str, db: Session = Depends(get_db)):
    cleaned_cat = category.strip()
    records = db.query(models.AssessmentQuestion).filter(
        models.AssessmentQuestion.category.ilike(f"%{cleaned_cat}%")
    ).order_by(func.rand()).limit(5).all()

    if not records:
        records = db.query(models.AssessmentQuestion).order_by(func.rand()).limit(5).all()

    formatted_questions = []
    for q in records:
        correct = (q.correct_option or "A").strip().upper()
        formatted_questions.append({
            "id": f"q_{q.id}",
            "db_id": q.id,
            "category": q.category,
            "question": q.question_text,
            "options": [
                {"label": q.option_a, "isCorrect": correct == "A"},
                {"label": q.option_b, "isCorrect": correct == "B"},
                {"label": q.option_c, "isCorrect": correct == "C"},
                {"label": q.option_d, "isCorrect": correct == "D"}
            ]
        })

    return formatted_questions

class AssessmentRecordSchema(BaseModel):
    user_email: str
    category: str
    total_questions: int
    correct_answers: int
    score_percentage: float
    readiness_band: str

@app.post("/api/submit-assessment-record")
def save_assessment_submission(payload: AssessmentRecordSchema, db: Session = Depends(get_db)):
    submission = models.CandidateAssessment(
        user_email=payload.user_email.lower(),
        category=payload.category,
        total_questions=payload.total_questions,
        correct_answers=payload.correct_answers,
        score_percentage=payload.score_percentage,
        readiness_band=payload.readiness_band
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "status": "Success",
        "record_id": submission.id,
        "message": "Assessment audit record committed to MySQL."
    }

@app.get("/api/user-assessments/{email}")
def get_user_assessments(email: str, db: Session = Depends(get_db)):
    results = db.query(models.CandidateAssessment).filter(
        models.CandidateAssessment.user_email == email.lower()
    ).order_by(models.CandidateAssessment.submitted_at.desc()).all()
    return {"history": results}

@app.get("/api/candidate-dashboard-stats/{email}")
def get_dashboard_stats(email: str, db: Session = Depends(get_db)):
    clean_email = email.lower()
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Candidate record not found.")

    assessments = db.query(models.CandidateAssessment).filter(
        models.CandidateAssessment.user_email == clean_email
    ).order_by(models.CandidateAssessment.submitted_at.desc()).all()

    total_tests = len(assessments)
    if total_tests > 0:
        avg_score = round(sum(a.score_percentage for a in assessments) / total_tests, 1)
        latest_band = assessments[0].readiness_band
        latest_score = assessments[0].score_percentage
    else:
        avg_score = 0.0
        latest_band = "Not Assessed"
        latest_score = 0.0

    return {
        "candidate_name": user.name,
        "candidate_email": user.email,
        "organization": user.organization,
        "total_tests": total_tests,
        "average_score": avg_score,
        "latest_score": latest_score,
        "readiness_tier": latest_band,
        "recent_history": [
            {
                "id": a.id,
                "category": a.category,
                "score": a.score_percentage,
                "band": a.readiness_band,
                "date": a.submitted_at.strftime("%Y-%m-%d %H:%M")
            }
            for a in assessments[:5]
        ]
    }

# ==========================================
# 3. COMPANY / RECRUITER REAL-TIME PIPELINES
# ==========================================

class JobCreateSchema(BaseModel):
    title: str
    company: str
    required_skill: str
    min_score: int = 60
    package_lpa: str
    location: str = "Remote / Hybrid"

@app.post("/api/recruiter/post-job")
def recruiter_post_job(job_data: JobCreateSchema, db: Session = Depends(get_db)):
    new_job = models.JobOpportunity(
        title=job_data.title,
        company=job_data.company,
        required_skill=job_data.required_skill,
        min_score=job_data.min_score,
        package_lpa=job_data.package_lpa,
        location=job_data.location
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {
        "status": "Success",
        "message": "Job successfully published to live market!",
        "job_id": new_job.id
    }

@app.get("/api/recruiter/verified-candidates")
def get_verified_candidates(db: Session = Depends(get_db)):
    assessments = db.query(models.CandidateAssessment).order_by(
        models.CandidateAssessment.score_percentage.desc()
    ).all()

    candidates_list = []
    for a in assessments:
        user = db.query(models.User).filter(models.User.email == a.user_email).first()
        candidates_list.append({
            "id": a.id,
            "name": user.name if user else "Verified Candidate",
            "email": a.user_email,
            "phone": user.phone if user else "N/A",
            "organization": user.organization if user else "Partner University",
            "skill": a.category,
            "score": a.score_percentage,
            "band": a.readiness_band,
            "verified_on": a.submitted_at.strftime("%d %b %Y")
        })

    return {"candidates": candidates_list}

@app.get("/api/recruiter/active-jobs")
def get_company_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.JobOpportunity).order_by(models.JobOpportunity.created_at.desc()).all()
    return {"jobs": jobs}

@app.delete("/api/recruiter/delete-job/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobOpportunity).filter(models.JobOpportunity.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"status": "Success", "message": "Job removed from market."}

@app.get("/api/recruiter/market-velocity")
def get_market_velocity(db: Session = Depends(get_db)):
    assessments = db.query(models.CandidateAssessment).all()
    jobs = db.query(models.JobOpportunity).all()

    return {
        "market_metrics": [
            {"skill": "Python", "demand_score": 94, "velocity": "+18.4%", "hiring_volume": "High"},
            {"skill": "FastAPI", "demand_score": 88, "velocity": "+24.1%", "hiring_volume": "Surging"},
            {"skill": "Docker", "demand_score": 82, "velocity": "+12.0%", "hiring_volume": "Moderate"},
            {"skill": "Full Stack & Cloud", "demand_score": 90, "velocity": "+15.7%", "hiring_volume": "High"}
        ],
        "total_jobs_active": len(jobs),
        "total_candidate_bench": len(assessments)
    }