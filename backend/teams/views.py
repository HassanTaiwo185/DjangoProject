from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny , IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Team, TeamInvite
from .serializers import TeamSerializer, TeamInviteSerializer



# Create your views here.

# Create Team View
class CreateTeamView(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# Generate Invite View
class GenerateTeamInviteView(generics.CreateAPIView):
    serializer_class = TeamInviteSerializer
    permission_classes = [IsAuthenticated,IsAdminUser]

    def create(self, request, *args, **kwargs):
        team_id = request.data.get("team")
        invitee_email = request.data.get("invitee_email")

        # checking if team if and invitee_email are provided
        if not team_id or not invitee_email:
            return Response(
                {"error": "Both 'team' and 'invitee_email' are required."}
            )
        
        # checking if team exist
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found."}, status=404)

          # creating team invite
        invite = TeamInvite.objects.create(team=team, invitee_email=invitee_email)
        invite_link = f"https://microflow.com/signup/?invite_token={invite.token}"

        # Email invitee
        send_mail(
            subject="You're invited to join a team on MicroFlow!",
            message=f"Click here to join the team '{team.name}': {invite_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[invitee_email],
            fail_silently=False,
        )

        # Email inviter
        send_mail(
            subject="Invite link created successfully",
            message=f"You invited {invitee_email}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[request.user.email],
            fail_silently=False,
        )

        serializer = self.get_serializer(invite)
        return Response({
            "invite_link": invite_link,
            "invite": serializer.data
        })
