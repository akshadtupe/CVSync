from django.http import request
from django.shortcuts import render
from resumes.models import Resume
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsStudent
from .serializers import ResumeSerializer
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
# @parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    file = request.FILES.get("file")

    if not file:
        return Response({"error": "Hey! select a file"}, status=400)

    resume, created = Resume.objects.update_or_create(
        user=request.user,
        defaults={"file": file}
    )

    return Response(
        {
            "message": "Resume uploaded successfully",
            "resume_id": resume.id
        },
        status=201
    )