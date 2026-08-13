from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import hashlib
from ..database import get_db
from ..models.user import User

router = APIRouter()

# PyDantic validation schemas
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    # Hash password and save new user
    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Account created successfully", "user": {"id": new_user.id, "username": new_user.username, "email": new_user.email}}

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    
    if user.password_hash != hash_password(data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
        
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

class ChangePassword(BaseModel):
    email: str
    current_password: str
    new_password: str

@router.post("/change-password")
def change_password(data: ChangePassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found."
        )
    
    # Verify current password
    if user.password_hash != hash_password(data.current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )
    
    # Update to new password
    user.password_hash = hash_password(data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully."}
