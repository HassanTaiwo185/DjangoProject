from django.test import TestCase
from users.models import User
from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer

# testing teams serializer 
class TeamSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner", email="owner@example.com", password="pass123"
        )

  # testing with valid data by giving all required fields
    def test_team_serializer_valid_data(self):
        team = Team.objects.create(name="My Team", created_by=self.user)
        serializer = TeamSerializer(team)

        self.assertEqual(serializer.data["name"], "My Team")
        self.assertEqual(serializer.data["created_by"], self.user.id)

     # testing with invalid data by missing all required fields
    def test_team_serializer_invalid_data(self):
        # name is required but missing 
        data = {"name": ""}  
        serializer = TeamSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)


# testing team invite serialiser 
class TeamInviteSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="leader", email="leader@example.com", password="pass123"
        )
        self.team = Team.objects.create(name="Cool Team", created_by=self.user)

    # testing with valid data by giving all required fields
    def test_team_invite_serializer_valid_data(self):
        invite = TeamInvite.objects.create(
            team=self.team, invitee_email="test@example.com"
        )
        serializer = TeamInviteSerializer(invite)

        self.assertEqual(serializer.data["team"], self.team.id)
        self.assertEqual(serializer.data["invitee_email"], "test@example.com")
        self.assertIn("token", serializer.data)
        self.assertFalse(serializer.data["used"])

    # testing with invalid data by missing all required fields
    def test_team_invite_serializer_invalid_data(self):
        # Missing required invitee_email field
        data = {"team": self.team.id}
        serializer = TeamInviteSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("invitee_email", serializer.errors)
