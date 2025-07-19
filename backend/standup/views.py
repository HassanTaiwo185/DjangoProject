from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from .serializers import StandUpSerializer
from .models import StandUp

# Create your views here.
class CreateStandUp(generics.CreateAPIView):
    queryset = StandUp.objects.all()
    serializer_class = StandUpSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
       serializer.save(user=self.request.user)
       
class EditStandUp(generics.UpdateAPIView):
    queryset = StandUp.objects.all()
    serializer_class = StandUpSerializer
    permission_classes = [IsAuthenticated]
    
class DeleteStandUp(generics.DestroyAPIView):
    queryset = StandUp.objects.all()
    serializer_class = StandUpSerializer
    permission_classes = [IsAuthenticated,IsAdminUser]
    

class ListStandUp(generics.ListAPIView):
    serializer_class = StandUpSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
     user = self.request.user
     return StandUp.objects.filter(user__team=user.team)

    
class StandUpDetail(generics.RetrieveAPIView):
    queryset = StandUp.objects.all()
    serializer_class = StandUpSerializer
    permission_classes = [IsAuthenticated]


    
