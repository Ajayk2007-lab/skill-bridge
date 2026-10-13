from pydantic import BaseModel
from typing import Optional

class UserRegisterSchema(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str = "student"
    organization: Optional[str] = "Delhi Technological University"

class UserLoginSchema(BaseModel):
    email: str
    password: str

class ForgotPasswordSchema(BaseModel):
    email: str

class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict