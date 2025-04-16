 import React, { useContext, useEffect, useState } from 'react';
 import DogList from '../components/DogList';
 import DogForm from '../components/DogForm';
 import api from '../services/api';
 import getDogs from '../services/api'
 
 export default function DogsPage(){
    const [view, setView] = useState('list') // 'list', 'detail', 'add', 'edit'
    const [dogs, setDogs] = useState([])
    const [selectedDog, setSelectedDog] = useState(null); // Holds the dog object for detail/edit view
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDogs = async () => {
        setLoading(true);
        setError('')
        try {
            console.log('Fetching dog data...')
            const data = await getDogs()
            setDogs(data)
        } catch (error) {
            setError(`fetchDogs() Error - ${error.message}` || 'fetchDogs() Error - Failed to fetch dogs.')
            console.error('fetchDogs() Error -', error);
        } finally {
            setLoading(false)
        }
    }

    const handleFormSubmit = async (formData) => {
        const isEditing = selectedDog && selectedDog.id;
        const url = isEditing ? `/api/v1/dogs/${selectedDog.id}/` : '/api/v1/dogs/'
        const method = isEditing ? 'PATCH' : 'POST'

        console.log(`Submitting form via ${method} to ${url}`);

        try {
            let result;
            if(method==='PATCH'){
                result = await api.patch(url, formData)
                console.log("Update successful:", result);
                // Update the selected dog locally for immediate feedback in detail view
                setSelectedDog(prev => ({ ...prev, ...result }));
            } else {
                result = await api.post(url, formData)
                console.log("Create successful:", result);
            }
            // SUCCESS: Navigate back and potentially refresh list
            fetchDogs(); // Refresh the list in the background
            setView(isEditing ? 'detail' : 'list'); // Go to detail after edit, list after add
            return result; // Resolve the promise for DogForm
        } catch (error) {
            console.error(`Failed to ${method === 'POST' ? 'save' : 'update'} dog: `, error);
            // **RE-THROW THE ERROR** so DogForm's catch block is triggered
            throw error;
        }

        // if (method === "POST"){
        //     try {
        //         const result = await api.post(url, formData)
        //     } catch (error) {
        //         console.error("Failed to save dog: ", error)
        //         setError(error.message || 'Failed to save dog profile.');
        //         // setView('list')
        //     } finally {
        //         setLoading(false)
        //         setView('list')
        //     }
        // }
    }


    let currentView;
    switch (view) {
        case 'detail':
            currentView = <p>DETAIL</p>
            break;
        case 'add':
            currentView = <DogForm onSubmit={handleFormSubmit} />
            break;
        case 'edit':
            currentView = <p>EDIT</p>
            break;
        case 'list':
        default:
            currentView = <DogList />
            break;
    }
    
    return (
         <>
         <button onClick={() => setView('list')}>list</button>
         <button onClick={() => setView('add')}>add</button>
         <button onClick={() => setView('edit')}>edit</button>
         <button onClick={() => setView('detail')}>detail</button>
         {currentView}
         </>
     )
 
 }