from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField # Import for phone numbers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Client model.
    """
    phone_number = PhoneNumberField(allow_null=True, required=False)
    emergency_contact_phone = PhoneNumberField(allow_null=True, required=False)

    # TODO:
    # Option 1: Nested Serializer (Read-Only) - Shows full address details
    # addresses = AddressSerializer(many=True, read_only=True)

    # Option 3: StringRelatedField (Read-Only __str__) - Shows address __str__ representation
    # addresses = serializers.StringRelatedField(many=True, read_only=True)

    # Add related_name Dog model/serializer
    # dogs = DogSerializer(many=True, read_only=True)

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
            'emergency_contact_name',
            'emergency_contact_phone',
            'is_active',
            # 'addresses',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

        # --- Validation --- ModelSerializer automatically uses model-level validators, including:
        # - MinLengthValidator, MaxLengthValidator for names
        # - EmailField validation
        # - PhoneNumberField validation
        # - 'unique' constraint on email (checked during .is_valid() if using unique validator,
        #   or raises IntegrityError on save otherwise, which DRF handles)
        # - Custom validators 'validate_name' attached to the model fields.

