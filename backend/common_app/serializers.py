from rest_framework import serializers
from .models import Client, Address

class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for the Address model.
    Used for nested representation within ClientSerializer.
    """

    client = serializers.PrimaryKeyRelatedField(read_only=True)


    class Meta:
        model = Address
        fields = [
            'id',
            'client', # Include if you want the client ID when serializing an address directly
            'street_address_1',
            'street_address_2',
            'city',
            'state',
            'postal_code',
            'country',
            'address_type',
            'get_address_type_display', # Include the human-readable choice
            'created_at',
            'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at', 'client') # Client is read-only here