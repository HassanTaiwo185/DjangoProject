from django.urls import path
from .views import CreateTeamView, GenerateTeamInviteView

urlpatterns = [
    path('create/', CreateTeamView.as_view(), name='create-team'),
    path('invite/', GenerateTeamInviteView.as_view(), name='generate-invite'),
]
