from rest_framework import serializers
from .models import User
#from teams.models import TeamInvite
from django.utils import timezone


#Creating user serializer for validation
class CreateUser(serializers.ModelSerializer):
    invite_token = serializers.UUIDField(write_only= True , required=False)
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            "password":{"write_only":True}
            
        }

    #validating invite token to check if existed and maybe it already expires
    def validate_invite_token(self,value):
        if not value:
            return None
        try:
            invite = TeamInvite.objects.get(token=value,used=False)
            if invite.expires_at and invite.expires_at < timezone.now():
                raise serializers.ValidationError("Invitaion link already expired")
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

          
       
        return user 


