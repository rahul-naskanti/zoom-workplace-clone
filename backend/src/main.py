from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import meeting, user
from .routers import meetings, auth
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Zoom Clone Backend")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router, prefix="/api/meetings", tags=["Meetings"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"status": "Backend running", "features": ["instant", "join", "schedule", "upcoming", "recent", "auth"]}

@app.get("/health")
def health():
    return {"db": "SQLite connected", "tables": ["meetings", "recent_meetings", "users"]}
