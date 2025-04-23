import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormDatePicker({ name, label, value, onChange, error, helperText, disabled, disableFuture = false, ...props }){
    return (
        <DatePicker
            name={name} 
            label={label}
            sx={{my:1, width:"100%"}}
            value={value}
            // The onChange prop from DatePicker provides the new value directly
            onChange={(newValue) => onChange(name, newValue)} // Pass name and value back
            disableFuture={disableFuture}
            disabled={disabled}
            slotProps={{
                textField:{
                    name: name,
                    error: !!error,
                    helperText: error || helperText,
                }
            }}
            {...props}
        />
    )
}