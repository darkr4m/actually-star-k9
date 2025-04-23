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

import useDogDetail from '../../hooks/useDogDetail'
import useDogForm from '../../hooks/useDogForm'

import FormSectionDivider from "../../components/common/forms/FormSectionDivider";
import FormTextField from "../../components/common/forms/FormTextField";
import FormDatePicker from "../../components/common/forms/FormDatePicker";
import PhotoUploadField from "../../components/common/forms/PhotoUploadField";
import FormSelectField from '../../components/common/forms/FormSelectField'


/**
 * DogForm Component
 * @param {object} dog - The dog object to edit, or null/undefined to create a new dog.
 * @param {function} onSubmit - Async function to handle form submission. Takes FormData, returns a promise.
 * @param {function} onCancel - Function to call when the cancel button is clicked.
 */
export default function DogFormPage(){
    // --- Hooks ---
    const { id } = useParams() // Get ID from URL if present
    const navigate = useNavigate()
    const isEditMode = Boolean(id); // Determine if we are editing
    const mode = isEditMode ? 'edit' : 'add'; // Set mode

    // --- Data Fetching (Edit Mode Only) ---
    // Fetch dog details required for editing. Pass null if adding.
    const { dog: initialData, isLoading: isLoadingDetail, error: detailError } = useDogDetail(isEditMode ? id : null)

    // --- Form State and Logic Hook ---
    // Instantiate the custom hook, passing initial data and mode info.
    // It returns all the necessary state and handlers for the form.
    const {
        formData,           // Current form data state object
        photoPreview,       // URL for photo preview
        isSubmitting,       // Boolean indicating if form is currently submitting
        fieldErrors,        // Object containing field-specific validation errors
        generalError,       // String for general/non-field errors
        successMessage,     // String for success message after submission
        handleChange,       // Handler for text input changes
        handleSelectChange, // Handler for select input changes
        handleDateChange,   // Handler for date picker changes
        handlePhotoChange,  // Handler for photo file input changes
        handleSubmit,       // Handler for form submission
        PLACEHOLDER_IMAGE   // Constant for placeholder image URL
    } = useDogForm(initialData, id, isEditMode); // Pass fetched initialData to the hook

    // --- Cancel Handler ---
    // Navigates back to the detail page (if editing) or the list page (if adding).
    const handleCancel = () => {
        navigate(isEditMode ? `/dogs/${id}` : '/dogs');
    };

    // --- Render Logic ---
    // --- Handle Loading State (Edit Mode Only)
    if(isEditMode && isLoadingDetail) {
        return (
            <Box sx={{display:'flex', justifyContent: 'center', alignItems:'center', padding: '2rem'}}>
                <CircularProgress />
                <Typography sx={{ marginLeft: 2 }}>Loading dog details...</Typography>
            </Box>
        )
    }

    // --- Handle Data Fetching Error (Edit Mode Only)
    // Show an error message if fetching the dog's details failed.
    if (isEditMode && detailError) {
        return <Alert severity="error" sx={{ margin: 2 }}>Error loading dog details: {detailError.message}</Alert>;
    }

    // --- Handle Dog Not Found (Edit Mode Only)
    // Show a message if the fetch completed but no dog was found for the ID.
    if (isEditMode && !initialData && !isLoadingDetail) {
         return <Alert severity="warning" sx={{ margin: 2 }}>Dog not found (ID: {id}).</Alert>;
    }


    return (
        <Box sx={{
            padding: {sx:1, sm:2, md:3},
            margin: 'auto',
            display:'flex',
            flexDirection: 'column',
            alignItems: 'center'
            }}>
            {/* Display Success/Error Messages */}

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
                {isEditMode ? `Edit Dog: ${initialData?.name || ''}` : 'Add New Dog'}
            </Typography>
            {/* Form Element */}
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{width:'70vw'}}>
                <Grid container columns={{xs: 2, md:4}} rowSpacing={1} columnSpacing={{xs:1, sm:2, md:3}}>
                    <Grid size={4}>
                        <FormSectionDivider>Basic Information</FormSectionDivider>
                    </Grid>
                    <Grid size={2} sx={{display:'flex', alignItems: 'center', justifyContent: 'center'  }}>
                        {/* IMAGE */}
                        <Box
                            sx={{
                                width: 300,
                                height: 300,
                                overflow: "hidden", // Ensures image doesn't spill out if styles fail
                            }}>
                            <img
                                src={initialData?.photo || PLACEHOLDER_IMAGE}
                                alt="Preview of the selected photo" // Provide a meaningful description
                                style={{
                                    display: 'block', // Removes extra space below inline images
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    border:'4px solid pink',
                                    borderRadius: '50%'
                                }}
                                />
                        </Box>
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                            name="name"
                            label="Name"
                            value={formData.name}
                            error={fieldErrors.name}
                            onChange={handleChange}
                            helperText={"Enter the dog's name."}
                            disabled={isSubmitting}
                            required
                            />
                        <FormTextField
                            name="breed"
                            label="Breed"
                            value={formData.breed}
                            error={fieldErrors.breed}
                            onChange={handleChange}
                            helperText={"Please enter the dog's breed. Leave blank if unknown."}
                            disabled={isSubmitting}
                            />
                        <FormDatePicker
                            name="date_of_birth"
                            label="Date of Birth"
                            value={formData.date_of_birth}
                            error={fieldErrors.data_of_birth}
                            onChange={handleDateChange}
                            helperText={"Please enter the dog's approximate date of birth. Leave blank if unknown."}
                            disableFuture
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormTextField 
                            name="weight_kg"
                            label="Weight (kg)"
                            value={formData.weight_kg}
                            error={fieldErrors.weight_kg}
                            type="number"
                            inputProps={{ step: "0.1", min: "0" }}
                            onChange={handleChange}
                            helperText={"Please enter the dog's approximate weight in kg. Leave blank if unknown."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={1}>
                        <FormSelectField 
                            name="sex"
                            label="Sex"
                            value={formData.sex}
                            onChange={handleSelectChange}
                            error={fieldErrors.sex}
                            disabled={isSubmitting}
                        >
                            <MenuItem value={'UNKNOWN'}>Unknown</MenuItem>
                            <MenuItem value={'MALE'}>Male</MenuItem>
                            <MenuItem value={'FEMALE'}>Female</MenuItem>
                        </FormSelectField>
                    </Grid>
                    <Grid size={1}>
                        <FormSelectField 
                                name="is_altered"
                                label="Spayed/Neutered"
                                value={formData.is_altered === null ? "null" : String(formData.is_altered)}
                                onChange={handleSelectChange}
                                error={fieldErrors.is_altered}
                                disabled={isSubmitting}
                            >
                                <MenuItem value={"null"}>Unknown</MenuItem>
                                <MenuItem value={"true"}>Yes</MenuItem>
                                <MenuItem value={"false"}>No</MenuItem>
                            </FormSelectField>
                    </Grid>
                    <Grid size={4}>
                        <FormTextField
                                name="color_markings"
                                label="Color and Markings"
                                value={formData.color_markings}
                                error={fieldErrors.color_markings}
                                onChange={handleChange}
                                helperText={"Describe the dog's primary colors and any distinct markings. Max 150 characters."}
                                disabled={isSubmitting}
                                />
                    </Grid>
                    <Grid size={2}>
                        <PhotoUploadField
                            photoPreview={photoPreview}
                            onChange={handlePhotoChange}
                            error={fieldErrors.photo}
                            disabled={isSubmitting}
                            placeholderImage={PLACEHOLDER_IMAGE}
                            />
                    </Grid>
                    <Grid size={2}>
                        <FormSelectField 
                                name="status"
                                label="Status"
                                value={formData.status}
                                onChange={handleSelectChange}
                                error={fieldErrors.status}
                                disabled={isSubmitting}
                            >
                                <MenuItem value={'PROSPECTIVE'}>Prospective</MenuItem>
                                <MenuItem value={'ACTIVE'}>Active</MenuItem>
                                <MenuItem value={'WAITLIST'}>Waitlist</MenuItem>
                                <MenuItem value={'INACTIVE'}>Inactive</MenuItem>
                            </FormSelectField>
                    </Grid>
                    <Grid size={4}>
                        <FormSectionDivider>Training Details</FormSectionDivider>
                    </Grid>
                    <Grid size={4}>
                        <FormTextField
                            name="behavioral_notes"
                            label="Behavioral Notes"
                            multiline
                            rows={4}
                            value={formData.behavioral_notes}
                            error={fieldErrors.behavioral_notes}
                            onChange={handleChange}
                            helperText={"Describe any known behavioral issues (anxiety, reactivity, resource guarding, bite history). Max 1000 characters."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={4}>
                        <FormTextField
                            name="training_goals"
                            label="Training Goals"
                            multiline
                            rows={4}
                            value={formData.training_goals}
                            error={fieldErrors.training_goals}
                            onChange={handleChange}
                            helperText={"Describe the owner's specific training goals for this dog. Max 1000 characters."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={4}>
                        <FormTextField
                            name="previous_training"
                            label="Previous Training"
                            multiline
                            rows={4}
                            value={formData.previous_training}
                            error={fieldErrors.previous_training}
                            onChange={handleChange}
                            helperText={"Describe any previous training classes, private sessions, or known commands/skills the dog has. Max 1000 characters."}
                            disabled={isSubmitting}
                            />
                    </Grid>
                    <Grid size={4}>
                        <FormSectionDivider>Medical Information</FormSectionDivider>
                    </Grid>
                    <Grid size={2} rows={2}>
                        <Grid size={{md:4}}>
                        <FormTextField
                                name="veterinarian_name"
                                label="Veterinarian Name"
                                value={formData.veterinarian_name}
                                error={fieldErrors.veterinarian_name}
                                onChange={handleChange}
                                helperText={"Please enter the name of the dog's primary veterinarian/clinic."}
                                disabled={isSubmitting}
                                />
                        </Grid>
                        <Grid size={{md:4}}>
                        <FormTextField
                                name="veterinarian_phone"
                                label="Veterinarian Phone Number"
                                value={formData.veterinarian_phone}
                                error={fieldErrors.veterinarian_phone}
                                onChange={handleChange}
                                helperText={"Please enter the phone number of the dog's primary veterinarian/clinic."}
                                disabled={isSubmitting}
                                />
                        </Grid>
                    </Grid>
                    <Grid size={2}>
                        <FormTextField
                                name="medical_notes"
                                label="Medical Notes"
                                multiline
                                rows={5}
                                value={formData.medical_notes}
                                error={fieldErrors.medical_notes}
                                onChange={handleChange}
                                helperText={"Note any ongoing medical conditions, past surgeries, allergies, or medication requirements. Max 1000 characters."}
                                disabled={isSubmitting}
                                />
                    </Grid>
                    <Grid size={4}>
                        <FormSectionDivider>Vaccination Information</FormSectionDivider>
                    </Grid>
                    <Grid size={2}>
                        <FormDatePicker 
                            name="vaccination_rabies" 
                            label="Last Rabies Vaccination" 
                            value={formData.vaccination_rabies} 
                            onChange={handleDateChange} 
                            error={fieldErrors.vaccination_rabies} 
                            helperText="Please enter the date of the dog's last rabies vaccination. Leave blank if unknown." 
                            disableFuture 
                            disabled={isSubmitting} />
                    </Grid>
                    <Grid size={2}>
                        <FormDatePicker 
                            name="vaccination_dhpp" 
                            label="Last DHPP Vaccination" 
                            value={formData.vaccination_dhpp} 
                            onChange={handleDateChange} 
                            error={fieldErrors.vaccination_dhpp} 
                            helperText="Please enter the date of the dog's last DHPP vaccination. Leave blank if unknown." 
                            disableFuture 
                            disabled={isSubmitting} />
                    </Grid>
                    <Grid size={2}>
                        <FormDatePicker 
                            name="vaccination_bordetella" 
                            label="Last Bordetella Vaccination" 
                            value={formData.vaccination_bordetella} 
                            onChange={handleDateChange} 
                            error={fieldErrors.vaccination_bordetella} 
                            helperText="Please enter the date of the dog's last Bordetella vaccination. Leave blank if unknown." 
                            disableFuture 
                            disabled={isSubmitting} />
                    </Grid>
                    <Grid size={2}>
                        <FormDatePicker 
                            name="parasites" 
                            label="Last Parasite Screening" 
                            value={formData.parasites} 
                            onChange={handleDateChange} 
                            error={fieldErrors.parasites} 
                            helperText="Please enter the date of the dog's last parasite screening. Leave blank if unknown." 
                            disableFuture 
                            disabled={isSubmitting} />
                    </Grid>
                    <Grid size={{xs:1, md:2}}>
                        <Button sx={{marginY:1}} variant="outlined" onClick={handleCancel} fullWidth>Cancel</Button> 
                    </Grid>
                    <Grid size={{xs:1, md:2}}>
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