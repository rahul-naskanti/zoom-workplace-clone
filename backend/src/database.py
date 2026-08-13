from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Default to sqlite if not provided in .env
DEFAULT_DB = f"sqlite:///{os.path.join(BASE_DIR, 'zoom_clone.db')}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
