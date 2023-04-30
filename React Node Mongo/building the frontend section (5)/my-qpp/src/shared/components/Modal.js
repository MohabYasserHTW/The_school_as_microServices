import React from 'react'
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group'
import Backdrop from "./Backdrop"
import "./modal.css"
const ModalOverlay= props =>{
  const content=(
    <div className={`modal ${props.className}`} style={props.style}>
      <header className='modal__header'>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit :(e)=>e.preventDefault()}>
        <div className='modal__content place-item__modal-content'>
          {props.children}
        </div>
        <footer className='modal__footer place-item__modal-actions'>{props.footer}</footer>
      </form>
    </div>
  )
  return ReactDOM.createPortal(content,document.getElementById("modal-hook")) 
}

function Modal(props) {
  return <>
    {props.show &&<Backdrop onClick={props.onCancel}/>}
    <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames={"modal"}>
      <ModalOverlay {...props}/>
    </CSSTransition>
  </>
}

export default Modal