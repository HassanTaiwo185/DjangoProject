from django.test import TestCase
from users.models import User
from .models import StandUp
from .serializers import StandUpSerializer

# Create your tests here.
class TestStandUpSerializer(TestCase):
    def setUp(self):
       self.user = User.objects.create_user(username="taiwo",password="pas1234",email = "taiwp@gmail.com")
       
       # testing standup serializer if its meet expected outcome
    def test_valid_serializer(self):
        standup = StandUp.objects.create(title="Sync", progress="50%", user=self.user)
        serializer = StandUpSerializer(standup)
        self.assertEqual(serializer.data["title"],"Sync")
        self.assertEqual(serializer.data["progress"], "50%")
        self.assertEqual(serializer.data["user"], self.user.id)
        self.assertIn("created_at", serializer.data)
       
    # testing standup serializer with valid data and verify expected outcome
    def test_valid_data_deserialization(self):
        data = {
            "title": "Update",
            "progress": "80%",
            "user": self.user.id
        }
        serializer = StandUpSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
      
      # testing standup serializer with missing required fields and check if it will not validate
    def test_missing_required_fields(self):
        data = {"progress": "20%"}
        serializer = StandUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)


    # testing standup serializer if read only fields is enfored
    def test_read_only_fields_enforced(self):
        data = {
            "title": "Final",
            "progress": "90%",
            "user": self.user.id,
            "id": "some-fake-id",
            "created_at": "2023-01-01T00:00:00Z"
        }
        serializer = StandUpSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("id", serializer.validated_data)
        self.assertNotIn("created_at", serializer.validated_data)

    