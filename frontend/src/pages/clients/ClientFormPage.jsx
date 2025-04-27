import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Grid, 
    Box, 
    MenuItem,
    Button, 
    Alert,
    AlertTitle,
    CircularProgress,
    Typography
} from "@mui/material";

import useClientDetail from '../../hooks/useClientDetail'
import useClientForm from '../../hooks/useClientForm'

import FormTextField from "../../components/common/forms/FormTextField";
import FormSectionDivider from "../../components/common/forms/FormSectionDivider";


export default function ClientFormPage(){
    // --- Hooks ---
    const { id } = useParams() // Get ID from URL if present
    const navigate = useNavigate()
    const isEditMode = Boolean(id); // Determine if we are editing
    const mode = isEditMode ? 'edit' : 'add'; // Set mode

    // --- Data Fetching (Edit Mode Only) ---
    // Fetch client details required for editing. Pass null if adding.
    const { client: initialData, isLoading:isLoadingDetail, error:detailError } = useClientDetail(isEditMode ? id : null)
    
    const {
        formData,
        isSubmitting,
        fieldErrors,
        generalError,
        successMessage,
        handleChange,
        handleSubmit
    } = useClientForm(initialData, id, isEditMode)

     // --- Cancel Handler ---
    // Navigates back to the detail page (if editing) or the list page (if adding).
    const handleCancel = () => {
        navigate(isEditMode ? `/clients/${id}` : '/clients');
    };

    // --- Render Logic ---
    // --- Handle Loading State (Edit Mode Only)
    if(isEditMode && isLoadingDetail) {
        return (
            <Box sx={{display:'flex', justifyContent: 'center', alignItems:'center', padding: '2rem'}}>
                <CircularProgress />
                <Typography sx={{ marginLeft: 2 }}>Loading client details...</Typography>
            </Box>
        )
    }

    // --- Handle Data Fetching Error (Edit Mode Only)
    // Show an error message if fetching the dog's details failed.
    if (isEditMode && detailError) {
        return <Alert severity="error" sx={{ margin: 2 }}>Error loading client (ID: {id}) details : {detailError.message}</Alert>;
    }

    // --- Handle Client Not Found (Edit Mode Only)
    // Show a message if the fetch completed but no client was found for the ID.
    if (isEditMode && !initialData && !isLoadingDetail) {
            return <Alert severity="warning" sx={{ margin: 2 }}>Client not found (ID: {id}).</Alert>;
    }

    return (
        <Box sx={{
            padding: {sx:1, sm:2, md:3},
            margin: 'auto',
            display:'flex',
            flexDirection: 'column',
            alignItems: 'center'
            }}>
            {successMessage && (
                <Alert severity="success" sx={{ mb:2 }}>
                    <AlertTitle>Success</AlertTitle>
                    {successMessage}
                </Alert>
            )}
            {generalError && (
                <Alert severity="error" sx={{ mb: 2 }} /* onClose={() => hook should provide clearGeneralError()} */ >
                    {generalError}
                </Alert>
            )}
            {/* Dynamic Page Title */}
            <Typography variant="h4" component="h1" gutterBottom>
                {isEditMode ? `Edit Client: ${initialData?.get_full_name || ''}` : 'Add New Client'}
            </Typography>
            {/* Form Element */}
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{width:'70vw'}}>
                <Grid container columns={{xs: 2, md:4}} rowSpacing={1} columnSpacing={{xs:1, sm:2, md:3}}>
                    <Grid size={4}>
                        <FormSectionDivider>Basic Information</FormSectionDivider>
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            name="first_name"
                            label="First Name"
                            value={formData.first_name}
                            error={fieldErrors.first_name}
                            onChange={handleChange}
                            helperText={"Enter the client's first name."}
                            disabled={isSubmitting}
                            required
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            name="last_name"
                            label="Last Name"
                            value={formData.last_name}
                            error={fieldErrors.last_name}
                            onChange={handleChange}
                            helperText={"Enter the client's last name."}
                            disabled={isSubmitting}
                            required
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            type="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            error={fieldErrors.email}
                            onChange={handleChange}
                            helperText={"Enter the client's email address."}
                            disabled={isSubmitting}
                            required
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            type="tel"
                            name="phone_number"
                            label="Phone Number"
                            value={formData.phone_number}
                            error={fieldErrors.phone_number}
                            onChange={handleChange}
                            helperText={"Enter the client's phone number."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={4}>
                        <FormSectionDivider>Emergency Contact Information</FormSectionDivider>
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            name="emergency_contact_name"
                            label="Emergency Contact Name"
                            value={formData.emergency_contact_name}
                            error={fieldErrors.emergency_contact_name}
                            onChange={handleChange}
                            helperText={"Enter the name of the client's emergency contact (optional)."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            name="emergency_contact_phone"
                            label="Emergency Contact Phone Number"
                            value={formData.emergency_contact_phone}
                            error={fieldErrors.emergency_contact_phone}
                            onChange={handleChange}
                            helperText={"Enter the phone number of the client's emergency contact (optional)."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={{xs:2, md:2}}>
                        <Button sx={{marginY:1}} variant="outlined" onClick={handleCancel} fullWidth>Cancel</Button> 
                    </Grid>
                    <Grid size={{xs:2, md:2}}>
                        <Button
                        type="submit" 
                        sx={{marginY:1}} 
                        variant="contained" 
                        fullWidth>Save
                        </Button> 
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}