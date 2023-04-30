import React from 'react'
import Avatar from '../../shared/components/Avatar'
import {Link} from "react-router-dom"
import Card from '../../shared/components/Card'
function UserItem({user}) {
  return (
    <li className='user-item'>
        <Card className='user-item__content'>
        <Link to={"/"+user.id+"/places"}>
            <div className='user-item__image'>
                <Avatar image={user.image} alt={user.name}/>
            </div>
            <div className='user-item__info'>
                <h2>{user.name}</h2>
                <h3>{user.places} Places</h3>
            </div>
        </Link>
        </Card>
        
    </li>
  )
}

export default UserItem