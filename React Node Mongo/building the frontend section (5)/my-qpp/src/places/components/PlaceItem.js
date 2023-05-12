import React, { useContext, useState } from 'react'
import Card from '../../shared/components/Card'
import Button from "../../shared/components/formElements/Button/Button"
import Modal from '../../shared/components/Modal'
import Map1 from '../../shared/components/Map1'
import { AuthContext } from '../../shared/context/auth-context'


function PlaceItem({place}) {
    const [showMap,setShowMap] = useState(false)
    const [showDelete,setShowDelete] = useState(false)

    const openDelete = ()=> setShowDelete(true)
    const closeDelete = ()=> setShowDelete(false)

    const openMap = ()=>setShowMap(true)
    const closeMap = ()=> setShowMap(false)

    const deleteHandeler = ()=>{
        console.log("deleted")
        closeDelete()
    }

    const auth=useContext(AuthContext)
  return (
    <>
        <Modal 
            show={showMap} 
            onCancel={closeMap} 
            header={place.address} 
            footer={<Button onClick={closeMap}>Close</Button>}
        >
            <div className='map-container'>
                <Map1 
                    center={place.cordinates} 
                    zoom={16}
                />  
            </div>     
        </Modal>

        <Modal 
            show={showDelete}
            onCancel={closeDelete}
            header="Are you sure" 
            footerClass="place-item__modal-action" 
            footer={<><Button onClick={closeDelete} inverse>Cancel</Button><Button danger onClick={deleteHandeler}>Delete</Button></>}
        >
            <p>Do you want to proceed and delete this place !!</p>
        </Modal>

        <li className='place-item'>
            <Card className="place-item__content"> 
                <div className='place-item__image'>
                    <img 
                        src={place.image} 
                        alt={place.title}
                    />
                </div>

                <div className='place-item__info'>
                    <h2>{place.title}</h2>
                    <h3>{place.address}</h3>
                    <p>{place.description}</p>
                </div>

                <div className='place-item__actions'>
                    <Button 
                        inverse 
                        onClick={openMap}
                    >
                        View on the map
                    </Button>
                    {auth.isLoggedIn&&
                    <Button to={"/places/"+place.id}>
                        Edit
                    </Button>}
                    {auth.isLoggedIn&&
                    <Button danger onClick={openDelete}>
                        Delete
                    </Button>
                    }
                </div>
            </Card>
        </li>
    </>
  )
}

export default PlaceItem