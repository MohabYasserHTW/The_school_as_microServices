import React,{ useState, useContext } from 'react'
import { AuthContext } from '../../context/auth-context'
import { Link, NavLink } from 'react-router-dom'
import { request } from "../../apis/request";
import { ReqMethods, URLS } from '../../variables';

function LinkList() {
  const authContext = useContext(AuthContext)
  const logout = () => {
    authContext.logout()

    const response = request({
      method: ReqMethods.post,
      url: URLS.keycloak_logout,
      body: {
        refreshToken: authContext.tokens.refresh_token
      }
    })

  }

  return (
    <ul>
        <li><NavLink to='/'>home</NavLink></li>
        {authContext.isLoggedIn && 
        <>
          <li><NavLink to="userprofile">my profile</NavLink></li>
          <li><NavLink to={"exams"}>exams</NavLink></li>
          {authContext.userType === "teacher" && 
            <li><NavLink to={"questions"}>questions</NavLink></li>
          }
        </>}
        {!authContext.isLoggedIn && 
        <li><NavLink to='auth'>login</NavLink></li>
        }
        {
          authContext.isLoggedIn && 
          <li><NavLink to='auth' onClick={logout}>logout</NavLink></li>
        }
    </ul>
  )
}

export default LinkList