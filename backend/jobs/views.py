from django.shortcuts import render

from .models import JobDescription
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsRecruiter
from .serializers import JobDescriptionSerializer
from rest_framework.permissions import AllowAny



@api_view(["POST"])
@permission_classes([IsAuthenticated, IsRecruiter])
def create_job(request):

    if JobDescription.objects.filter(recruiter=request.user).count() >= 5:
        return Response(
            {"error": "Maximum 5 jobs allowed"},
            status=400
        )

    serializer = JobDescriptionSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(recruiter=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated,IsRecruiter])
def list_jobs(request):
    jobs = JobDescription.objects.all()
    serializer = JobDescriptionSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def job_feed(request):
    jobs = JobDescription.objects.all().order_by("-created_at")
    serializer = JobDescriptionSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated,IsRecruiter])
def recruiter_job(request):
    jobs = JobDescription.objects.filter(recruiter=request.user)
    serializer = JobDescriptionSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsRecruiter])
def delete_job(request, job_id):
    try:
        job = JobDescription.objects.get(id=job_id, recruiter=request.user)
    except JobDescription.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    job.delete()
    return Response({"message": "Job deleted successfully"}, status=204)