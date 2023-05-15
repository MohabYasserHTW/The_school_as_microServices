import React from 'react'
import QuestionItem from './QuestionItem'

function QuestionsLists({questions}) {
  return (
    <ol>
        <hr/>
       {questions.map(question => <QuestionItem key={question.id} question={question}/>)} 
    </ol>
  )
}

export default QuestionsLists