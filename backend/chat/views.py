from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAdminUser ,AllowAny ,IsAuthenticated
from .serializers import RoomSerializer , MessageSerializer
from .models import Room ,Message
from users.models import User

# Create your views here.
class RoomViews(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(members__team=user.team).distinct()

class MessageViews(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(room__members__team=user.team).distinct()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    
   