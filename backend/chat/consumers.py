from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
import json
from django.utils.timesince import timesince
from .models import Message , Room
from users.models import User

class ChatConsumer(AsyncJsonWebsocketConsumer):
    # connecting to websocket
    async def connect(self):
        self.room_uuid = self.scope['url_route']['kwargs']['room_uuid']
        self.room_group_name = f"chat{self.room_uuid}"
        self.user = self.scope['user']
        
        await self.get_room()
        
        if self.room is None:
          return await self.close()

        await self.channel_layer.group_add(self.room_group_name,self.channel_name)
        await self.accept()
        
        # disconnecting 
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name,self.channel_name)
        await self.set_room_closed()
        
        # receiving data from frontend and turing it to python 
    async def receive(self , text_data):
        data = json.loads(text_data)
        type = data.get('type')
        content = data.get('content')
        sender = self.user.username

        
        if type == 'message':
            new_message = await self.create_message(sender,content)
            
            await self.channel_layer.group_send(self.room_group_name,{
                'type': "chat_message",
                 'content': content,
                'sender':sender,
                "created_at":timesince(new_message.created_at),
            })
        elif type == 'update':
            
            await self.channel_layer.group_send(
                self.room_group_name,{
                    "type": " writing_active",
                    "content":content,
                    "sender": sender
                }
            )
    
    # sending data to frontend to render message
    async def chat_message(self,event) :
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "content": event["content"],
            "sender": event["sender"],
            "created_at":event['created_at']
        })) 
    
    # sending data to frontend indicating user is typing
    async def writing_active(self,event) :
        await self.send(text_data=json.dumps({
            "type": "writing_active",
            "content": event["content"],
            "sender": event["sender"],
        })) 
        
        # getting room 
    @sync_to_async
    def get_room(self):
     try:
        self.room = Room.objects.get(uuid=self.room_uuid)
        
     except Room.DoesNotExist:
        self.room = None
        
        # closing room 
    @sync_to_async
    def set_room_closed(self):
        self.room = Room.objects.get(uuid=self.room_uuid)
        self.room.status = Room.CLOSED
        self.room.save()
        
        # creating new message
    @sync_to_async
    def create_message(self,content):
         return Message.objects.create(
        content=content,
        sender=self.user,
        room=self.room
    )