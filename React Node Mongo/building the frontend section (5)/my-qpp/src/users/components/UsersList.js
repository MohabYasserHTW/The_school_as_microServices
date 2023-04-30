import React from 'react'
import UserItem from './UserItem'
import Card from '../../shared/components/Card'

function UsersList(props) {
  if(!props.items.length){
    return (
    <div>
        <Card>
            <h2>No Users Found</h2>
        </Card>
    </div>
    )
  }

  return (
    <ul className="users-list">
        {
            props.items.map(user=><UserItem key={user.id} user={user}/>)
        }
    </ul>
  )

}

export default UsersList