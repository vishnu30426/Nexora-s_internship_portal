import sys
import os
import datetime
from sqlalchemy.orm import Session

# Add parent directory to sys path so we can import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal, Base, engine
from app import models, auth
from app.routers.students import recalculate_student_metrics

def seed():
    # Recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Database seeding started...")
    
    # 1. Create Admin User
    admin_pw = auth.get_password_hash("admin123")
    admin_user = models.User(
        email="admin@antigravity.com",
        password_hash=admin_pw,
        role="admin"
    )
    db.add(admin_user)
    
    # 2. Create Mentors
    mentor_pw = auth.get_password_hash("mentor123")
    m1_user = models.User(email="mentor1@antigravity.com", password_hash=mentor_pw, role="mentor")
    m2_user = models.User(email="mentor2@antigravity.com", password_hash=mentor_pw, role="mentor")
    db.add_all([m1_user, m2_user])
    db.commit()
    
    m1_profile = models.MentorProfile(
        user_id=m1_user.id,
        name="Dr. Sarah Jenkins",
        department="AI & Robotics",
        specialization="Computer Vision & Deep Learning"
    )
    m2_profile = models.MentorProfile(
        user_id=m2_user.id,
        name="Prof. David Chen",
        department="Data Science",
        specialization="NLP & Predictive Analytics"
    )
    db.add_all([m1_profile, m2_profile])
    db.commit()
    
    # 3. Create Students
    student_pw = auth.get_password_hash("student123")
    s1_user = models.User(email="alex@antigravity.com", password_hash=student_pw, role="student")
    s2_user = models.User(email="priya@antigravity.com", password_hash=student_pw, role="student")
    s3_user = models.User(email="john@antigravity.com", password_hash=student_pw, role="student")
    db.add_all([s1_user, s2_user, s3_user])
    db.commit()
    
    # Profiles
    s1_profile = models.StudentProfile(
        user_id=s1_user.id,
        name="Alex Mercer",
        college="MIT",
        department="Computer Science",
        skills="Python, PyTorch, SQL, Pandas",
        internship_domain="Artificial Intelligence",
        start_date=datetime.date(2026, 6, 1),
        end_date=datetime.date(2026, 8, 31),
        mentor_id=m1_profile.id
    )
    
    s2_profile = models.StudentProfile(
        user_id=s2_user.id,
        name="Priya Sharma",
        college="IIT Delhi",
        department="Information Technology",
        skills="Python, React, FastAPI, Docker",
        internship_domain="Data Science",
        start_date=datetime.date(2026, 6, 15),
        end_date=datetime.date(2026, 8, 31),
        mentor_id=m2_profile.id
    )
    
    s3_profile = models.StudentProfile(
        user_id=s3_user.id,
        name="John Doe",
        college="State University",
        department="AI & Data Science",
        skills="Python, Excel, Java",
        internship_domain="Artificial Intelligence",
        start_date=datetime.date(2026, 6, 1),
        end_date=datetime.date(2026, 8, 15),
        mentor_id=m1_profile.id
    )
    
    db.add_all([s1_profile, s2_profile, s3_profile])
    db.commit()
    
    # 4. Add Attendance
    # S1: Present for 6 days
    # S2: Present for 5 days, 1 leave
    # S3: Absent/Inactive mostly (3 days absent, 2 present)
    start_date = datetime.date(2026, 6, 20)
    for day_offset in range(6):
        cur_date = start_date + datetime.timedelta(days=day_offset)
        
        # Alex (S1)
        db.add(models.Attendance(student_id=s1_profile.id, date=cur_date, status="present"))
        
        # Priya (S2)
        status = "leave" if day_offset == 2 else "present"
        db.add(models.Attendance(student_id=s2_profile.id, date=cur_date, status=status))
        
        # John (S3)
        status = "absent" if day_offset in [0, 2, 4] else "present"
        db.add(models.Attendance(student_id=s3_profile.id, date=cur_date, status=status))
        
    db.commit()
    
    # 5. Add Daily Reports
    # S1: Great detail
    db.add_all([
        models.DailyReport(
            student_id=s1_profile.id, date=datetime.date(2026, 6, 20),
            content="Today I set up the environment and loaded the CIFAR-10 dataset. Built a baseline CNN model in PyTorch and achieved 60% validation accuracy. Added comments in the repository.",
            blockers="None. Download speeds were slow but resolved.", hours_spent=8.0, status="approved",
            quality_score=92.5, sentiment=0.8, key_phrases="pytorch, dataset, validation accuracy"
        ),
        models.DailyReport(
            student_id=s1_profile.id, date=datetime.date(2026, 6, 21),
            content="- Trained the image model for 20 epochs with dynamic learning rate scheduler.\n- Solved the exploding gradient bug using gradient clipping.\n- Accuracy increased to 74%.",
            blockers="Exploding gradients were causing crashes initially but resolved now.", hours_spent=9.0, status="approved",
            quality_score=95.0, sentiment=0.9, key_phrases="epochs, validation, gradient clipping"
        )
    ])
    
    # S2: On track, typical reporting
    db.add_all([
        models.DailyReport(
            student_id=s2_profile.id, date=datetime.date(2026, 6, 20),
            content="Worked on FastAPI endpoint routers. Integrated authentication and login checks.",
            blockers="Faced minor CORS errors when connecting UI.", hours_spent=8.0, status="approved",
            quality_score=75.0, sentiment=0.2, key_phrases="fastapi, routers, login"
        ),
        models.DailyReport(
            student_id=s2_profile.id, date=datetime.date(2026, 6, 21),
            content="Designed database schemas using SQLAlchemy. Ran test insertions successfully.",
            blockers="", hours_spent=8.0, status="pending",
            quality_score=78.0, sentiment=0.4, key_phrases="sqlalchemy, schemas"
        )
    ])
    
    # S3: Short/poor quality reports
    db.add_all([
        models.DailyReport(
            student_id=s3_profile.id, date=datetime.date(2026, 6, 20),
            content="did coding today",
            blockers="errors", hours_spent=4.0, status="approved",
            quality_score=25.0, sentiment=-0.2, key_phrases="coding"
        ),
        models.DailyReport(
            student_id=s3_profile.id, date=datetime.date(2026, 6, 21),
            content="worked on model. still stuck on bugs. error in execution.",
            blockers="nothing is working.", hours_spent=5.0, status="rejected",
            quality_score=30.0, sentiment=-0.8, key_phrases="stuck, bug"
        )
    ])
    db.commit()
    
    # 6. Add Tasks
    db.add_all([
        models.Task(
            title="Develop CIFAR-10 Image Classifier",
            description="Build a CNN model to classify CIFAR-10 images. Achieve >70% accuracy.",
            assigned_to_student_id=s1_profile.id, created_by_mentor_id=m1_profile.id,
            status="completed", due_date=datetime.date(2026, 6, 25),
            submitted_at=datetime.datetime(2026, 6, 21, 16, 0),
            completed_at=datetime.datetime(2026, 6, 21, 18, 0),
            score=95.0, feedback="Fantastic execution and accuracy output."
        ),
        models.Task(
            title="FastAPI Routing and SQLite Schemas",
            description="Set up routers and model entities in SQLAlchemy for database operations.",
            assigned_to_student_id=s2_profile.id, created_by_mentor_id=m2_profile.id,
            status="submitted", due_date=datetime.date(2026, 6, 26),
            submitted_at=datetime.datetime(2026, 6, 21, 17, 30),
            submission_text="Completed FastAPI router integrations for student tables."
        ),
        models.Task(
            title="Basic Python Data Processing Script",
            description="Write a script to load a CSV and display row statistics.",
            assigned_to_student_id=s3_profile.id, created_by_mentor_id=m1_profile.id,
            status="assigned", due_date=datetime.date(2026, 6, 24)
        )
    ])
    db.commit()
    
    # Recalculate metrics for everyone
    recalculate_student_metrics(s1_profile.id, db)
    recalculate_student_metrics(s2_profile.id, db)
    recalculate_student_metrics(s3_profile.id, db)
    
    print("Database seeding completed. 1 Admin, 2 Mentors, and 3 Students created.")
    db.close()

if __name__ == "__main__":
    seed()
