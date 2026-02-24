from rest_framework import serializers
from .models import Analysis


class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = [
            "id",
            "resume",
            "job",
            "score",
            "matched_skills",
            "missing_skills",
            "suggestions",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]