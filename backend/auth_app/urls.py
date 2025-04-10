from django.urls import path
from .views import GoogleLoginRedirectView, GoogleLoginCallbackView

urlpatterns = [
    path('google/redirect/', GoogleLoginRedirectView.as_view(), name='google_redirect'),
    path('google/callback/', GoogleLoginCallbackView.as_view(), name='google_callback')
]