from django.db import models
from resumes.models import Resume
from jobs.models import JobDescription  



# Create your models here.

class Analysis(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE)

    score = models.FloatField()
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    suggestions = models.TextField()
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("resume", "job")

    def __str__(self):
        return f"Analysis - {self.resume.user.username} - {self.score}%"