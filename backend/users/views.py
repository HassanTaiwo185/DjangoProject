from django.shortcuts import render
from rest_framework import generics , status
from .serializers import CreateUser ,UpdateUserSerializer
from rest_framework.permissions import AllowAny , IsAuthenticated , IsAdminUser
from .models import User ,ConfirmationCode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
import random
from rest_framework.parsers import MultiPartParser, FormParser


# Generating 6 digits confirmation code
def generate_confirmation_code():
    return ''.join(str(random.randint(0, 9)) for _ in range(6))

# Create your views here.
class CreateUserViews(generics.CreateAPIView):
    serializer_class = CreateUser
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        code = generate_confirmation_code()
        ConfirmationCode.objects.create(user=user, code=code)

        send_mail(subject="Email Confirmatiom",
                  message=f"Your email confirmation is {code}",
                  from_email=settings.DEFAULT_FROM_EMAIL,
                  recipient_list=[user.email],
                  fail_silently=False,)
        

# Confirming user email and activating user acoount 
class ConfirmCode(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        username = request.data.get('username')
        code = request.data.get('code')

        # Getting user and related confirmation code and handling errors
        try :
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error":"User not found."})

        try :
            confirmation_code = ConfirmationCode.objects.get(user=user)
        except ConfirmationCode.DoesNotExist:
            return Response({"error" : "No confirmation code found."})


        # checking if user is already active
        if user.is_active:
             return Response({"Error" :"User is already active."})

        # checking if code provided by user is match with the one in database
        if  confirmation_code.code != code:
            return Response({"error": "Invalid confirmation code."})

        # confirmatioming if provided code has not expired 
        if confirmation_code.is_expired():
           confirmation_code.delete()
           return Response({"error": "Confirmation code has expired."})

        # Activate user and delete confirmation code
        user.is_active = True
        user.save()
        confirmation_code.delete()

        return Response({"message": "Account activated successfully"})

# Edit user profile
class EditUser(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAdminUser,IsAuthenticated]

# Delete User profile
class DeleteUser(generics.DestroyAPIView):
    serializer_class = CreateUser
    queryset = User.objects.all()
    permission_classes = [IsAdminUser,IsAuthenticated]







