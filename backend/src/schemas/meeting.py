from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScheduleMeetingIn(BaseModel):
    topic: str = "Rahul's Zoom Meeting"
    description: Optional[str] = None
    date: str = "13/08/2026"
    time: str = "10:00 AM"
    duration: str = "30 min"
    timezone: str = "(GMT+5:30) India"

class InstantMeetingIn(BaseModel):
    topic: Optional[str] = "Instant Meeting"

class MeetingOut(BaseModel):
    id: str
    meeting_code: str
    invite_link: str
    topic: str
    date: str
    time: str
    duration: str
    status: str
    passcode: str
    class Config:
        from_attributes = True
