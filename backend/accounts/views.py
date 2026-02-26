from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "message": "You are authenticated",
        "user": request.user.username,
        "role": request.user.role
    })
from .permissions import IsStudent, IsRecruiter


@api_view(["GET"])
@permission_classes([IsStudent])
def student_dashboard(request):
    return Response({
        "message": "Welcome Student",
        "user": request.user.username
    })


@api_view(["GET"])
@permission_classes([IsRecruiter])
def recruiter_dashboard(request):
    return Response({
        "message": "Welcome Recruiter",
        "user": request.user.username
    })

@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=201)

    return Response(serializer.errors, status=400)

from resumes.models import Resume
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    data = {
        "username": user.username,
        "role": user.role,
    }

    if user.role == "student":
        try:
            resume = user.resume
            data["resume"] = resume.file.url
        except Resume.DoesNotExist:
            data["resume"] = None

    return Response(data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_resume(request):
    user = request.user

    if user.role != "student":
        return Response({"error": "Only students can upload resume"}, status=403)

    file = request.FILES.get("file")

    if not file:
        return Response({"error": "No file provided"}, status=400)

    resume, created = Resume.objects.get_or_create(user=user)
    resume.file = file
    resume.save()

    return Response({"message": "Resume updated successfully"})