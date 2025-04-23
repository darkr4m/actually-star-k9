import { useState, useEffect, useCallback } from "react";
import { getDogById } from "../services/dogsService";

/**
 * Custom hook to fetch and manage details for a single dog.
 *
 * @param {string|number|null} dogId - The ID of the dog to fetch, or null/undefined initially.
 * @returns {{
* dog: object | null,
* isLoading: boolean,
* error: Error | null,
* fetchDogDetail: (id: string | number) => Promise<void> // Allow manual fetch/refetch
* }} An object containing the dog data, loading state, error state, and a fetch function.
*/

export default function useDogDetail(dogId) {
    // State for the dog data itself
    const [dog, setDog] = useState(null)
    // State to track if data is currently being loaded
    const [isLoading, setIsLoading] = useState(false);
    // State to store any error that occurs during fetching
    const [error, setError] = useState(null);

    const fetchDogDetail = useCallback(async (id)=>{
        // Don't attempt to fetch if no valid ID is provided
        if(id === null || id === undefined){
            console.log(`useDogDetail: fetchDogDetail called with invalid ID (${id}). Skipping fetch.`);
            setDog(null)
            setError(null) //Clear any previous errors
            setIsLoading(false) 
        }
        console.log(`useDogDetail(${id}): Fetching dog ID ${id}...`);
        setIsLoading(true) // Set loading state to true
        setError(null) // Clear any previous errors before fetching
        try {
            const data = await getDogById(id) // Call the API service function to get the dog data
            setDog(data) // Update state with the fetched dog data
        } catch (error) {
            console.error(`useDogDetail() error - Failed to fetch dog ID: ${id}`, error);
            setError(error); // Store the error object in state
            setDog(null); // Clear dog data on error
        } finally {
            // This block runs whether the try succeeded or failed
            setIsLoading(false); // Set loading state back to false
        }
    }, [])

    useEffect(()=>{
        console.log(`useDogDetail useEffect: Checking dogId: ${dogId}`); // Log ID check
        if (dogId !== null && dogId !== undefined) {
            console.log(`useDogDetail useEffect: Valid dogId (${dogId}) found, calling fetchDogDetail.`);
            fetchDogDetail(dogId); // Call fetch only if dogId is valid
        } else {
            // If dogId is not valid (e.g., on '/dogs/add'), reset the state.
            console.log(`useDogDetail useEffect: Invalid dogId (${dogId}), resetting state and skipping fetch.`);
            setDog(null);
            setError(null);
            setIsLoading(false);
        }
    }, [dogId, fetchDogDetail])

    return {
        dog,
        isLoading,
        error,
        fetchDogDetail
    }
}