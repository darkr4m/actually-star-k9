from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

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
    Uses JWT Authentication.
    URL expects a primary key (pk) for the dog.
    * GET    /api/v1/dogs/{pk}/
    * PATCH  /api/v1/dogs/{pk}/
    * DELETE /api/v1/dogs/{pk}/
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_object(self, pk):
        """
        Helper method to get the Dog object or raise Http404 if not found.
        """
        return get_object_or_404(Dog, pk=pk)
    
    def get(self, request, pk):
        """
        Retrieve details of a single dog identified by pk.
        Uses the main DogSerializer for detailed output.
        GET    /api/v1/dogs/{pk}/
        """
        dog = self.get_object(pk)
        dog_ser = DogSerializer(dog, context={'request': request})
        return Response(dog_ser.data)
    
    def patch(self, request, pk):
        """
        Partially update a dog instance.
        Only updates the fields provided in the request body.
        PATCH  /api/v1/dogs/{pk}/
        """
        dog = self.get_object(pk)
        # Use partial=True to allow partial updates
        dog_ser = DogSerializer(dog, data=request.data, partial=True, context={'request': request})
        if dog_ser.is_valid():
            dog_ser.save()
            return Response(dog_ser.data)
        logger.error(f"Dog update (PATCH) failed for pk={pk}: {dog_ser.errors}")
        return Response(dog_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """
        Delete a dog instance identified by pk.
        DELETE /api/v1/dogs/{pk}/
        """
        dog = self.get_object(pk)
        try:
            dog.delete()
            logger.info(f"Dog pk={pk} deleted successfully.")
            # Return 204 No Content on successful deletion
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Catch potential deletion errors (e.g., protected by foreign key)
             logger.error(f"Error deleting dog pk={pk}: {e}")
             return Response({"detail": "Error deleting dog."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
