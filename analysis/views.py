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

    # 🔹 Extract resume text (basic for now)
    resume.file.open()
    resume_text = resume.file.read().decode("utf-8", errors="ignore")
    resume.file.close()

    # 🔹 Call FastAPI
    try:
        response = requests.post(
            "http://127.0.0.1:8001/analyze",
            json={
                "resume_text": resume_text,
                "job_description": job.description,
            },
            timeout=10,
        )
        ai_data = response.json()
    except Exception as e:
        return Response({"error": "FastAPI service unavailable"}, status=500)

    # 🔹 Save analysis
    analysis = Analysis.objects.create(
        resume=resume,
        job=job,
        score=ai_data["score"],
        matched_skills=ai_data["matched_skills"],
        missing_skills=ai_data["missing_skills"],
        suggestions=ai_data["suggestions"],
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