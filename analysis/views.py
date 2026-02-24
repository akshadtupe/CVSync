import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsStudent
from resumes.models import Resume
from jobs.models import JobDescription
from .models import Analysis
from .serializers import AnalysisSerializer
import requests
from PyPDF2 import PdfReader





@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def run_analysis(request):
    resume_id = request.data.get("resume_id")
    job_id = request.data.get("job_id")

    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
        job = JobDescription.objects.get(id=job_id)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=404)
    except JobDescription.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    #Extract resume text 
    resume.file.open()
    reader=PdfReader(resume.file)
    resume_text=""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            resume_text+=text

    resume.file.close()

    #Call FastAPI
    #Embedding Caching

    # Resume embedding
    if not resume.embedding:
        embed_response = requests.post(
            "http://127.0.0.1:8001/embed",
            json={"text": resume_text},
        )
        resume.embedding = embed_response.json()["embedding"]
        resume.save()

    # Job embedding
    if not job.embedding:
        embed_response = requests.post(
            "http://127.0.0.1:8001/embed",
            json={"text": job.description},
        )
        job.embedding = embed_response.json()["embedding"]
        job.save()

    #SIMILARITY
    similarity_response = requests.post(
        "http://127.0.0.1:8001/similarity",
        json={
            "resume_embedding": resume.embedding,
            "job_embedding": job.embedding,
            "resume_text": resume_text,
            "job_text": job.description,
        },
    )

    score = similarity_response.json()["score"]
    matched_skills = similarity_response.json()["matched_skills"]
    missing_skills = similarity_response.json()["missing_skills"]


    #Suggestions (LLM)

    suggest_response = requests.post(
        "http://127.0.0.1:8001/suggest",
        json={
            "resume_text": resume_text,
            "job_description": job.description,
        },
    )

    suggestions = suggest_response.json()["suggestions"]

    #Save analysis
    analysis = Analysis.objects.create(
        resume=resume,
        job=job,
        score=score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        suggestions=suggestions,
    )

    serializer = AnalysisSerializer(analysis)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analysis_history(request):
    user = request.user

    if user.role == "student":
        analyses = Analysis.objects.filter(resume__user=user)
    elif user.role == "recruiter":
        analyses = Analysis.objects.filter(job__recruiter=user)
    else:
        return Response({"error": "Invalid role"}, status=403)

    serializer = AnalysisSerializer(analyses, many=True)
    return Response(serializer.data)