import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Note from './Note'
//import notes1 from '../notes'
import CreateArea from './CreateNote'

function App() {
    const [notes,setNotes]=useState([])

    const addNote=(note)=>{
        setNotes(prev=>[...prev,note])
    }
    const deleteNote = (dnote)=>{
        setNotes(prev=>prev.filter(note=>note.title!==dnote.title))
    }
  return (
    <>
        <Header/>
        <CreateArea 
            addNote={addNote}
            
        />
        {
            notes.map((note,ind)=><Note title={note.title} content={note.content} key={ind} deleteNote={deleteNote}/>)
        }
        <Footer />
    </>
  )
}

export default App