from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, students, mentors, admin, analytics

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI App
app = FastAPI(
    title="Nexora's Internship Portal API",
    description="Backend services, NLP report parsing, and ML student performance predictions.",
    version="1.0.0"
)

# CORS configurations for frontend communication
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(auth.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(mentors.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "portal": "Nexora's Internship Portal",
        "docs_url": "/docs"
    }
