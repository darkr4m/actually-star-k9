import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from "@mui/material";
import { getDogs } from "../services/api";

export default function DogList(){
    const [dogs, setDogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDogs()        
    }, [])
    
    const fetchDogs = async () => {
        setIsLoading(true);
        setError('')
        try {
            console.log('Fetching dog data...')
            const data = await getDogs()
            setDogs(data)
        } catch (error) {
            setError(`fetchDogs() Error - ${error.message}` || 'fetchDogs() Error - Failed to fetch dogs.')
            console.error('fetchDogs() Error -', error);
        } finally {
            setIsLoading(false)
        }
    }



    const rows = dogs.map((dog, index)=> {
        return {
            id: dog.id,
            name: dog.name,
            breed: dog.breed,
            sex: dog.sex,
            age: dog.age_display,
            status: dog.status
        }
    })

    const columns = [
        // { field: 'id', headerName: 'ID', width:40,resizable: false },
        { field: 'name', headerName: 'Name', width:150,resizable: false },
        { field: 'breed', headerName: 'Breed', width:250, resizable: false },
        { field: 'sex', headerName: 'Sex', width:75, resizable: false },
        { field: 'status', headerName: 'Status', width:100, resizable: false }
    ]
    
    if(isLoading) {
        return <p>Loading dogs...</p>
    }
    
    if(error) {
        return <p>{error}</p>
    }
    
    if (dogs.length === 0){
        return <p>No dogs found</p>
    }
    console.log(dogs)
    return (
        <div>
            <h2>All Dogs</h2>
            <Button variant="contained">Add new dog</Button>
            <div style={{ display: 'flex', flexDirection: 'column', width: '630px' }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                />  
            </div>

        </div>
    )
}