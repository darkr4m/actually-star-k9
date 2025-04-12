# Dog API Documentation

This document describes the API endpoints for managing Dog profiles.

**Base URL:** `/api/` (Assuming the URLs are included under this prefix)

**Authentication:** All endpoints require JWT Authentication. Requests must include a valid JWT Bearer token in the `Authorization` header:

`Authorization: Bearer <your_jwt_token>`


---

## 1. Dog List and Create

**Endpoint:** `/api/dogs/`

**View:** `DogListCreateAPIView`

**Name:** `dog-list-create`

This endpoint handles listing existing dogs and creating new dog profiles.

### Methods

#### `GET /api/dogs/`

* **Description:** Retrieves a list of all dog profiles
* **Authentication:** Required.
* **Response (`200 OK`):** An array of dog objects, using the `DogListSerializer` format.

    **Example Response Body:**
    ```json
    [
        {
            "id": 1,
            "name": "Buddy",
            "breed": "Golden Retriever",
            "owner_username": "trainer_jane",
            "sex": "MALE",
            "status": "ACTIVE",
            "photo": "/media/dog_photos/buddy.jpg",
            "is_altered": true
        },
        {
            "id": 2,
            "name": "Lucy",
            "breed": "Beagle",
            "owner_username": "trainer_jane",
            "sex": "FEMALE",
            "status": "INACTIVE",
            "photo": null,
            "is_altered": true
        }
    ]
    ```

#### `POST /api/dogs/`

* **Description:** Creates a new dog profile.
* **Authentication:** Required.
* **Request Body:** A JSON object representing the new dog. Fields correspond to the `DogSerializer` (excluding read-only fields like `id`, `owner_username`, `created_at`, `updated_at`, `age_display`, `short_description`).
    * **Note:** Photo uploads should be sent using `multipart/form-data`, not JSON. The `photo` field in the JSON example below is omitted for clarity.

    **Example Request Body:**
    ```json
    {
        "name": "Max",
        "breed": "German Shepherd",
        "date_of_birth": "2022-01-15",
        "sex": "MALE",
        "is_altered": false,
        "color_markings": "Black and Tan",
        "weight_kg": 35.5,
        "status": "PROSPECTIVE",
        "vaccination_rabies": "2024-11-01",
        "vaccination_dhpp": "2024-11-01",
        "vaccination_bordetella": "2024-12-15",
        "parasite_test_date": "2024-10-20",
        "veterinarian_name": "Happy Paws Clinic",
        "veterinarian_phone": "555-123-4567",
        "medical_notes": "Slight sensitivity to chicken.",
        "behavioral_notes": "Good with other dogs, pulls on leash.",
        "training_goals": "Loose-leash walking, basic obedience.",
        "previous_training": "Puppy kindergarten."
    }
    ```
* **Response (`201 Created`):** The newly created dog object, including server-assigned fields, using the `DogSerializer` format.

    **Example Response Body:**
    ```json
    {
        "id": 3,
        "owner_username": "trainer_jane",
        "age_display": "3 years, 2 months",
        "short_description": "German Shepherd, Male, Intact",
        "name": "Max",
        "breed": "German Shepherd",
        "date_of_birth": "2022-01-15",
        "sex": "MALE",
        "is_altered": false,
        "color_markings": "Black and Tan",
        "weight_kg": "35.50",
        "photo": null, // Will show URL if photo was uploaded via form-data
        "status": "PROSPECTIVE",
        "vaccination_rabies": "2024-11-01",
        "vaccination_dhpp": "2024-11-01",
        "vaccination_bordetella": "2024-12-15",
        "parasite_test_date": "2024-10-20",
        "veterinarian_name": "Happy Paws Clinic",
        "veterinarian_phone": "555-123-4567",
        "medical_notes": "Slight sensitivity to chicken.",
        "behavioral_notes": "Good with other dogs, pulls on leash.",
        "training_goals": "Loose-leash walking, basic obedience.",
        "previous_training": "Puppy kindergarten.",
        "created_at": "2025-04-12T15:04:00.123456Z",
        "updated_at": "2025-04-12T15:04:00.123456Z"
    }
    ```
* **Response (`400 Bad Request`):** Returned if validation fails. The body contains details about the errors.

    **Example Error Response Body:**
    ```json
    {
        "name": [
            "This field may not be blank."
        ],
        "date_of_birth": [
            "Date has wrong format. Use one of these formats instead: YYYY-MM-DD."
        ]
    }
    ```

---