import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from "@mui/material";

import useDogs from '../../hooks/useDogs'

import { getDogs } from "../../services/dogsService";

export default function DogsListPage() {

    const { dogs, isLoading, error, fetchDogs } = useDogs()


    const rows = dogs.map((dog, index)=> {
        return {
            id: dog.id,
            name: dog.name,
            breed: dog.breed,
            sex: dog.sex,
            owner: dog.owner,
            age: dog.age_display,
            status: dog.status,
            actions: 'View | Edit | Delete'
        }
    })

    const columns = [
        // { field: 'id', headerName: 'ID', width:40,resizable: false },
        { field: 'name', headerName: 'Name', width:200,resizable: false },
        { field: 'breed', headerName: 'Breed', width:200, resizable: false },
        { field: 'sex', headerName: 'Sex', width:75, resizable: false },
        { field: 'owner', headerName: 'Owner', width:150, resizable: false },
        { field: 'status', headerName: 'Status', width:150, resizable: false },
        { field: 'actions', headerName: 'Actions', width:150, resizable: false }
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
            <h2>All Dogs</h2>
            <Button variant="contained" sx={{my:1}}>Add new dog</Button>

            <ul>
                {dogs.map((dog, index)=>{
                    return (
                        <li key={dog.id}>{dog.id}: <Link to={`/dogs/${dog.id}`}> {dog.name}</Link></li>
                    )
                })}
            </ul>

            {/* <div style={{ maxWidth:'75vw' }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                />  
            </div> */}
        </div>
    )
}