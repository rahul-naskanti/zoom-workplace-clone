from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import random
from ..database import get_db
from ..models.meeting import Meeting, RecentMeeting
from ..schemas.meeting import ScheduleMeetingIn, InstantMeetingIn

router = APIRouter()

import os

def gen_code():
    return f"{random.randint(100,999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}"

def gen_link(code):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return f"{frontend_url}/meeting/{code}"

# FEATURE 2: Instant Meeting Creation
@router.post("/instant")
def create_instant(data: InstantMeetingIn, db: Session = Depends(get_db)):
    code = gen_code()
    m = Meeting(
        meeting_code=code,
        invite_link=gen_link(code),
        topic=data.topic,
        date=datetime.now().strftime("%d/%m/%Y"),
        time=datetime.now().strftime("%I:%M %p"),
        status="ongoing"
    )
    db.add(m); db.commit(); db.refresh(m)
    return m

# FEATURE 4: Schedule Meeting
@router.post("/schedule")
def schedule_meeting(data: ScheduleMeetingIn, db: Session = Depends(get_db)):
    code = gen_code()
    m = Meeting(
        meeting_code=code,
        invite_link=gen_link(code),
        topic=data.topic,
        description=data.description,
        date=data.date,
        time=data.time,
        duration=data.duration,
        timezone=data.timezone,
        status="upcoming"
    )
    db.add(m); db.commit(); db.refresh(m)
    return m

# FEATURE 3: Join Meeting - Validate
@router.get("/validate/{meeting_code}")
def validate_meeting(meeting_code: str, db: Session = Depends(get_db)):
    m = db.query(Meeting).filter(Meeting.meeting_code == meeting_code).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    # log to recent
    recent = RecentMeeting(meeting_code=meeting_code, topic=m.topic)
    db.add(recent); db.commit()
    return {"valid": True, "meeting": m}

# FEATURE 1: Landing Dashboard - Upcoming
@router.get("/upcoming")
def upcoming_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).filter(Meeting.status == "upcoming").order_by(Meeting.scheduled_at.desc()).all()

# FEATURE 1: Landing Dashboard - Recent
@router.get("/recent")
def recent_meetings(db: Session = Depends(get_db)):
    return db.query(RecentMeeting).order_by(RecentMeeting.joined_at.desc()).limit(10).all()

@router.get("/")
def all_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()
