from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField # Import for phone numbers
from common_app.serializers import AddressSerializer
from .models import Client
from dogs_app.serializers import DogListSerializer

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Client model.
    """
    phone_number = PhoneNumberField(allow_null=True, required=False)
    emergency_contact_phone = PhoneNumberField(allow_null=True, required=False)

    # TODO:
    # Option 1: Nested Serializer (Read-Only) - Shows full address details
    addresses = AddressSerializer(many=True, read_only=True)

    # Option 3: StringRelatedField (Read-Only __str__) - Shows address __str__ representation
    # addresses = serializers.StringRelatedField(many=True, read_only=True)

    # Add related_name Dog model/serializer
    dogs = DogListSerializer(many=True, read_only=True)
    # dogs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    # Make soft delete fields read-only
    is_deleted = serializers.BooleanField(read_only=True)
    deleted_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S") # Optional formatting

    # Make timestamps read-only
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")

    get_full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Client
        fields = [
            'id',
            'first_name',
            'last_name',
            'get_full_name',
            'email',
            'phone_number',
            'dogs',
            'emergency_contact_name',
            'emergency_contact_phone',
            'is_active',
            'addresses',
            'created_at',
            'updated_at',
            'is_deleted', # Read-only soft delete status
            'deleted_at', # Read-only soft delete timestamp
        ]
        read_only_fields = [
            'id',
            'get_full_name',
            'dogs',
            'is_deleted',
            'deleted_at',
            'created_at',
            'updated_at',
        ]

        # --- Validation --- ModelSerializer automatically uses model-level validators, including:
        # - MinLengthValidator, MaxLengthValidator for names
        # - EmailField validation
        # - PhoneNumberField validation
        # - 'unique' constraint on email (checked during .is_valid() if using unique validator,
        #   or raises IntegrityError on save otherwise, which DRF handles)
        # - Custom validators 'validate_name' attached to the model fields.

