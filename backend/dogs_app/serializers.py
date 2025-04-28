from rest_framework import serializers
from .models import Dog
from clients_app.models import Client

class ClientSummarySerializer(serializers.ModelSerializer):
    """
    A simplified serializer for Clients, used for nesting within Dog details.
    Shows basic info like name and email. Avoids circular imports.
    """
    # Ensure get_full_name property exists on Client model
    get_full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'get_full_name', 'email', 'phone_number']
        read_only_fields = fields

class DogSerializer(serializers.ModelSerializer):
    """
    Serializer for the Dog model. Handles conversion between Dog instances
    and JSON representation for API requests/responses.
    """
    age_display = serializers.ReadOnlyField()

    # For writing the owner relationship (accepts Client ID)
    # Ensure only non-deleted clients can be assigned
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), # Uses the default manager (ActiveClientManager)
        allow_null=True, # Match model field definition
        required=False, # Match model field definition (blank=True)
        write_only=True # Use this field only for writing, owner_details for reading
    )
    # For displaying owner details (read-only) - using the simple nested serializer
    owner_details = ClientSummarySerializer(source='owner', read_only=True)

    class Meta:
        model = Dog
        fields = [
            'id',
            'name',
            'owner', # Write-only input field for owner ID
            'owner_details', # Read-only nested object for owner details
            'status',
            'photo',
            'breed',
            'date_of_birth',
            'sex',
            'is_altered',
            'color_markings',
            'weight_kg',
            'skills',
            'behavioral_notes',
            'training_goals',
            'previous_training',
            # Medical Info
            'vaccination_rabies',
            'vaccination_dhpp',
            'vaccination_bordetella',
            'parasites',
            'veterinarian_name',
            'veterinarian_phone',
            'medical_notes',
            # Read-only calculated/status fields
            'age_display',
            # 'is_vaccination_cleared', # Uncomment if using SerializerMethodField
            # Timestamps
            'created_at',
            'updated_at',

        ]
        read_only_fields = (
            'id',
            'owner_details',
            'age_display',
            'short_description',
            'created_at',
            'updated_at'
        )

class DogListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for Dog model, intended for use in list views.
    Includes fewer fields for better performance.
    """
    age_display = serializers.ReadOnlyField()
    short_description = serializers.ReadOnlyField()
    owner_details = ClientSummarySerializer(source="owner", read_only=True)
    photo_url = serializers.ImageField(source='photo', read_only=True, use_url=True)

    class Meta:
        model = Dog
        fields = (
            'id',
            'name',
            'breed',
            'sex',
            'owner_details',
            'age_display',
            'short_description',
            'status',
            'photo_url', # Include photo URL for potential thumbnails
            'is_altered',
        )
        # All fields listed are effectively read-only in this context
        read_only_fields = fields