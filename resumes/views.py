from django.http import request
from django.shortcuts import render
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
    print("FILES:", request.FILES)
    serializer = ResumeSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)