from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Client
from .serializers import ClientSerializer
import logging
logger = logging.getLogger(__name__)

class ClientListCreateView(APIView):
    """
    API View to list all clients (dog owners) or create a new client.
    Handles GET (list) and POST (create) requests.
    Uses JWT Authentication.
    * GET /api/v1/clients/
    * POST /api/v1/clients/
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [FormParser, JSONParser]

    def get(self, request):
        """
        GET /api/v1/clients/
        Return a list of all clients (dog owners).
        Uses the ClientSerializer for output.
        """
        clients = Client.objects.all().order_by('last_name')
        clients_ser = ClientSerializer(clients, many=True, context={'request': request})
        # logger.info(clients_ser.data)
        return Response(clients_ser.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST /api/v1/clients/
        Create a new client (dog owner) instance.
        Uses the ClientSerializer for validation and creation.
        """
        logger.info("--- Raw Request Data Received ---")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Request Content-Type: {request.content_type}")
        logger.info(f"Request POST data: {request.POST.dict()}") # For form data
        # logger.info(f"Request FILES data: {request.FILES.dict()}") # For files
        logger.info(f"DRF request.data: {request.data}") # What DRF parses
        logger.info("-------------------------------")
        client_data = request.data.copy()
        client_ser = ClientSerializer(data=client_data)
        if client_ser.is_valid():
            client_ser.save()
            return Response(client_ser.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"--- ClientListCreateView POST: Serializer Errors ---")
            logger.error(client_ser.errors)
            return Response(client_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ClientDetailView(APIView):
    """
    API View to retrieve, update or delete a specific client (dog owner) instance.
    Handles GET (retrieve), PUT (update), PATCH (partial update), DELETE.
    Uses JWT Authentication.
    URL expects a primary key (pk) for the client.
    * GET    /api/v1/clients/{pk}/
    * PATCH  /api/v1/clients/{pk}/
    * DELETE /api/v1/clients/{pk}/
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, pk):
        """
        Helper method to get the Client object or raise Http404 if not found.
        """
        return get_object_or_404(Client, pk=pk)
    
    def get(self, request, pk):
        """
        Retrieve details of a single client identified by pk.
        Uses the ClientSerializer for detailed output.
        GET    /api/v1/clients/{pk}/
        """
        client = self.get_object(pk)
        client_ser = ClientSerializer(client, context={'request': request})
        return Response(client_ser.data)
    
    def patch(self, request, pk):
        """
        Partially update a client instance.
        Only updates the fields provided in the request body.
        PATCH  /api/v1/clients/{pk}/
        """
        client = self.get_object(pk)
        # Use partial=True to allow partial updates
        client_ser = ClientSerializer(client, data=request.data, partial=True, context={'request': request})
        if client_ser.is_valid():
            client_ser.save()
            return Response(client_ser.data)
        else:
            logger.error(f"Client update (PATCH) failed for pk={pk}: {client_ser.errors}")
            return Response(client_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, pk):
        """
        Delete a client instance identified by pk.
        DELETE /api/v1/clients/{pk}/
        """
        client = self.get_object(pk)
        try:
            client.delete()
            logger.info(f"Client pk={pk} deleted successfully.")
            # Return 204 No Content on successful deletion
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Catch potential deletion errors (e.g., protected by foreign key)
             logger.error(f"Error deleting client pk={pk}: {e}")
             return Response({"detail": "Error deleting client."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)