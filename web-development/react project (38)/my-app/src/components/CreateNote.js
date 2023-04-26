import React, { useState } from "react";

function CreateArea({addNote}) {
    const [title,setTitle] = useState("")
    const [content,setContent] = useState("")

  return (
    <div>
      <form className="create-note">
        <input name="title" placeholder="Title" onChange={(e)=>setTitle(e.target.value)} value={title}/>
        <textarea name="content" placeholder="Take a note..." rows="3" onChange={(e)=>setContent(e.target.value)}/>
        <button onClick={(e)=>{
            e.preventDefault()
            addNote({title,content})
        }}>
            Add
        </button>
      </form>
    </div>
  );
}

export default CreateArea;