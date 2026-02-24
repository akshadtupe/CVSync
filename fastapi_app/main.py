from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

# Load model once at startup
model = SentenceTransformer("all-MiniLM-L6-v2")


class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str


@app.post("/analyze")
def analyze(data: AnalysisRequest):
    # Generate embeddings
    resume_embedding = model.encode([data.resume_text])
    job_embedding = model.encode([data.job_description])

    # Compute cosine similarity
    similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]

    score = float(round(float(similarity) * 100, 2))

    return {
        "score": score,
        "matched_skills": [],
        "missing_skills": [],
        "suggestions": "Semantic similarity-based scoring applied."
    }