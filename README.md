# CVSync 

CVSync is an AI‑powered Resume Analysis and Job Matching platform that helps users evaluate their resumes against job descriptions, receive similarity scores, and get intelligent improvement suggestions.

---

## 🌐 Live Demo

https://cv-sync.vercel.app/

## 🌐Video Demo
https://www.linkedin.com/posts/akshad-tupe-185785290_machinelearning-django-react-ugcPost-7440265698154795009-23IG?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEaX_rUB3hq255BBL4DdyQLrbuVfSb3vsMU

---

## ✨ Features

* User Authentication (Register / Login using JWT)
* Resume Upload & Parsing
* Job Description Matching
* Resume ↔ Job Similarity Score
* AI Suggestions for Resume Improvement
* Role Based Users (Student / Recruiter)
* Full Stack Deployment using Docker + Render

---

## AI / ML Capabilities

* Sentence Embeddings using SentenceTransformers
* Cosine Similarity Matching
* LLM Suggestions using GROQ API

---

## Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* Axios

### Backend

* Django
* Django REST Framework
* JWT Authentication
* PostgreSQL

### ML Service

* FastAPI
* Sentence Transformers
* Scikit Learn

### Deployment

* Vercel
* Docker
* Render Cloud Platform

---

## 📁 Project Structure

```
CVSync/
│
├── backend/          # Django API
├── frontend/         # React UI
├── ml_services/      # FastAPI ML microservice
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone Repository

```
git clone https://github.com/akshadtupe/cvsync.git
cd cvsync
```

### 2️⃣ Backend Setup

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend Setup

```
cd frontend/cvsync-ui
npm install
npm run dev
```

### 4️⃣ ML Service Setup

```
cd ml_services
pip install -r requirements.txt
uvicorn fastapi_app.main:app --reload
```

---

## 🐳 Docker Setup

```
docker-compose up --build

```

---


## Deployment Architecture

* Frontend → Vercel
* Backend → Render Web Service
* ML Service → Render Web Service
* Database → Render PostgreSQL

---

## Future Improvements

* Resume PDF Highlighting
* Recruiter Dashboard
* Resume Version Tracking
* RAG based Job Recommendations
* Model Optimization & Caching

---

## 👨‍💻 Author

Akshad

---

