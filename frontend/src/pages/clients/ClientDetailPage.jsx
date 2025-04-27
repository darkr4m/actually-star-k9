import React from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import useClientDetail from '../../hooks/useClientDetail'
import { deleteClient } from "../../services/clientsService";
import useClients from '../../hooks/useClients'

import {
    Box, Card, CardContent, CardMedia, Typography, Button,
    CircularProgress, Alert, Grid, Divider, Chip,
    AlertTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ClientDetailPage(){
    const { id } = useParams()
    const navigate = useNavigate();

    const { client, isLoading, error } = useClientDetail(id)
    const { fetchClients } = useClients(false)

    // Handler for the delete button
    const handleDelete = async () => {
        // Confirm before deleting
        if (window.confirm(`Are you sure you want to delete ${client?.name || 'this client'}? This action cannot be undone.`)) {
            try {
                console.log(`Attempting to delete client ID: ${id}`);
                await deleteClient(id); // Call the delete API function
                console.log("Client deleted successfully");
                await fetchClients(); // Refresh the clients list data
                navigate('/clients'); // Navigate back to the main clients list page
            } catch (err) {
                console.error("Failed to delete client:", err);
                // Display error to user (could use a Snackbar or Alert state)
                alert(`Failed to delete client: ${err.message || 'Unknown error'}`);
            }
        }
    };

    // --- Render Logic ---
    
    // --- Show Loading State
    if(isLoading){
        return (
            <Box sx={{
                display:'flex',
                justifyContent:'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <CircularProgress />
                <Typography sx={{marginLeft: 2}}>Loading client details...</Typography>
            </Box>
        )
    }
    // --- Show Not Found State (if loading finished but no client data)
    // --- Show Error State
    if(error){
        console.log(error.response.data.detail)
        return (
            <Alert severity="error" sx={{m:2}}>
                <AlertTitle>Error</AlertTitle>
                Error loading dog details - {error.message}: {error.response.data.detail}
                <Button component={Link} to="/clients" startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>Back to List</Button>
            </Alert>
        )
    }

    console.log(client)

    return (
        <Box sx={{
                    maxWidth:'70vw',
                    margin:'auto',
                    padding: {xs:1, sm:2, md:3}
                }}>
            {/* Back Button */}
            <Button component={Link} to="/clients" startIcon={<ArrowBackIcon/>} sx={{mb:2}}>Back to Clients List</Button>
            { client && (
                <Card variant="outlined">
                    <Grid container columns={4} rowSpacing={2} padding={2}>
                    <Grid size={{sm:4, md:2}}
                        sx={{
                            display:'flex',
                            flexDirection:"column",
                            justifyContent:"flex-start",
                            alignItems:"left"
                        }}> 
                        <Typography variant='h6'>{client.get_full_name}</Typography>
                        <Typography variant='p'>{client.phone_number}</Typography>
                        <Typography variant='p'>{client.email}</Typography>
                    </Grid>
                    {/* Emergency Contact */}
                    {(client.emergency_contact_name || client.emergency_contact_phone) && (
                        <Grid size={{sm:4, md:2}}
                            sx={{
                                display:'flex',
                                flexDirection:"column",
                                justifyContent:"flex-start",
                                alignItems:"left"
                            }}> 
                            <Typography variant='h6'>Emergency Contact</Typography>
                            <Typography variant='p'>{client.emergency_contact_name}</Typography>
                            <Typography variant='p'>{client.emergency_contact_phone}</Typography>
                        </Grid>
                    )}
                    </Grid>
                    <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/clients/${id}/edit`}
                        >
                            Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete} // Call the delete handler
                    >
                        Delete
                    </Button>
                </Card>
            )}
        
        </Box>
    )
}