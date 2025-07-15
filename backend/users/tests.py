from django.test import TestCase
from .models import User
from .serializers import CreateUser

# Create your tests here.
class CreateUserSerializerTest(TestCase):

    # testing create user serializer (no invitation link) with valid data
    # Should assign role be "Team leader" and set is_staff to True
    def test_create_team_leader_valid_input(self):
        data = {
            "username": "leader",
            "email": "leader@gmail.com",
            "password": "Password123",
        }
        serializer = CreateUser(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()
        self.assertEqual(user.role, "Team leader")
        self.assertTrue(user.is_staff)

     # testing create user serializer (no invitation link) with invalid data
     #should serialiser  validation be false or not 
    def test_create_team_leader_invalid_input(self):
        data = {
            "username": "testleader",
            "email": "leader@gmail.com",
           
        }
        serializer = CreateUser(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

        



