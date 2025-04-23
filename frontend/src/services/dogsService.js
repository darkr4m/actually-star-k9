import api from './api'


const DOGS_API_PATH = '/api/v1/dogs/'

/**
 * Fetches the list of dogs from the API.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of dog objects.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getDogs() {
    try {
        console.log('getDogs(): Fetching dogs data via dogService...')
        const response = await api.get(DOGS_API_PATH)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('getDogs() - API Error:', error.response?.data || error.message);
        // Re-throw the error so calling components/hooks can handle it
        throw error;
    }
}

/**
 * Fetches details for a single dog by its ID.
 * @param {string|number} dogId - The ID of the dog to fetch.
 * @returns {Promise<object>} A promise that resolves to the dog object.
 * @throws {Error} Throws an error if the API request fails (e.g., not found).
 */
export async function getDogById(dogId) {
    if(!dogId) throw new Error('getDogById(): Dog ID is required.')
    try {
        console.log(`getDogById(${dogId}): Fetching dog data for ID: ${dogId} via dogService...`)
        const response = await api.get(`${DOGS_API_PATH}${dogId}/`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`getDogById(${dogId}) - API Error:`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Function to add a new dog
 * @param {object} dogData - The data for the new dog.
 * @returns {Promise<object>} A promise that resolves to the newly created dog object.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function addDog(dogData) {
    try {
        console.log('addDog(): Adding new dog via dogService...', dogData);
        const response = await api.post(DOGS_API_PATH, dogData);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('addDog(): API Error -', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Updates an existing dog by its ID.
 * @param {string|number} dogId - The ID of the dog to update.
 * @param {object} dogData - The updated data for the dog.
 * @returns {Promise<object>} A promise that resolves to the updated dog object.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateDog(dogId, dogData) {
    if (!dogId) throw new Error(`updateDog(): Dog ID is required for update.`);
    console.log(`updateDog(${dogId}): Updating dog ID ${dogId} via dogService...`, dogData);
    const response = await api.patch(`${DOGS_API_PATH}${dogId}/`, dogData);
    console.log(response.data)
    return response.data
}

/**
 * Deletes a dog by its ID.
 * @param {string|number} dogId - The ID of the dog to delete.
 * @returns {Promise<void>} A promise that resolves when deletion is successful (often returns 204 No Content).
 * @throws {Error} Throws an error if the API request fails.
 */
export async function deleteDog(dogId) {
    if (!dogId) throw new Error("deleteDog: Dog ID is required for deletion.");
   try {
       console.log(`deleteDog(${dogId}): Deleting dog ID ${dogId} via dogService...`);
       await api.delete(`${DOGS_API_PATH}${dogId}/`);
       console.log(`deleteDog(${dogId}): Dog ID ${dogId} deleted successfully.`);
   } catch (error) {
       console.error(`deleteDog(${dogId}): API Error -`, error.response?.data || error.message);
       throw error;
   }
}