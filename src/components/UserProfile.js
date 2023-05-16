import React, { useContext } from 'react'
import { AuthContext } from '../context/auth-context'
import { Navigate } from 'react-router-dom'
import Questions from './Questions'

function UserProfile() {

  const authContext = useContext(AuthContext)
  return (
    <main>
        {!authContext.isLoggedIn&&<Navigate to={"/"} replace={true}/>}
        <div className='userInfo'>
        {authContext.isLoggedIn &&<h2> {authContext.userName}</h2>}
        {authContext.isLoggedIn &&<h2> {authContext.userType}</h2>}
        </div>
        <hr/>
        {authContext.userType !== "STUDENT" && <Questions />}
        
    </main>
  )
}

export default UserProfile