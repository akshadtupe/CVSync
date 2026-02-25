from rest_framework import serializers
from .models import Analysis


class AnalysisSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="resume.user.username",
        read_only=True
    )

    class Meta:
        model = Analysis
        fields = [
            "id",
            "student_name",
            "score",
            "matched_skills",
            "missing_skills",
            "suggestions",
            "created_at",
        ]