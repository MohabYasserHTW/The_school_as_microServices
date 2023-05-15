import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
function Nav() {
  const authContext = useContext(AuthContext)

    return (
    <nav>
        <div><h2>Atos</h2></div>
        <ul className='nav__ul'>
            
            <li><NavLink to={"/userprofile"}>My Profile</NavLink></li>
            {authContext.isLoggedIn && <li><span onClick={authContext.logout} style={{color:'white'}}>Logout</span></li>}
            
        </ul>
    </nav>
  )
}

export default Nav