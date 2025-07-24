from django.urls import path
from .views import RoomViews, MessageViews , ListMessagesByStandup , EditMessageView ,DeleteMessageView

urlpatterns = [
    path("rooms/", RoomViews.as_view(), name="room-list-create"),
    path("messages/", MessageViews.as_view(), name="message-list-create"),
    path("messages/standup/<uuid:standup_id>/", ListMessagesByStandup.as_view(), name="messages-by-standup"),
    path("messages/standup/<int:pk>/", EditMessageView.as_view(), name="edit-message"),
    path("messages/standup/<int:pk>/", DeleteMessageView.as_view(), name="delete-message"),
]
