# Serializer Documentation (`serializers.py`)

This document describes the Django REST Framework (DRF) serializers defined for the `Dog` model. Serializers handle the conversion of `Dog` model instances into JSON for API responses, and the validation and conversion of incoming JSON data into `Dog` instances for create and update operations.

---

## `DogSerializer`

This serializer is intended for **detail views**, **creation**, and **update** operations related to `Dog` instances. It generally includes all fields from the `Dog` model.

**Inheritance:** `serializers.ModelSerializer`

**Purpose:** Provides a complete representation of a `Dog` object, suitable for displaying all details or for validating incoming data when creating or updating a dog.

**Fields:**

* **Model Fields:** Uses `fields = '__all__'` in its `Meta` class, it automatically includes fields corresponding to all fields on the `Dog` model (`name`, `breed`, `date_of_birth`, `sex`, `is_altered`, `weight_kg`, `vaccination_rabies`, `medical_notes`, `photo`, etc.).
    * `photo`: Handled automatically by `ModelSerializer` for `ImageField`. It expects image file data on input and outputs the image URL on output.
* **`owner_name`** (`serializers.ReadOnlyField(source='owner.name')`):
    * A read-only field added to the output.
    * It displays the `name` of the related `owner` (`owner` is a `ForeignKey` to the `Owner` model).
    * This provides more context than just showing the owner's ID. It's read-only because owner assignment is typically handled in the API view based on the logged-in user, not directly via serializer input.
* **`age_display`** (`serializers.ReadOnlyField()`):
    * A read-only field that includes the output of the `age_display` property from the `Dog` model.
* **`short_description`** (`serializers.ReadOnlyField()`):
    * A read-only field that includes the output of the `short_description` property from the `Dog` model.

**Meta Class:**

* `model = Dog`: Specifies the Django model this serializer is based on.
* `fields = '__all__'`: Includes all fields from the `Dog` model plus any explicitly defined fields on the serializer.
* `read_only_fields = ('id', 'created_at', 'updated_at')`: Specifies fields that are included in the output but are not expected during input for create/update operations via this serializer.

---

## `DogListSerializer`

This serializer is intended specifically for **list views** (API endpoint returning multiple `Dog` instances).

**Inheritance:** `serializers.ModelSerializer`

**Purpose:** Provides a simplified representation of `Dog` objects, including fewer fields than `DogSerializer`. This helps improve performance for API endpoints that return lists, as less data needs to be processed and transferred.

**Fields:**

* Uses an explicit tuple in `Meta.fields` to define a specific subset of fields relevant for a list display:
    * `id`: Unique identifier.
    * `name`: Dog's name.
    * `breed`: Dog's breed.
    * `owner_username`: Included via `serializers.ReadOnlyField(source='owner.username')` to show the owner's username in the list.
    * `sex`: Dog's sex.
    * `status`: Current status.
    * `photo`: The URL of the dog's photo, useful for displaying thumbnails in the list.
    * `is_altered`: Whether the dog is spayed/neutered.

**Meta Class:**

* `model = Dog`: Specifies the Django model.
* `fields = ('id', 'name', 'breed', 'owner_username', 'sex', 'status', 'photo', 'is_altered')`: Explicitly lists the fields to include in the output.
