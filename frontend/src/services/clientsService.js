import api from "./api";

const CLIENTS_API_PATH = '/api/v1/clients/'

/**
 * GET /api/v1/clients/
 * Fetches the list of clients (dog owners) from the API.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of client objects.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getClients(){
    try {
        console.log('getClients(): Fetching clients data via clientsService...')
        const response = await api.get(CLIENTS_API_PATH)
        console.log("getClients(): Data received:", response)
        return response.data
    } catch (error) {
        console.error(`getClients() - API Error:`, error.response?.data || error.message)
        // Re-throw the error so calling components/hooks can handle it
        throw error;
    }
}

/**
 * Fetches details for a single client by their ID.
 * GET /api/v1/clients/:id
 * @param {string|number} id - The ID of the dog to fetch.
 * @returns {Promise<object>} A promise that resolves to the client object.
 * @throws {Error} Throws an error if the API request fails (not found).
 */
export async function getClientById(id){
    if(!id) throw new Error('getClientById(): Client ID is required.')
    try {
        console.log(`getClientById(${id}): Fetching client data for ID: ${id} via clientsService...`)
        const response = await api.get(`${CLIENTS_API_PATH}${id}/`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`getClientById(${id}) - API Error:`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * POST /api/v1/clients/
 * Function to add a new client (dog owner)
 * @param {object} clientData - The data for the new client.
 * @returns {Promise<object>} A promise that resolves to the newly created client object.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function addClient(clientData) {
    try {
        console.log('addClient(): Adding new client via clientsService...', clientData);
        const response = await api.post(CLIENTS_API_PATH, clientData, { 
            headers: { 'Content-Type': 'application/json' // Ensure correct Content-Type
        }});
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('addClient(): API Error -', error.response?.data || error.message);
        throw error;
    }
}

/**
 * PATCH /api/v1/clients/:id
 * Updates an existing client (dog owner) by its ID.
 * @param {string|number} id - The ID of the client to update.
 * @param {object} clientData - The updated data for the client.
 * @returns {Promise<object>} A promise that resolves to the updated client object.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function updateClient(id, clientData) {
    if(!id) throw new Error(`updateClient(): Client ID required for update.`);
    try {
        console.log(`updateClient(${id}): Updating client ID ${id} via clientService...`);
        const response = await api.patch(`${CLIENTS_API_PATH}${id}/`, clientData);
        console.log(response.data)
        return response.data   
    } catch (error) {
        console.error(`updateClient(${id}): API Error -`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * DELETE /api/v1/clients/:id
 * Deletes a client (dog owner) by its ID.
 * @param {string|number} id - The ID of the client to delete.
 * @returns {Promise<void>} A promise that resolves when deletion is successful (often returns 204 No Content).
 * @throws {Error} Throws an error if the API request fails.
 */
export async function deleteClient(id) {
    if(!id) throw new Error("deleteClient: Client ID is required for deletion.");
    try {
        console.log(`deleteClient(${id}): Deleting Client ID ${id} via clientService...`);
        await api.delete(`${CLIENTS_API_PATH}${id}/`);
        console.log(`deleteClient(${id}): Client ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`deleteClient(${id}): API Error -`, error.response?.data || error.message);
        throw error;
    }
 }
