import React, { useState } from 'react'
import MainHeader from './MainHeader'
import {Link} from "react-router-dom"
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../Backdrop'
function MainNav(props) {
  const [isDrawerOpen,setIsDrawerOpen]=useState(false)
  return (<>
  {
    isDrawerOpen&&
    <Backdrop onClick={()=>{setIsDrawerOpen(false)}}/>
  }
    <SideDrawer show={isDrawerOpen} onClick={()=>{setIsDrawerOpen(false)}}>
      <nav className='main-navigation__drawer-nav'>
        <NavLinks />
      </nav>
    </SideDrawer>
    <MainHeader>
      <button className='main-navigation__menu-btn' onClick={()=>setIsDrawerOpen(true)}>
        <span/>
        <span/>
        <span/>
      </button>
      <h1 className='main-navigation__title'>
        <Link to="/">Your places</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
        <NavLinks />
      </nav>
    </MainHeader>
    </>
  )
}

export default MainNav