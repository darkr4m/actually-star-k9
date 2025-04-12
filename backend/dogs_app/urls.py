from django.urls import path

from .views import DogListCreateView

urlpatterns = [
    path('',DogListCreateView.as_view(), name='dog_list_create')
]