import React from 'react'
import Card from '../UIElements/card/Card'
import { Link } from 'react-router-dom'
import "./Question.css"

export default function Question({question,type,onAdd}) {
  return (
    <>
        <Card className="question_card">
            <h1>{question.name}</h1>
            {type==="add"&&<button className='view_question-btn' type='button' onClick={()=>onAdd(question)}>Add</button>}
            <Link  to={`/questions/${question._id}`}><button className='view_question-btn'>{"View question >>>"}</button></Link>
        </Card>
    </>
  )
}
