import React from 'react'
import PlaceList from '../components/PlaceList'
import {useParams} from "react-router-dom"

function UserPlaces() {
  const userId=Number(useParams().userId)
  const places=[{
    title:"Cairo",
    image:"https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/cairo.jpg",
    description:"Crowded City",
    address:"cairo Egy",
    id:1,
    uId:1,
    cordinates:{lat:-34,lng:150}
  },{
    title:"Cairo",
    image:"https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/cairo.jpg",
    description:"Crowded City",
    address:"cairo ",
    id:2,
    uId:2,
    cordinates:{lat:-34,lng:150}
  }]
  const userPlaces = places.filter(place=>place.uId===userId)
  return (
    <PlaceList items={userPlaces} />
  )
}

export default UserPlaces