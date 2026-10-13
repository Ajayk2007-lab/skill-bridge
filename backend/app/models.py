from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="student")
    organization = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PasswordResetOTP(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), index=True, nullable=False)
    otp = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(10), nullable=False)

class CandidateAssessment(Base):
    __tablename__ = "candidate_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(150), index=True, nullable=False)
    category = Column(String(100), nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    score_percentage = Column(Float, nullable=False)
    readiness_band = Column(String(50), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)