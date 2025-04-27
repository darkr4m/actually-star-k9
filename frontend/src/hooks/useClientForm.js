import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient, updateClient } from '../services/clientsService';
import useClients from './useClients'

/**
 * Custom Hook to manage the state and logic for the Client (dog owner) Add/Edit form.
 *
 * @param {object | null} initialData - The initial client data for editing, or null for adding.
 * @param {string | undefined} id - The ID of the client being edited, undefined for adding.
 * @param {boolean} isEditMode - Flag indicating if the form is in edit mode.
 */
export default function useClientForm(initialData, id, isEditMode){
    const navigate = useNavigate();
    const { fetchClients } = useClients(false);

    const CLIENT_DATA_FORM = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: null,
        emergency_contact_name: '',
        emergency_contact_phone: null,
    }

    // --- State managed by the hook ---
    const [ formData, setFormData ] = useState(CLIENT_DATA_FORM);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ fieldErrors, setFieldErrors ] = useState({});
    const [ generalError, setGeneralError ] = useState('');
    const [ successMessage, setSuccessMessage ] = useState('');

    // --- Utility to clear messages ---
    const clearMessages = useCallback(() => {
        setGeneralError('')
        setSuccessMessage('')
    },[])

    // --- Effect to Populate Form on Edit ---
    useEffect(() =>{
        if(isEditMode && initialData){
            console.log("useClientForm() Populating form with initial data:", initialData);
            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || '',
                phone_number: initialData.phone_number || null,
                emergency_contact_name: initialData.emergency_contact_name || '',
                emergency_contact_phone: initialData.emergency_contact_phone || null
            })
            setIsSubmitting(false);
            setFieldErrors({});
            clearMessages();
        } else if (!isEditMode) {
            // Reset form for add mode if initialData somehow existed
            setFormData(CLIENT_DATA_FORM)
        }
    },[isEditMode, initialData])


    // --- Input Handlers
    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({...prev, [name]: value}));
        if(fieldErrors[name]){
            setFieldErrors(prev => {
                const newErrors = { ...prev}; 
                delete newErrors[name]; 
                return newErrors
            })
        clearMessages();
        }
    }, [fieldErrors, clearMessages])

    const handleSelectChange = useCallback((e) =>{
        const { name, value } = e.target
        setFormData(prev => ( {...prev, [name]: value }))
        if(fieldErrors[name]){
            setFieldErrors(prev =>{
                const newErrors = { ...prev }
                delete newErrors[name];
                return newErrors;
            })
        }
        clearMessages()
    }, [ fieldErrors, clearMessages ])

    // --- Submission Handler ---
    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault() // Prevent default form submission if event is passed
        setIsSubmitting(true);
        setFieldErrors({});
        clearMessages()
        
        const dataToSend = formData;

        // Build FormData (using formData from state)
        // for (const key in formData){
        //     if (Object.hasOwnProperty.call(formData, key)){
        //         const value = formData[key]
        //         if(value !== null && value !==undefined){
        //             dataToSend.append(key, value)
        //         } else {
        //             dataToSend.append(key, '')
        //         }
        //     }
        // }
        console.log(`useClientForm Hook: Submitting form in ${isEditMode ? 'edit' : 'add'} mode. FormData:`, dataToSend);
        try {
            let savedClient;
            if (isEditMode) {
                if(!id) throw new Error("Client ID is missing for an update.")// Safety check
                savedClient = await updateClient(id, dataToSend)
            } else {
                savedClient = await addClient(dataToSend)
            }
            console.log(`useClientForm Hook: Client ${isEditMode ? 'updated' : 'added'} successfully:`, savedClient)
            fetchClients() // Refresh list

            setTimeout(() => {
                navigate(`/clients/`, { replace: true });
            }, 1500);
        } catch (error) {
            console.error(`useClientForm Hook: Failed to ${isEditMode ? 'update' : 'add'} client:`, error);
             if (error.response?.data && error.response?.status === 400) {
                const backendErrors = error.response.data;
                const formattedErrors = {};
                let nonFieldError = '';
                for (const key in backendErrors) {
                     if (Array.isArray(backendErrors[key])) {
                        const message = backendErrors[key].join(' ');
                        if (key === 'non_field_errors') nonFieldError = message; else formattedErrors[key] = message;
                    } else if (typeof backendErrors[key] === 'string') {
                         if (key === 'non_field_errors' || key === 'detail') nonFieldError = backendErrors[key]; else formattedErrors[key] = backendErrors[key];
                    }
                }
                setFieldErrors(formattedErrors);
                setGeneralError(nonFieldError || 'Please check the form for errors.');
            } else if (error.response) {
                setGeneralError(`Server error: ${error.response.status} ${error.response.statusText || ''}.`);
            } else if (error.request) {
                setGeneralError('Network error. Please check connection.');
            } else {
                setGeneralError(`Unexpected error: ${error.message}`);
            }
             setIsSubmitting(false); // Reset submitting state only on error
        }
    },[
        formData, isEditMode, id, // Dependencies for logic inside handleSubmit
        navigate, fetchClients, clearMessages // Stable functions/dependencies
    ])

    return {
        // --- Return values needed by the component ---
        formData,
        isSubmitting,
        fieldErrors,
        generalError,
        successMessage,
        handleChange,
        handleSelectChange,
        handleSubmit
    }

}