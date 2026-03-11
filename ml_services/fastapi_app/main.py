from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
from typing import List
import re
import threading


COMMON_SKILLS = {
    "python",
    "django",
    "fastapi",
    "flask",
    "postgresql",
    "sql",
    "machine learning",
    "deep learning",
    "data analysis",
    "pandas",
    "numpy",
    "react",
    "javascript",
    "docker",
    "aws",
    "git",
    "rest api",
}


def normalize_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_skills(text):
    normalized = normalize_text(text)
    found = set()

    for skill in COMMON_SKILLS:
        if " " in skill:
            if skill in normalized:
                found.add(skill)
        else:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, normalized):
                found.add(skill)

    return list(found)


env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

# ✅ DEPLOY SAFE CHANGE (lazy model loading)
model = None


def load_model():
    global model
    model = SentenceTransformer("all-MiniLM-L6-v2")


@app.on_event("startup")
def startup_event():
    threading.Thread(target=load_model).start()


# Schemas
class TextInput(BaseModel):
    text: str


class SuggestInput(BaseModel):
    resume_text: str
    job_description: str


class SimilarityInput(BaseModel):
    resume_embedding: List[float]
    job_embedding: List[float]
    resume_text: str
    job_text: str


# Embedding endpoint
@app.post("/embed")
def generate_embedding(data: TextInput):

    if model is None:
        return {"error": "model loading"}

    embedding = model.encode(data.text).tolist()
    return {"embedding": embedding}


# Similarity endpoint
@app.post("/similarity")
def compute_similarity(data: SimilarityInput):

    resume_vec = np.array(data.resume_embedding).reshape(1, -1)
    job_vec = np.array(data.job_embedding).reshape(1, -1)

    similarity = cosine_similarity(resume_vec, job_vec)[0][0]
    score = float(round(float(similarity) * 100, 2))

    resume_skills = extract_skills(data.resume_text)
    job_skills = extract_skills(data.job_text)

    matched = list(set(resume_skills) & set(job_skills))
    missing = list(set(job_skills) - set(resume_skills))

    return {
        "score": score,
        "matched_skills": matched,
        "missing_skills": missing
    }


# Suggestions endpoint (LLM)
@app.post("/suggest")
def generate_suggestions(data: SuggestInput):

    prompt = f"""
    You are a resume optimization assistant.

    Resume:
    {data.resume_text[:2000]}

    Job Description:
    {data.job_description[:2000]}

    suggest specific improvements to help this resume better match the job description.
    Return ONLY 3 short bullet points.
    Max 15 words each.
    No explanation.
    
    """

    llm_response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    suggestions_text = llm_response.choices[0].message.content

    return {"suggestions": suggestions_text}