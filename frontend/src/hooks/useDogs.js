import { useCallback, useState, useEffect } from "react";
import { getDogs } from "../services/dogsService";

export default function useDogs(autoFetch=true){
    const [ dogs, setDogs ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [error, setError ] = useState(null)

    const fetchDogs = useCallback(async () => {
            setIsLoading(true);
            setError('')
            try {
                console.log('useDogs.fetchDogs(): Fetching dog data...')
                const data = await getDogs()
                console.log('useDogs.fetchDogs():', data)
                setDogs(data)
            } catch (error) {
                setError(`useDogs.fetchDogs() Error - ${error.message}` || 'useDogs.fetchDogs() Error - Failed to fetch dogs.')
                console.error('useDogs.fetchDogs() Error -', error);
                setDogs([])
            } finally {
                setIsLoading(false)
            }
        }, [])

    useEffect(() => {
        if (autoFetch) {
            fetchDogs()        
        }
    }, [autoFetch, fetchDogs])

    return { dogs, isLoading, error, fetchDogs }

}