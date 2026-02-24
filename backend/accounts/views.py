from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


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