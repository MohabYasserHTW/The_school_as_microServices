import React from 'react'
import QuestionItem from './QuestionItem'

function QuestionsLists({questions, setRefresh}) {
  return (
    <ol>
        <hr/>
       {questions.map(question => <QuestionItem key={question.id} question={question} setRefresh={setRefresh}/>)} 
    </ol>
  )
}

export default QuestionsLists