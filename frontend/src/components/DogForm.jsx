import React, { useState, useEffect, useCallback } from "react";
import { Grid, Box, Divider, FormControl, TextField, Select, InputLabel, MenuItem, Button } from "@mui/material";

export default function DogForm({dog, onSubmit}){
    const [formData, setFormData] = useState({
        name: dog?.name || '',
        breed: dog?.breed || '',
        date_of_birth: dog?.date_of_birth || '',
        sex: dog?.sex || '',
        owner: 'max',
        is_altered: dog?.is_altered ?? "", // Handle null explicitly
        color_markings: dog?.color_markings || '',
        weight_kg: dog?.weight_kg || '',
        status: dog?.status || 'PROSPECTIVE',
        vaccination_rabies: dog?.vaccination_rabies || '',
        vaccination_dhpp: dog?.vaccination_dhpp || '',
        vaccination_bordetella: dog?.vaccination_bordetella || '',
        parasites: dog?.parasites || '',
        veterinarian_name: dog?.veterinarian_name || '',
        veterinarian_phone: dog?.veterinarian_phone || '',
        medical_notes: dog?.medical_notes || '',
        behavioral_notes: dog?.behavioral_notes || '',
        training_goals: dog?.training_goals || '',
        previous_training: dog?.previous_training || '',
        skills: 'Sit'
    });
    const [photoFile, setPhotoFile] = useState(null) // State for the photo file object
    const [ photoPreview, setPhotoPreview] = useState(dog?.photo || null) // State for photo preview URL
    
    useEffect(() => {
        console.log('formData state changed:', formData);
    }, [formData]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle null for boolean 'is_altered' based on select value
        if (name === 'is_altered') {
             setFormData(prev => ({ ...prev, [name]: value === "null" ? null : value === "true" }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
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
        } else {
            // If file selection in cancelled, revert preview
            setPhotoFile(null)
            setPhotoPreview(dog?.photo || null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = new FormData()
        for (const key in formData) {
            // Ensure the key belongs to the object itself, not its prototype
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                const value = formData[key];

                // Handle 'is_altered' specifically: send 'true', 'false', or '' for null
                if (key === 'is_altered') {
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
                // Handle other fields
                else if (value !== null && value !== undefined) {
                    dataToSend.append(key, value); // Correct syntax

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

        console.log([...dataToSend.entries()])
        onSubmit(dataToSend) // Pass FormData to the submit handler
        console.log('submitting form data')
    }


    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <form onSubmit={handleSubmit}>
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
                    <Grid size={2}>
                        <TextField sx={{marginY: 1}} 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            id="outlined-basic" 
                            label="Name" 
                            helperText="Please enter the dog's name." 
                            fullWidth 
                            required/>
                        <TextField 
                            sx={{marginY: 1}} 
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange} 
                            id="outlined-basic" 
                            label="Breed" 
                            helperText="Please enter the dog's breed. Leave blank if unknown." 
                            fullWidth/>
                        <TextField 
                            sx={{marginY: 1}}
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}  
                            id="outlined-basic" 
                            label="Date of Birth" 
                            helperText="Please enter the dog's approximate date of birth. Leave blank if unknown."
                            fullWidth />
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Weight" 
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
                        <TextField sx={{marginY: 1}} id="outlined-basic" label="Color and Markings" fullWidth/>       
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
                            multiline rows={4} 
                            fullWidth/>
                    </Grid>
                    <Grid size={4}>
                        <Divider textAlign="left">Vaccination Information</Divider>
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="vaccination_rabies"
                            value={formData.vaccination_rabies}
                            onChange={handleChange}  
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Last Rabies Vaccination" f
                            ullWidth />
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="vaccination_dhpp"
                            value={formData.vaccination_dhpp}
                            onChange={handleChange}  
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Last DHPP Vaccination" 
                            fullWidth />
                    </Grid>
                    <Grid size={2}>
                        <TextField                            
                            name="vaccination_bordetella"
                            value={formData.vaccination_bordetella}
                            onChange={handleChange}  
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Last Bordetella Vaccination" 
                            fullWidth />
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            name="parasites"
                            value={formData.parasites}
                            onChange={handleChange}  
                            sx={{marginY: 1}} 
                            id="outlined-basic" 
                            label="Last Parasite Screen" 
                            fullWidth />
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