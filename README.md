# Antigravity Internship Management Portal

An AI-driven, industry-level centralized portal to streamline and manage the internship lifecycle of students, mentors, and administrators. This system is designed for **Antigravity** to automate attendance tracking, report submissions, project assessments, and completions, while incorporating predictive analytics to classify intern performance risk and recommend target assignments.

---

## 🌌 Tech Stack

- **Frontend**: Single Page Application using **React.js (Vite)** styled with **TailwindCSS** and **Lucide Icons** for a premium glassmorphic dark theme.
- **Backend**: Async REST API built using **FastAPI (Python)**, mapped through **SQLAlchemy ORM**.
- **Database**: **SQLite** (Self-contained, local relational storage file).
- **AI/ML Engine**:
  - **NLP Report Quality scoring**: NLTK VADER sentiment analyzer paired with text length/structure heuristics.
  - **Performance & Risk Classifier**: Scikit-Learn **Random Forest Classifier** predicting grades (`Outstanding`, `On Track`, `At Risk`) and completion probability.
  - **Task Recommender**: TF-IDF Vectorizer + Cosine Similarity mapping student skills to learning curriculum tags.
- **PDF Engine**: **ReportLab** dynamic canvas drawer for certificates of completion with verification hashcodes.

---

## 📂 Project Structure

```text
Internship_management_nexora/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI App configuration
│   │   ├── database.py         # SQLAlchemy session configuration
│   │   ├── models.py           # Relational schemas
│   │   ├── schemas.py          # Pydantic input/output serializers
│   │   ├── auth.py             # JWT token utilities & login guards
│   │   ├── routers/            # Endpoint handlers
│   │   │   ├── auth.py         # Login & registration APIs
│   │   │   ├── students.py     # Intern logs, attendance, reports, tasks
│   │   │   ├── mentors.py      # Mentor grading, report logs approvals
│   │   │   ├── admin.py        # Mappings, programs, PDF certificates
│   │   │   └── analytics.py    # System global stats & timelines charts
│   │   └── ai/                 # Scientific models
│   │       ├── report_analyzer.py      # NLP text parser
│   │       ├── performance_predictor.py# Scikit-learn Classifier
│   │       └── task_recommender.py     # Cosine similarity matching
│   ├── scripts/
│   │   └── seed_db.py          # DB reset, seeder, & ML bootstrap pre-trainer
│   ├── data/
│   │   └── internship.db       # Relational SQLite file (auto-generated)
│   ├── tests/
│   │   └── test_ai_models.py   # AI pipeline validations
│   └── run.py                  # Backend launcher
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT session context manager
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Welcome index
│   │   │   ├── LoginPage.jsx         # Credentials input (tabbed autofills)
│   │   │   ├── RegisterPage.jsx      # Intern & Mentor enrollment
│   │   │   ├── StudentDashboard.jsx  # Student tasks, reports, KPI indicators
│   │   │   ├── MentorDashboard.jsx   # Mapping indicators, reviews, grades
│   │   │   └── AdminDashboard.jsx    # System controls, PDF generators
│   │   ├── index.css           # Custom glassmorphic styles
│   │   ├── App.jsx             # React routing setup
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## 🚀 Installation & Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Set Up Backend FastAPI Server
Open a terminal in the `backend/` directory:
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed the database and train the initial AI prediction models
python scripts/seed_db.py

# Run FastAPI backend
python run.py
```
The server starts on `http://127.0.0.1:8000`. Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Set Up Frontend React Server
Open a separate terminal in the `frontend/` directory:
```bash
cd frontend

# Install package dependencies
npm install

# Run the local Vite dev server
npm run dev
```
Open your browser to `http://localhost:3000`.

---

## 🔐 Demo Credentials (Autofill Enabled)
For easy demonstration during viva/evaluation:
- **System Administrator**: `admin@antigravity.com` / `admin123`
- **Academic Mentor**: `mentor1@antigravity.com` / `mentor123`
- **Student Intern (Outstanding)**: `alex@antigravity.com` / `student123`
- **Student Intern (On Track)**: `priya@antigravity.com` / `student123`
- **Student Intern (At Risk)**: `john@antigravity.com` / `student123`

---

## 📊 AI / Data Science Architectures

### 1. NLP Daily Report Scoring
- Evaluates character length log-normalized against an optimal 60-word daily report.
- Checks structural patterns for formatting indicators like lists or bullet points.
- Runs sentiment calculations (using NLTK VADER with a custom dictionary fallback).
- Combines metrics: `Score = 40% Length + 30% Structure + 30% Sentiment`.

### 2. Intern Performance Classifier
- Gathers intern features: attendance percentage, task completion rate, average task scores, report quality averages, sentiment scores, late submission ratio.
- Trains a Scikit-Learn **Random Forest Classifier** to classify risk:
  - `Outstanding`: Strong scores, high attendance, zero late submits.
  - `On Track`: Average meeting parameters.
  - `At Risk`: Flags students falling below 75% attendance or 60% completion.

### 3. Cosine Similarity Recommender
- Fits a `TfidfVectorizer` to a pool of training curriculum tasks.
- Computes Cosine Similarity against student skills input.
- Displays the top 3 best matching tasks that are not yet marked completed.

---

## 🧪 Validating the AI Code
You can run automated AI pipeline tests using:
```bash
cd backend
python tests/test_ai_models.py
```
This runs assertions against the report analyzer, the classifier risk output, and skills matching.
