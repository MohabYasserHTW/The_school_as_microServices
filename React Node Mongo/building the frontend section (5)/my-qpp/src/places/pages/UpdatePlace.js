import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Input from '../../shared/components/formElements/Input/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validator'
import Button from '../../shared/components/formElements/Button/Button'
import "./NewPlace.css"
import { useForm } from '../../shared/hooks/form-hook'
import Card from '../../shared/components/Card'
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



function UpdatePlace() {
    const placeId=Number(useParams().placeId)
    const [isLoading,setIsLoading]=useState(true)
    const [formState,inputHandeler,setFormData] = useForm({
        title:{
            value:"",
            isValid:false
        },
        description:{
            value:"",
            isValid:false
        },
    },false)

    const place = places.find(p => p.id===placeId)
    
    useEffect(()=>{
        if(place){
        setIsLoading(true)
        setTimeout(()=>{
            
            setFormData({
            title:{
                value:place.title,
                isValid:true
            },
            description:{
                value:place.description,
                isValid:true
            },
        },true)
        setIsLoading(false)
        }
        ,3000)}
        
    },[setFormData,place])
    

    if(!place){
        return <p>Couldn't find place</p>
    }
    
    const submitHandeler = e=>{
        e.preventDefault()
        console.log(formState.inputs)
    }

  return (!isLoading?
    <form className='place-form' onSubmit={submitHandeler}>
        <Input 
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please add a valid title"
            onInput={inputHandeler}
            value={formState.inputs.title.value}
            valid={formState.inputs.title.isValid}
        />

        <Input 
            id="description"
            element="input"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please add a valid description (min . 5 chars)"
            onInput={inputHandeler}
            value={formState.inputs.description.value}
            valid={formState.inputs.description.isValid}
        />

        <Button type="submit" disabled={!formState.isValid}>UPDATE</Button>
    </form>:<Card><p>Loading ...</p></Card>
  )
}

export default UpdatePlace