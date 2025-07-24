from rest_framework import serializers
from .models import User
from teams.models import TeamInvite ,Team
from django.utils import timezone


#Creating user serializer for validation
class CreateUser(serializers.ModelSerializer):
    invite_token = serializers.UUIDField(write_only= True , required=False)
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'avatar',
            'role',
            'is_active',
            'is_staff',
            'invite_token'
        ]
        read_only_fields = ['role', 'is_active', 'is_staff']
        extra_kwargs = {
            "password":{"write_only":True},
            
            
        }

    #validating invite token to check if existed and maybe it already expires
    def validate_invite_token(self,value):
        if not value:
            return None
        try:
            invite = TeamInvite.objects.get(token=value,used=False)
            
            if invite.expires_at and invite.expires_at < timezone.now():
                raise serializers.ValidationError("Invitaion link already expired")
            
            if invite.used == True:
                raise serializers.ValidationError("Invitaion link Has been used")
                
        except TeamInvite.DoesNotExist:
            raise serializers.ValidationError("Invitaion does not exist")
        
        return invite

    # creating user and assigning role based on invite link or not 
    def create(self, validated_data):
        invite_token = validated_data.pop("invite_token",None)
        invite = self.validate_invite_token(invite_token) if invite_token else None

        #Has invitation link :Create team mem and set is staff to false 
        if invite :
            validated_data["role"] = "Team member"
            validated_data['is_staff'] = False
            invite.used = True
            invite.save()

            user = User.objects.create_user(**validated_data)
            user.team = invite.team
            user.save()


        #No invitation link :Create Team leader and set is staff to True  
        else:
           validated_data["role"] = "Team leader"
           validated_data["is_staff"] = True
           user = User.objects.create_user(**validated_data)
           
           #CREATE TEAM AS user sign sign in with no invitation link
           team = Team.objects.create(name=f"{user.username}'s Team", created_by=user)
           user.team = team
           user.save()

          
       
        return user 
    
    # serializer to update user profile
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'is_staff', 'username', 'email']
        read_only_fields = ['is_staff'] 
     
     # serialiser forgot password
class ForgotPasswordSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username","password","confirm_password"]
        
        def validate(self,data):
            password = data.get("password")
            confirm_password = data.get("confirm_pasword")
            
            if password != confirm_password:
               raise serializers.ValidationError("Passwords do not match.")
            return data
            
        def save(self,**kwargs):
            username = self.validated_data["username"]
            password = self.validated_data["password"]
            
            try:
              user = User.objects.get(username=username)
            except User.DoesNotExist:
              raise serializers.ValidationError("User does not exist.")

            user.set_password(password)
            user.save()
            return user

            



