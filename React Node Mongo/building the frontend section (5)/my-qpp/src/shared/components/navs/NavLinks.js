import React, { useContext } from 'react'
import {NavLink} from "react-router-dom"
import { AuthContext } from '../../context/auth-context'
import Button from '../formElements/Button/Button'

function NavLinks() {
  const auth=useContext(AuthContext)
  return (
    <ul className='nav-links'>
        <li>
          <NavLink to="/" exact>All Users</NavLink>
        </li>
        {auth.isLoggedIn&&
        <li>
        <NavLink to="/1/places">My Places</NavLink>
        </li>}
        {auth.isLoggedIn&&
        <li>
          <NavLink to="/places/new">Add Place</NavLink>
        </li>
        }
        {!auth.isLoggedIn&&
        <li>
          <NavLink to="/auth">Authinticate</NavLink>
        </li>
        }
        {auth.isLoggedIn&&<Button onClick={auth.logout}>LogOut</Button>}
    </ul>
  )
}

export default NavLinks