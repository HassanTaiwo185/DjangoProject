from django.urls import path
from .views import CreateUserViews, ConfirmCode, EditUser, DeleteUser

urlpatterns = [
    path("register/", CreateUserViews.as_view(), name="create-user"),
    path("confirm/", ConfirmCode.as_view(), name="confirm-code"),
    path("edit/<uuid:pk>/", EditUser.as_view(), name="edit-user"),
    path("delete/<uuid:pk>/", DeleteUser.as_view(), name="delete-user"),
]
