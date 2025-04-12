from rest_framework import serializers
from .models import Dog

class DogSerializer(serializers.ModelSerializer):
    """
    Serializer for the Dog model. Handles conversion between Dog instances
    and JSON representation for API requests/responses.
    """
    age_display = serializers.ReadOnlyField()
    short_description = serializers.ReadOnlyField()

    class Meta:
        model = Dog
        fields = '__all__'
        read_only_fields = (
            'id',
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

    class Meta:
        model = Dog
        fields = (
            'id',
            'name',
            'breed',
            'sex',
            'status',
            'photo', # Include photo URL for potential thumbnails
            'is_altered',
        )
        read_only_fields = (
            'id',
            'created_at',
            'updated_at'
        )  