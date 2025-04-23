import React from 'react';
import { useParams } from 'react-router-dom';

export default function DogDetailPage(){
    const { id } = useParams()
    return (
        <>
        Dog {id}
        </>
    )


}