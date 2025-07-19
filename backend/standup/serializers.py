from rest_framework import serializers
from .models import StandUp

class StandUpSerializer(serializers.ModelSerializer):
    class Meta :
        model = StandUp
        fields = ["title","progress","id","created_at","user"]
        read_only_fields = ["id","user","created_at"]