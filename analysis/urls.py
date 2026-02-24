from django.urls import path
from .views import run_analysis, analysis_history

urlpatterns = [
    path("run-analysis/", run_analysis, name="run-analysis"),
    path("history/", analysis_history, name="analysis-history"),
]