from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import K9User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = K9User
        fields = ('password', 'password2', 'email', 'username', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields do not match."
            })
        # Basic email validation (check if exists)
        if K9User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already in use."})
        
        return attrs
    
    def create(self, validated_data):
        user = K9User.objects.create(
            username = validated_data['email'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    has_google_credentials = serializers.SerializerMethodField()

    class Meta:
        model = K9User
        fields = ('id','username', 'email', 'first_name', 'last_name', 'has_google_credentials')

    def get_has_google_credentials(self, obj):
        # Check if related GoogleCredentials exist
        return hasattr(obj, 'google_credentials') and obj.google_credentials is not None