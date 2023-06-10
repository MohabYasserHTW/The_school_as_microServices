import React from 'react'
import "./Card.css"
export default function Card(props) {
  return (
    <div className={`card ${props.className}`} style={props.styles}>
        {props.children}
    </div>
  )
}
