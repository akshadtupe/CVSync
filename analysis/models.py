from django.db import models

# Create your models here.

class Analysis(models.Model):
    resume = models.ForeignKey(
        "resumes.Resume",
        on_delete=models.CASCADE,
        related_name="analyses"
    )

    job = models.ForeignKey(
        "jobs.JobDescription",
        on_delete=models.CASCADE,
        related_name="analyses"
    )

    score = models.FloatField()

    matched_skills = models.JSONField(default=list)

    missing_skills = models.JSONField(default=list)

    suggestions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis - {self.resume.user.username} - {self.score}%"