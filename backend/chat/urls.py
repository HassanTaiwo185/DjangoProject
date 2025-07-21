from django.urls import path
from .views import RoomViews, MessageViews

urlpatterns = [
    path("rooms/", RoomViews.as_view(), name="room-list-create"),
    path("messages/", MessageViews.as_view(), name="message-list-create"),
]
