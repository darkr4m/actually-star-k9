import { useCallback, useState, useEffect } from "react";
import { getClients } from "../services/clientsService";

export default function useClients(autoFetch=true){
    const [ clients, setClients ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState(null)

    const fetchClients = useCallback(async ()=>{
        setIsLoading(true);
        setError('');
        try {
            console.log(`useClients.fetchClients(): Fetching client data...`)
            const data = await getClients()
            console.log(`useClients.fetchClients():`, data)
            setClients(data)
        } catch (error) {
            setError(`useClients.fetchClients() Error - ${error.message}` || `useClients.fetchClients() Error - Failed to client data.`)
            console.error(`useClients.fetchClients() Error -`, error)
            setClients([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() =>{
        if (autoFetch){
            fetchClients()
        }
    },[ autoFetch, fetchClients ])

    return { clients, isLoading, error, fetchClients }
}