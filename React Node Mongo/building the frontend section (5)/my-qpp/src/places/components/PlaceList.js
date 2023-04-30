import React from 'react'
import Card from '../../shared/components/Card'
import PlaceItem from './PlaceItem'
import Button from '../../shared/components/formElements/Button/Button'

function PlaceList(props) {
    if(!props.items.length){
        return <div className='place-list center'>
            <Card >
                <h2>No places found for this user</h2>
                <Button to="/places/new">Share Place</Button>
            </Card>
        </div>
    }

    return (
    <ul className='place-list'>
      {props.items.map( place => <PlaceItem key={place.id} place={place} /> )}
    </ul>
    )
}

export default PlaceList