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