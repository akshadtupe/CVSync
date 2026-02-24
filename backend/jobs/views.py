from django.shortcuts import render

from .models import JobDescription
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsRecruiter
from .serializers import JobDescriptionSerializer



@api_view(["POST"])
@permission_classes([IsAuthenticated, IsRecruiter])
def create_job(request):
    serializer = JobDescriptionSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(recruiter=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def list_jobs(request):
    jobs = JobDescription.objects.all()
    serializer = JobDescriptionSerializer(jobs, many=True)
    return Response(serializer.data)