from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from ..database import Base
import uuid

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meeting_code = Column(String, unique=True, index=True) # 857-518-2066
    invite_link = Column(String)
    topic = Column(String, default="Rahul's Zoom Meeting")
    description = Column(Text, nullable=True)
    date = Column(String) # 13/08/2026
    time = Column(String) # 10:00 AM
    duration = Column(String, default="30 min")
    timezone = Column(String, default="(GMT+5:30) India")
    passcode = Column(String, default="5yDvZV")
    status = Column(String, default="upcoming") # upcoming, ongoing, ended
    created_at = Column(DateTime, default=datetime.utcnow)
    scheduled_at = Column(DateTime, default=datetime.utcnow)

class RecentMeeting(Base):
    __tablename__ = "recent_meetings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meeting_code = Column(String)
    topic = Column(String)
    joined_at = Column(DateTime, default=datetime.utcnow)
