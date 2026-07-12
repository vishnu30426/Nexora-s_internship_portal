import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ensure the data directory exists
os.makedirs("data", exist_ok=True)

# Database connection URL (reads environment variable, fallbacks to SQLite)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/internship.db")

# Fix for PostgreSQL connection strings that might use postgres:// instead of postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Dynamically set connection arguments based on database engine
is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

# Engine configuration
engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model class
Base = declarative_base()

# Dependency to inject DB session into endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
