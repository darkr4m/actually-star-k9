import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { addDog, updateDog } from "../services/dogsService"
import useDogs from './useDogs'; // To get fetchDogs for list refresh

const PLACEHOLDER_IMAGE = 'https://placehold.co/200x200/e0e0e0/999999?text=Dog+Photo';

/**
 * Custom Hook to manage the state and logic for the Dog Add/Edit form.
 *
 * @param {object | null} initialData - The initial dog data for editing, or null for adding.
 * @param {string | undefined} dogId - The ID of the dog being edited, undefined for adding.
 * @param {boolean} isEditMode - Flag indicating if the form is in edit mode.
 */
export default function useDogForm(initialData, dogId, isEditMode){
    const navigate = useNavigate()
    const { fetchDogs } = useDogs(false)

    // --- Initial Form State ---
    const DOG_DATA_FORM = { 
        name: '', 
        breed: '', 
        date_of_birth: null, 
        sex: 'UNKNOWN', 
        owner: null,
        is_altered: null, 
        color_markings: '', 
        weight_kg: '', 
        status: 'PROSPECTIVE',
        vaccination_rabies: null, 
        vaccination_dhpp: null, 
        vaccination_bordetella: null,
        parasites: null, 
        veterinarian_name: '', 
        veterinarian_phone: '',
        medical_notes: '', 
        behavioral_notes: '', 
        training_goals: '',
        previous_training: '', 
        skills: 'Sit'
    }    
    // --- State managed by the hook ---
    const [formData, setFormData] = useState(DOG_DATA_FORM);
    const [ photoFile, setPhotoFile ] = useState(null);
    const [ photoPreview, setPhotoPreview] = useState(PLACEHOLDER_IMAGE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Effect to Populate Form on Edit ---
    useEffect(() =>{
        if(isEditMode && initialData){
            console.log("useDogForm() Populating form with initial data:", initialData);
            setFormData({
                name: initialData.name || '',
                breed: initialData.breed || '',
                date_of_birth: initialData.date_of_birth ? dayjs(initialData.date_of_birth) : null,
                sex: initialData.sex || 'UNKNOWN',
                owner: initialData.owner_details.id || null,
                is_altered: initialData.is_altered,
                color_markings: initialData.color_markings || '',
                weight_kg: initialData.weight_kg || '',
                status: initialData.status || 'PROSPECTIVE',
                vaccination_rabies: initialData.vaccination_rabies ? dayjs(initialData.vaccination_rabies) : null,
                vaccination_dhpp: initialData.vaccination_dhpp ? dayjs(initialData.vaccination_dhpp) : null,
                vaccination_bordetella: initialData.vaccination_bordetella ? dayjs(initialData.vaccination_bordetella) : null,
                parasites: initialData.parasites ? dayjs(initialData.parasites) : null,
                veterinarian_name: initialData.veterinarian_name || '',
                veterinarian_phone: initialData.veterinarian_phone || '',
                medical_notes: initialData.medical_notes || '',
                behavioral_notes: initialData.behavioral_notes || '',
                training_goals: initialData.training_goals || '',
                previous_training: initialData.previous_training || '',
                skills: 'Drooling'
            });
            setPhotoPreview(initialData.photo || PLACEHOLDER_IMAGE);
            // Reset other state when initial data changes (navigating between edits)
            setPhotoFile(null);
            setIsSubmitting(false);
            setFieldErrors({});
            clearMessages()
        } else if (!isEditMode) {
            // Reset form for add mode if initialData somehow existed
            setFormData(DOG_DATA_FORM);
            setPhotoPreview(PLACEHOLDER_IMAGE);
            setPhotoFile(null);
            // Reset other state only if needed (e.g., navigating from edit to add)
            setIsSubmitting(false);
            setFieldErrors({});
            clearMessages()
        }
    }, [isEditMode, initialData])

    // --- Utility to clear messages ---
    const clearMessages = useCallback(() => {
        setGeneralError('')
        setSuccessMessage('')
    },[])

    // --- Input Handlers (memoized with useCallback) ---
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

    const handleDateChange = useCallback((fieldName, newValue) => {
        setFormData(prev => ({ ...prev, [fieldName]: newValue }));
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors;
            });
        }
        clearMessages();
    }, [fieldErrors, clearMessages]);

    const handleSelectChange = useCallback((e) =>{
        const { name, value } = e.target
        if(name === 'is_altered'){
            setFormData(prev => ({ ...prev, [name]:value === "null" ? null : value === "true"}));
        } else {
            setFormData(prev => ({ ...prev, [name]:value}))
        }
        if(fieldErrors[name]){
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]; 
                return newErrors
            })
        }
        clearMessages()
    }, [ fieldErrors, clearMessages ])

    const handleOwnerChange = useCallback((ownerId)=>{
        setFormData(prev => ({...prev, owner:ownerId}));
        if(fieldErrors.owner){
            setFieldErrors(prev => {
                const newErrors = { ...prev }; delete newErrors.owner; return newErrors;
            });
        }
        clearMessages();
    }, [fieldErrors, clearMessages] )

    const handlePhotoChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setPhotoPreview(reader.result); };
            reader.readAsDataURL(file);
            if (fieldErrors.photo) {
                setFieldErrors(prev => {
                    const newErrors = { ...prev }; delete newErrors.photo; return newErrors;
                });
            }
        } else {
            setPhotoFile(null); // Reset if file selection is cancelled
            setPhotoPreview(initialData?.photo || PLACEHOLDER_IMAGE); // Use initialData from closure
        }
        clearMessages();
    }, [fieldErrors, clearMessages, initialData]); // Depend on initialData for resetting preview

    // --- Submission Handler ---
    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault(); // Prevent default form submission if event is passed
        setIsSubmitting(true);
        setFieldErrors({});
        clearMessages();

        const dataToSend = new FormData();
        const dateFieldKeys = ['date_of_birth', 'vaccination_rabies', 'vaccination_dhpp', 'vaccination_bordetella', 'parasites'];

        // Build FormData (using formData from state)
        for (const key in formData) {
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
                const value = formData[key];
                 if (dateFieldKeys.includes(key)) {
                    dataToSend.append(key, (value && dayjs.isDayjs(value) && value.isValid()) ? value.format('YYYY-MM-DD') : '');
                } else if (key === 'is_altered') {
                    dataToSend.append(key, value === null ? '' : String(value));
                } else if (value !== null && value !== undefined) {
                    dataToSend.append(key, value);
                } else {
                    dataToSend.append(key, '');
                }
            }
        }
        if (photoFile) { // photoFile from state
            dataToSend.append('photo', photoFile, photoFile.name);
        }

        console.log(`useDogForm Hook: Submitting form in ${isEditMode ? 'edit' : 'add'} mode. FormData:`, [...dataToSend.entries()]);

        try {
            let savedDog;
            if (isEditMode) {
                if (!dogId) throw new Error("Dog ID is missing for update."); // Safety check
                savedDog = await updateDog(dogId, dataToSend);
            } else {
                savedDog = await addDog(dataToSend);
            }
            console.log(`useDogForm Hook: Dog ${isEditMode ? 'updated' : 'added'} successfully:`, savedDog);
            setSuccessMessage(`Dog ${isEditMode ? 'updated' : 'added'} successfully!`);
            fetchDogs(); // Refresh list

            setTimeout(() => {
                 navigate(`/dogs/${savedDog.id}`, { replace: true });
            }, 1500);

        } catch (error) {
            console.error(`useDogForm Hook: Failed to ${isEditMode ? 'update' : 'add'} dog:`, error);
            if (error.response?.data && typeof error.response.data === 'object') {
                const backendErrors = error.response.data;
                const formattedErrors = {};
                let nonFieldError = '';

                // Iterate over backend error keys
                for (const key in backendErrors) {
                    if (Object.prototype.hasOwnProperty.call(backendErrors, key)) {
                        const errorValue = backendErrors[key];
                        // Join array messages, handle strings directly
                        const message = Array.isArray(errorValue) ? errorValue.join(' ') : String(errorValue);

                        if (key === 'non_field_errors' || key === 'detail') {
                            nonFieldError = message; // Assign to general error
                        } else {
                            formattedErrors[key] = message; // Assign to specific field
                        }
                    }
                }
                setFieldErrors(formattedErrors);
                setGeneralError(nonFieldError || 'Please check the form for errors.');

            } else if (error.response) {
                // Handle non-object errors from response (e.g., plain text, HTML)
                setGeneralError(`Server error: ${error.response.status} ${error.response.statusText || ''}. Please try again.`);
            } else if (error.request) {
                // Handle network errors (no response received)
                setGeneralError('Network error. Could not reach the server. Please check your connection.');
            } else {
                // Handle other unexpected errors (e.g., JS errors during request setup)
                setGeneralError(`An unexpected error occurred: ${error.message}`);
            }
            setIsSubmitting(false); // Ensure submit button is re-enabled on error
       }
    }, [
        formData, photoFile, isEditMode, dogId, // Dependencies for logic inside handleSubmit
        navigate, fetchDogs, clearMessages // Stable functions/dependencies
    ]); 

        // --- Return values needed by the component ---
        return {
            formData,
            photoPreview,
            isSubmitting,
            fieldErrors,
            generalError,
            successMessage,
            handleChange,
            handleSelectChange,
            handleDateChange,
            handlePhotoChange,
            handleOwnerChange,
            handleSubmit,
            PLACEHOLDER_IMAGE
        };
}