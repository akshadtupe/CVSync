import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsRecruiter, IsStudent
from resumes.models import Resume
from jobs.models import JobDescription
from .models import Analysis
from .serializers import AnalysisSerializer
import requests
from PyPDF2 import PdfReader





@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def run_analysis(request):
    job_id = request.data.get("job_id")

    try:
        resume = request.user.resume
    except:
        return Response({"error": "Resume not found"}, status=404)
    
    try:
        job = JobDescription.objects.get(id=job_id)
    except JobDescription.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)
    
    if Analysis.objects.filter(resume=resume, job=job).exists():
        return Response(
            {"error": "Already Appplied !!"},
            status=400
        )

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
    analysis, created = Analysis.objects.update_or_create(
    resume=resume,
    job=job,
    defaults={
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    },

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

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsRecruiter])
def job_ranking(request, job_id):
    try:
        job = JobDescription.objects.get(id=job_id, recruiter=request.user)
    except JobDescription.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    analyses = (
        Analysis.objects
        .filter(job=job)
        .select_related("resume__user")
        .order_by("-score")
    )

    serializer = AnalysisSerializer(analyses, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_applications(request):
    analyses = Analysis.objects.filter(
        resume__user=request.user
    ).order_by("-created_at")

    data = [
        {
            "job_title": a.job.title,
            "score": a.score,
            "suggestions": a.suggestions,
            "created_at": a.created_at,
        }
        for a in analyses
    ]

    return Response(data)