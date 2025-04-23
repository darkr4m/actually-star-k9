import React from 'react';
import { FormControl, InputLabel, Select, FormHelperText } from '@mui/material';

/**
 * Reusable wrapper for MUI Select field within a FormControl.
 */
export default function FormSelectField({ name, label, value, onChange, error, helperText, disabled, required = false, children, ...props }){
    return (
        <FormControl sx={{ marginY: 1 }} fullWidth error={!!error} disabled={disabled}>
        <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
        <Select
            labelId={`${name}-select-label`}
            id={`${name}-select`}
            name={name}
            value={value ?? ''} // Ensure value is not null/undefined
            label={label}
            onChange={onChange} // Use the passed onChange directly
            required={required}
            {...props} // Pass any other Select props
        >
            {children} {/* MenuItems are passed as children */}
        </Select>
        {/* Display helper text or error message */}
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
    )
}