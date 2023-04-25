import React from 'react'


function Note({title,content,deleteNote}) {
  return (
    <div className='note'>
        <h1>{title}</h1>
        <p>{content}</p>
        <button onClick={()=>deleteNote({title:title,content:content})}>DELETE</button>
    </div>
  )
}

export default Note