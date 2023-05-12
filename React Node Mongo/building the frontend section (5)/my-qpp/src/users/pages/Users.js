import React from 'react'
import UsersList from '../components/UsersList'

function Users() {
    const users=[
        {id:1,name:"Mohab",image:"https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",places:2},
        {id:2,name:"Hopa",image:"https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",places:3},
    ]
  return (
    <UsersList items={users}/>
  )
}

export default Users