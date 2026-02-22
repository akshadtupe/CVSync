from django.shortcuts import render

# Create your views here.
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

    # 🔥 Mock AI Logic (temporary)
    score = random.randint(50, 95)
    matched_skills = ["Python", "Django"]
    missing_skills = ["Docker", "AWS"]
    suggestions = "Consider adding Docker and AWS experience."

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