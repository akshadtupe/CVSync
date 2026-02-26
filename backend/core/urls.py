"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import protected_view
from accounts.views import student_dashboard, recruiter_dashboard
from accounts.serializers import CustomTokenObtainPairView
from resumes.views import upload_resume
from jobs.views import create_job, delete_job, list_jobs, recruiter_job   
from analysis.views import run_analysis
from analysis.views import analysis_history
from django.urls import include
from analysis.views import job_ranking
from accounts.views import register_user
from jobs.views import job_feed
from jobs.views import recruiter_job
from jobs.views import delete_job   
from analysis.views import my_applications
from accounts.views import profile_view, update_resume

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.http import HttpResponse
def home(request):
    return HttpResponse("Welcome to CVSync API")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/protected/', protected_view),
    path('api/student/', student_dashboard),
    path('api/recruiter/', recruiter_dashboard),
    path("api/upload-resume/", upload_resume),
    path("api/create-job/", create_job),
    path("api/run-analysis/", run_analysis),
    path("api/analysis-history/", analysis_history),
    path("api/analysis/", include("analysis.urls")),
    path("api/job/<int:job_id>/ranking/",job_ranking),
    path("api/register/", register_user),
    # path("api/jobs/", list_jobs), #public feed
    path("api/jobs/", job_feed), #apply and analyze(students)
    path("api/recruiter/jobs/", recruiter_job), #recruiter specific jobs
    path("api/job/<int:job_id>/delete/", delete_job),
    path("api/my_applications/", my_applications), #student specific analysis history
    path("api/profile/", profile_view),
    path("api/update-resume/", update_resume),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)