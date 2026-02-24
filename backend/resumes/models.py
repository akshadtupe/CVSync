from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField




class Resume(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    file = models.FileField(upload_to="resumes/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    embedding = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.uploaded_at}"