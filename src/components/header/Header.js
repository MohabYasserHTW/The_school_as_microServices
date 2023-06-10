import React, { useState } from 'react'
import LinkList from './LinkList'
import "./Header.css"

export default function Header() {

    

  return (
    <header className='header'>
        <nav className='container'>
            <LinkList />
        </nav>
    </header>
  )
}
