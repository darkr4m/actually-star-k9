import { useState, useEffect, useCallback } from "react";
import { getClientById } from "../services/clientsService";

/**
 * Custom hook to fetch and manage details for a single client (dog owner).
 *
 * @param {string|number|null} id - The ID of the client to fetch, or null/undefined initially.
 * @returns {{
* client: object | null,
* isLoading: boolean,
* error: Error | null,
* fetchClientDetail: (id: string | number) => Promise<void> // Allow manual fetch/refetch
* }} An object containing the client data, loading state, error state, and a fetch function.
*/
export default function useClientDetail(id) {
    // State for the client data itself
    const [ client, setClient ] = useState(null)
    // State to track if data is currently being loaded
    const [ isLoading, setIsLoading ] = useState(null)
    // State to store any error that occurs during fetching
    const [error, setError] = useState(null);

    const fetchClientDetail = useCallback(async (id) => {
        // Don't attempt to fetch if no valid ID is provided
        if(id === null || id === undefined){
            console.log(`useClientDetail: fetchClientDetail called with invalid ID (${id}). Skipping fetch.`);
            setClient(null)
            setError(null) //Clear any previous errors
            setIsLoading(false) 
        }
        console.log(`useClientDetail(${id}): Fetching client ID ${id}...`);
        setIsLoading(true) // Set loading state to true
        setError(null) // Clear any previous errors before fetching
        try {
            const data = await getClientById(id) // Call the API service function to get the client data
            setClient(data)
        } catch (error) {
            console.error(`useClientDetail() error - Failed to fetch client ID: ${id}`, error);
            setError(error); // Store the error object in state
            setClient(null); // Clear client data on error
            
        } finally {
            // This block runs whether the try succeeded or failed
            setIsLoading(false); // Set loading state back to false
        }
    }, [])

    useEffect(() =>{
        console.log(`useClientDetail useEffect: Checking client ID: ${id}`); // Log ID check
        if (id !== null && id !== undefined) {
            console.log(`useClientDetail useEffect: Valid id (${id}) found, calling fetchClientDetail.`);
            fetchClientDetail(id); // Call fetch only if id is valid
        } else {
            // If id is not valid on '/clients/add'), reset the state.
            console.log(`useClientDetail useEffect: Invalid id (${id}), resetting state and skipping fetch.`);
            setClient(null);
            setError(null);
            setIsLoading(false);
        }
    }, [id, fetchClientDetail])

    return {
        client,
        isLoading,
        error,
        fetchClientDetail,
    }
}