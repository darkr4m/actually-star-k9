from django.urls import path
from .views import ClientListCreateView, ClientDetailView

urlpatterns = [
    path('', ClientListCreateView.as_view(), name='client_list_create'),
    path('<int:pk>/', ClientDetailView.as_view(), name='client_detail')
]