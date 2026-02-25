from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.contrib.auth import get_user_model  
from resumes.models import Resume

User = get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    resume = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "password", "role", "resume"]

    def create(self, validated_data):
        resume_file = validated_data.pop("resume", None)

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            role=validated_data["role"],
        )

        # If student → require resume
        if user.role == "student":
            if not resume_file:
                raise serializers.ValidationError(
                    {"resume": "Resume is required for students"}
                )

            Resume.objects.create(
                user=user,
                file=resume_file
            )

        return user
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["role"] = user.role
        token["username"] = user.username

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer