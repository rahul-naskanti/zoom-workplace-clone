from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import meeting
from .routers import meetings

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Zoom Clone Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router, prefix="/api/meetings", tags=["Meetings"])

@app.get("/")
def root():
    return {"status": "Backend running", "features": ["instant", "join", "schedule", "upcoming", "recent"]}

@app.get("/health")
def health():
    return {"db": "SQLite connected", "tables": ["meetings", "recent_meetings"]}
