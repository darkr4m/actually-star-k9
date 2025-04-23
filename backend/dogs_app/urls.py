from django.urls import path

from .views import DogListCreateView, DogDetailView

urlpatterns = [
    path('',DogListCreateView.as_view(), name='dog_list_create'),
    path('<int:pk>/', DogDetailView.as_view(), name='dog-detail')
]