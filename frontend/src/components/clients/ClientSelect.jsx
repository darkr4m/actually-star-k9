import React, { useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import useClients from "../../hooks/useClients"

export default function ClientSelect({
    value,
    onChange,
    error,
    label = "Owner",
    helperText,
    required=true,
    ...props
}){
    const { clients, isLoading, error:fetchError } = useClients()

    const clientOptions = useMemo(() => {
        if (!clients) return [];
        return clients.map((client) => ({
            id: client.id,
            label: client.get_full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() // Display label
        }));
    }, [clients]); 

    // 2. Find the selected option object based on the incoming 'value' (which is an ID)
    const selectedOption = useMemo(() => {
        // Handle null/undefined initial value gracefully
        if (value === null || value === undefined) {
            return null;
        }
        return clientOptions.find(option => option.id === value) || null;
    }, [value, clientOptions]); // Recalculate when value or options change

    // 3. Handle selection change
    const handleChange = (event, newValueObject) => {
        // newValueObject will be the selected option object (e.g., {id: 1, label: 'Alice Smith'}) or null
        if (onChange) {
            onChange(newValueObject ? newValueObject.id : null); // Pass the ID (or null) back up
        }
    };


    return (
        <>
        <Autocomplete
            disablePortal
            disableClearable
            options={clientOptions}
            sx={{ width: 300 }}
            value={selectedOption}
            isOptionEqualToValue={(option, val) => option.id === val?.id} // Crucial: Compare options based on ID
            getOptionLabel={(option) => option.label || ''} // Tell Autocomplete how to display each option object
            onChange={handleChange}
            renderInput={(params) => <TextField 
                {...params} 
                label={label}
                required={required}
                error={error || fetchError}
                helperText={helperText}
                />}
            />
        </>
    )
}