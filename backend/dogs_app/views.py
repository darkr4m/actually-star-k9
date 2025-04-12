from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Dog
from .serializers import DogSerializer, DogListSerializer

class DogListCreateView(APIView):
    """
    API View to list all dogs or create a new dog.
    Handles GET (list) and POST (create) requests.
    Uses JWT Authentication.
    """
    permission_classes = [permissions.IsAuthenticated] # user must be authenticated (via JWT)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Return a list of all dogs.
        Uses the DogListSerializer for concise output.
        """
        dogs = Dog.objects.all().order_by('name')
        dogs_ser = DogListSerializer(dogs, many=True)
        return Response(dogs_ser.data)

    def post(self, request):
        """
        Create a new dog instance.
        Uses the main DogSerializer for validation and creation.
        """
        dog_data = request.data.copy()
        dog_ser = DogSerializer(data=dog_data)
        if dog_ser.is_valid:
            dog_ser.save()
            return Response(dog_ser.data, status=status.HTTP_201_CREATED)
        return Response(dog_ser.errors, status=status.HTTP_400_BAD_REQUEST)


class DogDetailView(APIView):
    """
    API View to retrieve, update or delete a specific dog instance.
    Handles GET (retrieve), PUT (update), PATCH (partial update), DELETE.
    Uses get_object_or_404 for fetching the instance.
    Uses JWT Authentication.
    """
    pass

