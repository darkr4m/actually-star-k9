import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import useClients from "../../hooks/useClients";

import ClientSelect from "../../components/clients/ClientSelect";

export default function ClientsListPage(){

    const {clients, isLoading, error } = useClients()

    if(isLoading) {
        return <p>Loading clients...</p>
    }
    
    if(error) {
        return <p>{error}</p>
    }
    

    return (
        <Box>
            <h2>All Owners</h2>
            <Button variant="contained" sx={{my:1}} component={Link} to='/clients/add' >Add new client</Button>
            <ul>
                {clients.map((client, index)=>{
                    return (
                        <li key={index}>
                            <Link to={`/clients/${client.id}`}>
                                {client.get_full_name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </Box>
    )
}