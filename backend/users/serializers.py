from rest_framework import serializers
from .models import User

class CreateUser(serializers.ModelSerializer):
    inviteToken = serializers.CharField(write_only= True , required=False)
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            "password":{"write_only":True}
            
        }

    def create(self, validated_data):
        inviteToken = validated_data.pop("inviteToken",None)
        if inviteToken :
            validated_data["role"] = "Team member"
            
        else:
           validated_data["role"] = "Team leader"
        user = User.objects.create_user(**validated_data)
        return user 


