from django.urls import path
from .views import CreateUser, ConfirmCode, EditUser, DeleteUser

urlpatterns = [
    path("register/", CreateUser.as_view(), name="create-user"),
    path("confirm/", ConfirmCode.as_view(), name="confirm-code"),
    path("edit/<pk>/", EditUser.as_view(), name="edit-user"),
    path("delete/<pk>/", DeleteUser.as_view(), name="delete-user"),
]
