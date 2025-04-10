from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserDetailView
# from .views import AdminUserCreate

urlpatterns = [
    # path('admin/create/', AdminUserCreate.as_view(), name="create_admin_user"),

    # http://127.0.0.1:8000/users/signup/
    path('signup/', RegisterView.as_view(), name="sign_up"),
    path('login/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail')
]