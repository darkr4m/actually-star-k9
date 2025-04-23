import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'; // For formatting dates if needed
import useDogDetail from '../../hooks/useDogDetail';
import { deleteDog } from '../../services/dogsService'
import  useDogs from '../../hooks/useDogs';

import {
    Box, Card, CardContent, CardMedia, Typography, Button,
    CircularProgress, Alert, Grid, Divider, Chip,
    AlertTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e0e0e0/999999?text=No+Photo';

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = dayjs(dateString);
    return date.isValid() ? date.format('MMMM D, YYYY') : 'Invalid Date';
}

export default function DogDetailPage(){
    
    const { id } = useParams()
    const navigate = useNavigate();
    const { dog, isLoading, error } = useDogDetail(id)
    const { fetchDogs } = useDogs(false);

    // Handler for the delete button
    const handleDelete = async () => {
        // Confirm before deleting
        if (window.confirm(`Are you sure you want to delete ${dog?.name || 'this dog'}? This action cannot be undone.`)) {
            try {
                console.log(`Attempting to delete dog ID: ${id}`);
                await deleteDog(id); // Call the delete API function
                console.log("Dog deleted successfully");
                await fetchDogs(); // Refresh the dogs list data
                navigate('/dogs'); // Navigate back to the main dogs list page
            } catch (err) {
                console.error("Failed to delete dog:", err);
                // Display error to user (could use a Snackbar or Alert state)
                alert(`Failed to delete dog: ${err.message || 'Unknown error'}`);
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
                <Typography sx={{marginLeft: 2}}>Loading dog details...</Typography>
            </Box>
        )
    }
    // --- Show Not Found State (if loading finished but no dog data)
    // --- Show Error State
    if(error){
        console.log(error.response.data.detail)
        return (
            <Alert severity="error" sx={{m:2}}>
                <AlertTitle>Error</AlertTitle>
                Error loading dog details - {error.message}: {error.response.data.detail}
                <Button component={Link} to="/dogs" startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>Back to List</Button>
            </Alert>
        )
    }

    // --- Display Dog Details
    return (
        <Box sx={{
            maxWidth:'70vw',
            margin:'auto',
            padding: {xs:1, sm:2, md:3}
        }}>
            {/* Back Button */}
            <Button component={Link} to="/dogs" startIcon={<ArrowBackIcon/>} sx={{mb:2}}>Back to Dogs List</Button>
            { dog && (
                <Card variant="outlined">
                    <Grid container columns={4} rowSpacing={2} padding={2}>
                        <Grid size={4}>
                            <Divider textAlign='center' ><Typography variant='overline'>Basic Information</Typography></Divider>
                        </Grid>
                        <Grid size={{sm:4, md:2}}
                            sx={{
                                display:'flex',
                                justifyContent:"center",
                                alignItems:"center"
                            }}>
                            {/* Dog Photo */}
                            <Box component="img"
                                src={dog.photo || PLACEHOLDER_IMAGE}
                                alt={`Photo of ${dog.name}`}
                                sx={{
                                    border:"3px solid pink",
                                    height:"300px",
                                    width:"300px",
                                    background: "transparent",
                                    borderRadius:"50%",
                                    objectFit:"cover"
                                }}
                            />
                        </Grid>
                        <Grid size={{sm:4, md:2}}
                        sx={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'left', m:0 }}>
                                {/* Basic Information */}
                                    {/* Header: Name and Status */} 
                                    <Typography variant="h4" component="h1">
                                        <Chip label={dog.status || 'UNKNOWN'} color={dog.status === 'ACTIVE' ? 'success' : 'default'} size="small" /> 
                                        {dog.name}
                                    </Typography>
                                    <Typography variant="h5">{dog.breed} </Typography>
                                    <Typography variant="h6">{dog.is_altered ? (dog.sex === 'MALE' ? 'Neutered' : 'Spayed' ) : 'Intact'} {dog.sex.charAt(0) + dog.sex.toLowerCase().slice(1)}</Typography>
                                    <Typography  component="p">{formatDate(dog.date_of_birth)}{` (${dog.age_display})`} </Typography>
                                    <Typography>{`Weight: ${dog.weight_kg} kg`}</Typography>
                                    <Typography><b>Color and Markings:</b> <br />
                                        {dog.color_markings}</Typography>
                        </Grid>
                        <Grid size={4}>
                            <Divider textAlign='left' ><Typography variant='overline'>Owner Information</Typography></Divider>
                            <Typography variant='h6'>Owner Name</Typography>
                            {dog.owner}
                        </Grid>

                        { (dog.behavioral_notes || dog.training_goals || dog.previous_training) && (     
                            <Grid size={4}>
                                <Divider textAlign='left' ><Typography variant='overline'>Training Information</Typography></Divider>
                                {dog.behavioral_notes && (
                                    <Grid>
                                        <Typography variant='h6'>Behavioral Notes</Typography>
                                        {dog.behavioral_notes}
                                    </Grid>
                                )}
                                {dog.training_goals && (
                                    <Grid>
                                        <Typography variant='h6'>Training Goals</Typography>
                                        {dog.training_goals}
                                    </Grid>
                                )}
                                {dog.previous_training && (
                                    <Grid>
                                        <Typography variant='h6'>Previous Training</Typography>
                                        {dog.previous_training}
                                    </Grid>
                                )}
                            </Grid>
                        )}
                        <Grid size={4}>
                            <Divider textAlign='left' ><Typography variant='overline'>Medical Information</Typography></Divider>
                        </Grid>
                            {/* <Grid size={2} sx={{display:'flex'}}> */}
                                <Grid size={{sm:4, md:2}}>
                                    <Typography variant='h6'>Veterinarian Information</Typography>
                                    <b>Veterinarian or Clinic Name:</b>
                                    <br/> {dog.veterinarian_name || 'None'} 
                                    <br/>
                                    <b>Veterinarian or Clinic Phone Number:</b>
                                    <br/> {dog.veterinarian_phone || 'None'}
                                </Grid>
                                <Grid size={{sm:4, md:2}}>
                                    <Typography variant='h6'>Medical Notes</Typography>
                                    {dog.medical_notes || 'None'}
                                </Grid>
                            {/* </Grid> */}
                        <Grid size={4}>
                            <Divider textAlign='left' ><Typography variant='overline'>Vaccination Information</Typography></Divider>
                        </Grid>
                        <Grid size={{sm:4, md:2}}>
                            <Typography variant='h6'>Last Rabies Vaccination</Typography>
                            {dog.vaccination_rabies || 'None'}
                        </Grid>
                        <Grid size={{sm:4, md:2}}>
                            <Typography variant='h6'>Last DHPP Vaccination</Typography>
                            {dog.vaccination_dhpp || 'None'}
                        </Grid>
                        <Grid size={{sm:4, md:2}}>
                            <Typography variant='h6'>Last Bordetella Vaccination</Typography>
                            {dog.vaccination_bordetella || 'None'}
                        </Grid>
                        <Grid size={{sm:4, md:2}}>
                            <Typography variant='h6'>Last Parasite Screen</Typography>
                            {dog.parasites || 'None'}
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/dogs/${id}/edit`}
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
                    </Grid> 
                </Card>
            )}
        </Box>
    )


}