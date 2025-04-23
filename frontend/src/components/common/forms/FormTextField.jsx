import React from 'react';
import TextField from '@mui/material/TextField';

export default function FormTextField({
    name, 
    label, 
    value, 
    onChange, 
    error, 
    helperText, 
    disabled, 
    required=false, 
    multiline=false,
    rows = 1,
    ...props
}){
    return (
        <TextField 
            sx={{my:1}} // Consistent vertical margin
            name={name}
            value={value ?? ''} // Ensure value is not null/undefined for controlled input
            onChange={onChange}
            label={label}
            fullWidth
            required={required}
            multiline={multiline}
            rows={rows}
            error={!!error} // Convert error message string to boolean for MUI
            helperText={error || helperText}
            disabled={disabled}
            variant="outlined"
            {...props}
        />
    )
};