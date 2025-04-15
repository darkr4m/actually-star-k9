from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Dog
from .serializers import DogSerializer, DogListSerializer
import logging
logger = logging.getLogger(__name__)

class DogListCreateView(APIView):
    """
    API View to list all dogs or create a new dog.
    Handles GET (list) and POST (create) requests.
    Uses JWT Authentication.
    * GET /api/v1/dogs/
    * POST /api/v1/dogs/
    """
    permission_classes = [permissions.IsAuthenticated] # user must be authenticated (via JWT)
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Return a list of all dogs.
        Uses the DogListSerializer for concise output.
        """
        dogs = Dog.objects.all().order_by('name')
        dogs_ser = DogListSerializer(dogs, many=True, context={'request': request})
        return Response(dogs_ser.data)

    def post(self, request):
        """
        Create a new dog instance.
        Uses the main DogSerializer for validation and creation.
        """
        # Inside your view method (e.g., create, update)
        # logger.info("--- Raw Request Data Received ---")
        # logger.info(f"Request Method: {request.method}")
        # logger.info(f"Request Content-Type: {request.content_type}")
        # logger.info(f"Request POST data: {request.POST.dict()}") # For form data
        # logger.info(f"Request FILES data: {request.FILES.dict()}") # For files
        # logger.info(f"DRF request.data: {request.data}") # What DRF parses
        # logger.info("-------------------------------")
        dog_data = request.data.copy()
        dog_ser = DogSerializer(data=dog_data)
        if dog_ser.is_valid():
            dog_ser.save()
            return Response(dog_ser.data, status=status.HTTP_201_CREATED)
        print("Serializer Errors:", dog_ser.errors)
        return Response(dog_ser.errors, status=status.HTTP_400_BAD_REQUEST)


class DogDetailView(APIView):
    """
    API View to retrieve, update or delete a specific dog instance.
    Handles GET (retrieve), PUT (update), PATCH (partial update), DELETE.
    Uses get_object_or_404 for fetching the instance.
    Uses JWT Authentication.
    """
    pass

