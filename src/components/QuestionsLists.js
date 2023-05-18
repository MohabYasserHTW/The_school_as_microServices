import React from 'react'
import QuestionItem from './QuestionItem'

function QuestionsLists({questions, setRefresh}) {
  return (
    <ol>
       {questions.map(question => <QuestionItem key={question._id} question={question} setRefresh={setRefresh}/>)} 
    </ol>
  )
}

export default QuestionsLists