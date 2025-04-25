import api from "./api";

const CLIENTS_API_PATH = '/api/v1/clients'

/**
 * GET /api/v1/clients/
 * Fetches the list of clients (dog owners) from the API.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of client objects.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getClients(){
    try {
        console.log('getClients(): Fetching clients data via clientsService...')
        const response = api.get(CLIENTS_API_PATH)
        console.log("getClients(): Data received:", response.data)
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
export async function addClient() {
    try {
        console.log('addClient(): Adding new client via clientsService...', clientData);
        const response = await api.post(CLIENTS_API_PATH, clientData);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('addClient(): API Error -', error.response?.data || error.message);
        throw error;
    }
}

export async function updateClient() {
 
    
}

export async function deleteClient() {
    

}