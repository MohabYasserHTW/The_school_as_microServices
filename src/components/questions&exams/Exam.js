import React from 'react'
import Card from '../UIElements/card/Card'
import { Link } from 'react-router-dom'
import "./Exam.css"

export default function Exam({exam}) {
  
  return (
    <>
        <Card className="exam_card">
            <h1>{exam.name}</h1>
            <p>number of questions : {exam.questions?.length}</p>
            <Link to={`/exams/${exam.id}`}><button className='view_exam-btn'>{"View exam >>>"}</button></Link>
        </Card>
    </>
  )
}
