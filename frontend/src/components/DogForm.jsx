import React, { useState, useEffect, useCallback } from "react";
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
        Grid, 
        Box, 
        Divider, 
        FormControl, 
        TextField, 
        Select, 
        InputLabel, 
        MenuItem,
        Button, 
        Alert,
        AlertTitle,
        FormHelperText 
    } from "@mui/material";


/**
 * DogForm Component
 * @param {object} dog - The dog object to edit, or null/undefined to create a new dog.
 * @param {function} onSubmit - Async function to handle form submission. Takes FormData, returns a promise.
 * @param {function} onCancel - Function to call when the cancel button is clicked.
 */
export default function DogForm({dog, onSubmit}){
    const [formData, setFormData] = useState({
        name: dog?.name || '',
        breed: dog?.breed || '',
        date_of_birth: dog?.date_of_birth ? dayjs(dog.date_of_birth) : null,
        sex: dog?.sex || '',
        owner: 'max',
        is_altered: dog?.is_altered ?? "", // Handle null explicitly
        color_markings: dog?.color_markings || '',
        weight_kg: dog?.weight_kg || '',
        status: dog?.status || 'PROSPECTIVE',
        vaccination_rabies: dog?.vaccination_rabies ? dayjs(dog.vaccination_rabies) : null,
        vaccination_dhpp: dog?.vaccination_dhpp ? dayjs(dog.vaccination_dhpp) : null,
        vaccination_bordetella: dog?.vaccination_bordetella ? dayjs(dog.vaccination_bordetella) : null,
        parasites: dog?.parasites ? dayjs(dog.parasites) : null,
        veterinarian_name: dog?.veterinarian_name || '',
        veterinarian_phone: dog?.veterinarian_phone || '',
        medical_notes: dog?.medical_notes || '',
        behavioral_notes: dog?.behavioral_notes || '',
        training_goals: dog?.training_goals || '',
        previous_training: dog?.previous_training || '',
        skills: 'Sit'
    });
    const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300/e0e0e0/999999?text=Dog+Photo';
    const [photoFile, setPhotoFile] = useState(null) // State for the photo file object
    const [ photoPreview, setPhotoPreview] = useState(dog?.photo || PLACEHOLDER_IMAGE) // State for photo preview URL
    const [submissionStatus, setSubmissionStatus] = useState('idle')
    const [errors, setErrors] = useState({})
    const [generalError, setGeneralError] = useState('')
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle null for boolean 'is_altered' based on select value
        if (name === 'is_altered') {
             setFormData(prev => ({ ...prev, [name]: value === "null" ? null : value === "true" }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
        // Clear error for this field when user starts typing/changing
        if(errors[name]){
            setErrors(prev => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
        // Clear general error when user interacts
        if(generalError) setGeneralError('');
        if(submissionStatus === "success") setSubmissionStatus('idle'); // Reset success state on interaction


    };

    const handlePhotoChange = (e) =>{
        const file = e.target.files[0];
        if(file) {
            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            }
            reader.readAsDataURL(file)
            // Clear photo-related errors if any
            if (errors.photo) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.photo;
                    return newErrors;
                });
           }

        } else {
            // If file selection in cancelled, revert preview
            setPhotoFile(null)
            setPhotoPreview(dog?.photo || PLACEHOLDER_IMAGE)
        }
        if (generalError) setGeneralError('');
        if (submissionStatus === 'success') setSubmissionStatus('idle');
    }

    const handleDateChange = (fieldName, newValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: newValue
        }))

        // Clear error for this field when user changes the date
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
        if (generalError) setGeneralError('');
        if (submissionStatus === 'success') setSubmissionStatus('idle');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('loading')// Set status to loading
        setErrors({}); // Clear previous errors
        setGeneralError(''); // Clear previous general error

        const dataToSend = new FormData()

        const dateFieldKeys = [
            'date_of_birth',
            'vaccination_rabies',
            'vaccination_dhpp',
            'vaccination_bordetella',
            'parasites'
        ]

        for (const key in formData) {
            // Ensure the key belongs to the object itself, not its prototype
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                const value = formData[key];

                if(dateFieldKeys.includes(key)){
                    if (value && dayjs.isDayjs(value) && value.isValid()){
                        dataToSend.append(key, value.format('YYYY-MM-DD'));
                    }
                }
                // Handle 'is_altered' specifically: send 'true', 'false', or '' for null
                else if (key === 'is_altered') {
                    if (value === null) {
                        dataToSend.append(key, ''); // Send empty string for null
                    } else {
                        dataToSend.append(key, value ? 'true' : 'false'); // Send 'true' or 'false' string
                    }
                }
                // Handle skills: Send as JSON string if it's an array, otherwise send as is
                else if (key === 'skills') {
                     if (Array.isArray(value)) {
                        // Option 1: Send as JSON string (if backend expects JSON)
                         dataToSend.append(key, JSON.stringify(value));
                         // Option 2: Append each item (if backend handles multiple values for same key)
                         // value.forEach(skill => dataToSend.append(key, skill));
                     } else if (value !== null && value !== undefined) {
                         // Send the string value if it's not an array
                         dataToSend.append(key, value);
                     } else {
                         dataToSend.append(key, ''); // Send empty string if null/undefined
                     }
                }
                else if (value !== null && value !== undefined) {
                    // Append other non-null/undefined values
                    dataToSend.append(key, value);

                } else {
                    // Append empty string for null or undefined values for other fields
                    dataToSend.append(key, '');
                }
            }
        }
        //append photo file if selected
        if(photoFile) {
            dataToSend.append('photo', photoFile, photoFile.name)
        }
        // If editing and no new photo, FormData won't include 'photo',
        // backend should handle this as "no change" for PATCH or require it for PUT.

        try {
            console.log("DogForm.handleSubmit(): Attempting to submit form data with data:", [...dataToSend.entries()])
            const response = await onSubmit(dataToSend) // Pass FormData to the submit handler
            setSubmissionStatus('success')
        } catch (error) {
            console.error("DogForm.handleSubmit(): submission failed - ", error)
            setSubmissionStatus('error') // Set status to error
            // --- DRF Backend Error Handling ---
            if(error.message && error.response.data && error.response.status === 400) {
                const backendErrors = error.response.data;
                console.log('DogForm.handleSubmit() - Backend validation errors:', backendErrors)
                const formattedErrors = []
                let nonFieldError = ''

                for (const key in backendErrors){
                    if(Array.isArray(backendErrors[key])){
                        const message = backendErrors[key].join(' ');
                        if(key === 'non_field_errors') {
                            nonFieldError = message;
                        } else {
                            formattedErrors[key] = message;
                        }
                    }
                }
                setErrors(formattedErrors)
                console.log(formattedErrors)
                setGeneralError(nonFieldError || 'Please check the highlighted fields for errors.')
            } else if (error.response) {
                // Handle other kinds of server errors (e.g., 500, 403, 404)
                setGeneralError(`DogForm.handleSubmit() - Server error: ${error.response.status} ${error.response.statusText || ''}.`)
            } else if(error.request){
                // Network error (no response received)
                setGeneralError('Network error. Please check your connection and try again.');
            } else {
                // Other errors (e.g., setup error in the request)
                setGeneralError(`An unexpected error occurred: ${error.message}`);
            }
            // --- End Backend Error Handling ---
        }
    }

    // Helper function to get error message for a field
    const getFieldError = (fieldName) => {
        return errors[fieldName] || ''; // Return the error string or empty string
    };

    // Helper function to generate helper text (error or default)
    const getHelperText = (fieldName, defaultText = '') => {
        return errors[fieldName] || defaultText;
    };

    const isLoading = submissionStatus === 'loading';

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <form onSubmit={handleSubmit}>
                {/* General Messages Area */}
                {submissionStatus === 'success' &&(
                    <Alert severity="success" sx={{mb:2}} onClose={()=>setSubmissionStatus('idle')}> {/* Allow dismissing success */}
                        <AlertTitle>Success</AlertTitle>
                        Dog Information saved successfully.
                    </Alert>
                )}
                {submissionStatus === 'error' && generalError && (
                    <Alert severity="error" sx={{my:2}} onClose={() => setGeneralError('')}> {/* Allow dismissing error */}
                        {/* <AlertTitle>Error</AlertTitle> */}
                        {generalError}
                    </Alert>
                )}


                <Grid sx={{maxWidth:900}} container columns={{xs:2, md:4}} rowSpacing={0} columnSpacing={{xs:1, sm:2, md:3}}>

                    <Grid size={4}>
                        <Divider textAlign="left">Basic Information</Divider>
                    </Grid>
                    <Grid size={2}sx={{display:'flex', alignItems: 'center', justifyContent: 'center'  }}>
                        <Box
                            sx={{
                                width: 300,
                                height: 300,
                                overflow: "hidden", // Ensures image doesn't spill out if styles fail
                            }}
                            >
                            <img
                                src={photoPreview}
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
                    {/* Basic Text Fields */}
                    <Grid size={2}>
                        <TextField sx={{marginY: 1}} 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            id="outlined-basic" 
                            label="Name" 
                            fullWidth 
                            required
                            error={!!errors.name}
                            helperText={getHelperText('name', "Enter the dog's name.")} 
                            disabled={isLoading}
                            />
                        <TextField 
                            sx={{marginY: 1}} 
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange} 
                            id="outlined-basic" 
                            label="Breed" 
                            helperText={getHelperText('breed', "Please enter the dog's breed. Leave blank if unknown.")} 
                            fullWidth/>
                        <DatePicker
                            name="date_of_birth" 
                            label="Date of Birth"
                            sx={{marginY:1, width:"100%"}} 
                            value={formData.date_of_birth}
                            onChange={(newValue) => handleDateChange('date_of_birth', newValue)}
                            disableFuture
                            slotProps={{
                                textField: {
                                    helperText:"Please enter the dog's approximate date of birth. Leave blank if unknown."
                                }
                            }} />
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="weight_kg"
                            value={formData.weight_kg}
                            onChange={handleChange}
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Weight" 
                            helperText={getHelperText('weight_kg', "Please enter the dog's approximate weight in kg. Leave blank if unknown.")} 
                            fullWidth />
                    </Grid>
                    <Grid size={1}>
                        <FormControl sx={{marginY:1}} fullWidth>
                            <InputLabel id="sex-select-label">Sex</InputLabel>
                                <Select
                                labelId="sex-select-label"
                                id="sex-select"
                                name="sex"
                                value={formData.sex}
                                label="Sex"
                                onChange={handleChange}
                                >
                                <MenuItem value={'UNKNOWN'}>Unknown</MenuItem>
                                <MenuItem value={'MALE'}>Male</MenuItem>
                                <MenuItem value={'FEMALE'}>Female</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={1}>
                        <FormControl sx={{marginY:1}} fullWidth>
                            <InputLabel id="spayed-neutered-select-label">Spayed/Neutered</InputLabel>
                                <Select
                                labelId="spayed-neutered-select-label"
                                id="spayed-neutered-select"
                                name="is_altered"
                                value={formData.is_altered === null ? "null" : String(formData.is_altered)}
                                label="Spayed/Neutered"
                                onChange={handleChange}
                                >
                                <MenuItem value={"null"}>Unknown</MenuItem>
                                <MenuItem value={"true"}>Yes</MenuItem>
                                <MenuItem value={"false"}>No</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={4}>
                        <TextField 
                        name="color_markings"
                        value={formData.color_markings}
                        onChange={handleChange}
                        sx={{marginY: 1}} 
                        id="outlined-basic" 
                        label="Color and Markings"
                        helperText= {getHelperText('color_markings', "Describe the dog's primary colors and any distinct markings. Max 150 characters.")}
                        fullWidth/>       
                    </Grid>
                    <Grid size={2} sx={{alignContent: "center"}}>
                        <Button variant="contained" component="label" fullWidth>
                            Upload File
                            <input type="file"
                            name="photo"
                            id="photo"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handlePhotoChange} 
                            hidden />
                        </Button>
                    </Grid>
                    <Grid size={2}>
                        <FormControl sx={{marginY:1}} fullWidth>
                            <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                labelId="status-select-label"
                                id="status-select"
                                name="status"
                                value={formData.status}
                                label="Status"
                                onChange={handleChange}
                                >
                                <MenuItem value={'PROSPECTIVE'}>Prospective</MenuItem>
                                <MenuItem value={'ACTIVE'}>Active</MenuItem>
                                <MenuItem value={'WAITLIST'}>Waitlist</MenuItem>
                                <MenuItem value={'INACTIVE'}>Inactive</MenuItem>
                                
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={4}>
                        <Divider textAlign="left">Training Details</Divider>
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            name="behavioral_notes"
                            value={formData.behavioral_notes}
                            onChange={handleChange} 
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Behavioral Notes" 
                            multiline rows={4}
                            helperText={getHelperText('behavioral_notes', "Describe any known behavioral issues (anxiety, reactivity, resource guarding, bite history). Max 1000 characters.")} 
                            fullWidth/>
                    </Grid>
                    <Grid size={4}>
                        <TextField 
                            name="training_goals"
                            value={formData.training_goals}
                            onChange={handleChange} 
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Training Goals" 
                            multiline rows={4}
                            helperText={getHelperText('training_goals', "Describe the owner's specific training goals for this dog. Max 1000 characters.")} 
                            fullWidth/>
                    </Grid>
                    <Grid size={4}>
                        <TextField 
                            name="previous_training"
                            value={formData.previous_training}
                            onChange={handleChange} 
                            sx={{marginY: 1}}
                            id="outlined-basic" 
                            label="Previous Training" 
                            multiline rows={4}
                            helperText={getHelperText('previous_training', "Describe any previous training classes, private sessions, or known commands/skills the dog has. Max 1000 characters.")}  
                            fullWidth/>
                    </Grid>
                    <Grid size={4}>
                        <Divider textAlign="left">Medical Information</Divider>
                    </Grid>
                    <Grid size={2} rows={2}>
                        <Grid>
                            <TextField
                                name="veterinarian_name"
                                value={formData.veterinarian_name}
                                onChange={handleChange}  
                                sx={{marginY: 1}} 
                                id="outlined-basic" 
                                label="Veterinarian Name"
                                helperText={getHelperText('veterinarian_name', "Please enter the name of the dog's primary veterinarian/clinic.")}
                                fullWidth/>
                        </Grid>
                        <Grid>
                            <TextField
                                name="veterinarian_phone"
                                value={formData.veterinarian_phone}
                                onChange={handleChange}  
                                sx={{marginY: 1}} 
                                id="outlined-basic" 
                                label="Veterinarian Phone Number" 
                                helperText={getHelperText('veterinarian_phone', "Please enter the phone number of the dog's primary veterinarian/clinic.")}
                                fullWidth/>
                        </Grid>
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="medical_notes"
                            value={formData.medical_notes}
                            onChange={handleChange}  
                            sx={{marginY: 1.1}} 
                            id="outlined-basic" 
                            label="Medical Notes" 
                            multiline rows={5}
                            helperText={getHelperText('medical_notes', "Note any ongoing medical conditions, past surgeries, allergies, or medication requirements. Max 1000 characters.")} 
                            fullWidth/>
                    </Grid>
                    <Grid size={4}>
                        <Divider textAlign="left">Vaccination Information</Divider>
                    </Grid>
                    <Grid size={2}>
                        <DatePicker
                            name="vaccination_rabies" 
                            label="Last Rabies Vaccination"
                            sx={{marginY:1, width:"100%"}} 
                            value={formData.vaccination_rabies}
                            onChange={(newValue) => handleDateChange('vaccination_rabies', newValue)}
                            disableFuture
                            slotProps={{
                                textField: {
                                    helperText:"Please enter the date of the dog's last rabies vaccination. Leave blank if unknown."
                                }
                            }} />
                    </Grid>
                    <Grid size={2}>
                        <DatePicker
                            name="vaccination_dhpp" 
                            label="Last DHPP Vaccination"
                            sx={{marginY:1, width:"100%"}} 
                            value={formData.vaccination_dhpp}
                            onChange={(newValue) => handleDateChange('vaccination_dhpp', newValue)}
                            disableFuture
                            slotProps={{
                                textField: {
                                    helperText:"Please enter the date of the dog's last DHPP vaccination. Leave blank if unknown."
                                }
                            }} />
                    </Grid>
                    <Grid size={2}>
                        <DatePicker
                            name="vaccination_bordetella" 
                            label="Last Bordetella Vaccination"
                            sx={{marginY:1, width:"100%"}} 
                            value={formData.vaccination_bordetella}
                            onChange={(newValue) => handleDateChange('vaccination_bordetella', newValue)}
                            disableFuture
                            slotProps={{
                                textField: {
                                    helperText:"Please enter the date of the dog's last Bordetella vaccination. Leave blank if unknown."
                                }
                            }} />
                    </Grid>
                    <Grid size={2}>
                    <DatePicker
                            name="parasites" 
                            label="Last Parasite Screening"
                            sx={{marginY:1, width:"100%"}} 
                            value={formData.parasites}
                            onChange={(newValue) => handleDateChange('parasites', newValue)}
                            disableFuture
                            slotProps={{
                                textField: {
                                    helperText:"Please enter the date of the dog's last parasite screening. Leave blank if unknown."
                                }
                            }} />
                    </Grid>
                    <Grid size={{xs:1, md:2}}>
                        <Button sx={{marginY:1}} variant="outlined" fullWidth>Cancel</Button> 
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
            </form>
        </div>
    )
}