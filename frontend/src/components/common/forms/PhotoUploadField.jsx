import React from "react";
import { Grid, Box, Button, FormHelperText } from '@mui/material';

/**
 * Component for displaying a photo preview and providing an upload button.
 */
export default function PhotoUploadField({ photoPreview, onChange, error, helperText, disabled, placeholderImage }){
    return (
        <Grid container spacing={2} alignItems="center" sx={{my: 1}}>
            {/* Preview Image */}
            <Grid size={3} sx={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Box sx={{ width: 80, height: 80, overflow: "hidden", border: '3px solid grey', background: '#f0f0f0' }}>
                    <img 
                        src={photoPreview || placeholderImage} 
                        alt="Dog photo preview"
                        style={{display:'block', width: '100%', height: '100%', objectFit: 'cover'}}
                        // Add onError handler for broken image links
                        onError={(e) =>{ if(e.target.src !== placeholderImage) e.target.src = placeholderImage }}
                        />
                </Box>
            </Grid>
            {/* Upload Button and Helper Text */}
            <Grid size={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button variant="contained" component="label" disabled={disabled} fullWidth>Upload Photo
                {/* The actual file input is hidden */}
                    <input
                        type="file"
                        name="photo" // Name attribute for potential form submission without JS
                        accept="image/jpeg,image/png,image/gif" // Specify acceptable file types
                        onChange={onChange} // Trigger handler when a file is selected
                        hidden
                    />
                </Button>
                <FormHelperText error={!!error} sx={{ textAlign: 'center', marginTop: 0.5 }}>
                    {error || helperText || 'Max 2MB. JPG, PNG, GIF.'}
                </FormHelperText>
            </Grid>
        </Grid>
    )
}