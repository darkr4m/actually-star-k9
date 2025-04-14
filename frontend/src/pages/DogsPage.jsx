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
        setLoading(true)
        setError(null)
        const isEditing = selectedDog && selectedDog.id;
        const url = isEditing ? `/api/v1/dogs/${selectedDog.id}/` : '/api/v1/dogs/'
        const method = isEditing ? 'PATCH' : 'POST'

        if (method === "POST"){
            try {
                const result = await api.post(url, formData)
            } catch (error) {
                console.error("Failed to save dog: ", error)
                setError(error.message || 'Failed to save dog profile.');
                setView('list')
            } finally {
                setLoading(false)
            }
        }
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