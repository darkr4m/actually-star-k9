from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import K9User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(APIView):
    """
    Handles user registration. Accepts POST requests with user details.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(request.headers)
    
    def post(self, request):
        user_data = request.data.copy()
        user_data['username'] = user_data['email']
        print(f"{user_data}")
        # 1. Initialize the serializer with request data
        serializer = RegisterSerializer(data=user_data)

        # 2. Validate the data
        #    raise_exception=True automatically returns a 400 Bad Request response with error details if validation fails.
        serializer.is_valid(raise_exception=True)

        # 3. If validation is successful, save the new user.
        try:
            user = serializer.save()
        except Exception as e:
            return Response({
                "error": "An error occurred during registration.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4. Prepare the success response.
        response_data = UserSerializer(user).data # Use UserSerializer for the response data
        return Response(response_data, status=status.HTTP_201_CREATED)
    
class UserDetailView(APIView):
    """
    API view to retrieve the details of the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Handles GET requests and returns the authenticated user's data.
        """
        user = request.user

        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)



# ADMIN CREATION -- TURN THIS OFF/COMMENT OUT WHEN NOT IN USE
# class AdminUserCreate(APIView):
#     # Add these lines to allow any user (authenticated or not)
#     authentication_classes = [] # No authentication required
#     permission_classes = [permissions.AllowAny] # Allow any user to access this view
#     def get(self, request):
#         return Response('Admin User Creation')

#     def post(self, request):
#         adminUserData = request.data.copy()
#         adminUserData['username'] = adminUserData['email']
#         adminUser = K9User.objects.create_user(**adminUserData)
#         adminUser.is_staff = True
#         adminUser.is_superuser = True
#         adminUser.save()
#         return Response({
#             "admin_user": adminUser.email,
#             "first_name": adminUser.first_name,
#             "last_name": adminUser.last_name
#         }, status=status.HTTP_201_CREATED)