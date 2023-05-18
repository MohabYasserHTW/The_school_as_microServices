import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/auth-context'
import { nanoid } from 'nanoid'

function QuestionPage() {
    const [question,setQuestion] = useState({})
    const [correctAnswersBoolean, setCorrectAnswersBoolean] = useState([])
    const {qId} = useParams()
    const [isQuestionEditMode, setIsQuestionEditMode] = useState(null)
    const [isAnswerEditMode, setIsAnswerEditMode] = useState(null)
    const authContext = useContext(AuthContext)
    
    const correctAnswersToBoolean = () =>{
        const booleanCorrect = question.answers.map((ans,index) =>{
        return question.correctAnswers.includes(ans._id)?true:false
        })
        setCorrectAnswersBoolean([...booleanCorrect]) 
    }

    useEffect(()=>{
      if(question.name)
      correctAnswersToBoolean() 
    },[question])

    useEffect(() => {
      const getQuestion = async() =>{
        await axios({
            method: "GET",
            url: `http://localhost:5002/api/questions/${qId}`,
            headers:{
                Authorization: `Bearer ${authContext.token}`
            }
          })
          .then(res =>{
            setQuestion({
              name: res.data.name,
              category: res.data.category,
              subCategory: res.data.subCategory,
              mark: res.data.mark,
              expectedTime: res.data.expectedTime,
              answers: res.data.answers.map(ans => ans),
              correctAnswers:res.data.correctAnswers,
              createdBy:res.data.createdBy
            })
            
          })
          .catch(err=>{
            const message = err.response?.data?.message
            console.log(message)
            /* setErr(message || "server not working") */
          })
        }
        if(authContext.isLoggedIn){
          getQuestion()
        }
        
    },[])
  
    const toggleQuestionEditMode = () =>{
      setIsQuestionEditMode(prev =>!prev) 
      console.log("toggle")
    }
    const toggleAnswerEditMode = () =>{
      setIsAnswerEditMode(prev =>!prev) 
      console.log("toggle")
    }
    
    const deleteCorrectAnswer = (index) =>{
        setCorrectAnswersBoolean(prev=>{
          const newCorrectAnsBool = prev
          newCorrectAnsBool[index] = false
          return [...newCorrectAnsBool]
        })
        setQuestion(prev =>{
          const newCorrectAns = prev.correctAnswers.filter(ans => ans !== prev.answers[index]._id )

          return{
            ...prev,
            correctAnswers: [...newCorrectAns]
          }
          
        })
    }
    const addCorrectAnswer = (index) =>{
      setCorrectAnswersBoolean(prev=>{
        const newCorrectAnsBool = prev
        newCorrectAnsBool[index] = true
        return [...newCorrectAnsBool]
      })

      setQuestion(prev =>{
        const newCorrectAns = prev.correctAnswers
        if(!newCorrectAns.includes(prev.answers[index]._id)){
          newCorrectAns.push(prev.answers[index]._id)
        }
        
        return{
          ...prev,
          correctAnswers: [...newCorrectAns]
        }
        
      })


    }

    const handeleQuestionChange = (e) => {
      const {name,value} = e.target

        setQuestion(prev =>{
          return{
            ...prev,
            [name]: value
          }
        })
      }
    
    const handeleAnswerChange = (e,index)=>{
      const {type,name,checked,value} = e.target
      
      if(type === "checkbox"){
        if(checked){
          addCorrectAnswer(index)
        }else{
          if(question.correctAnswers.length < 2){
            console.log("you must have 1 answer atleast ")
          }else{
            deleteCorrectAnswer(index)
          }
          
        }
      }else{
        console.log(name,value)
        setQuestion(prev=>{
          const newAnswers = prev.answers
          newAnswers[index] = {...newAnswers[index],[name]:value}
          return{
            ...prev,
            answers:newAnswers
          }
        })
      }
    }

    const deleteAnswer = (e,index) =>{
      
      console.log(correctAnswersBoolean[index], question.correctAnswers)
      if(correctAnswersBoolean[index] && question.correctAnswers.length<2 ){

          return console.log("you cant delete the only correct answer")
      }
      console.log(index)
        const newCorrectAnswers = question.correctAnswers.filter(correctAns => correctAns !== question.answers[index]._id)
        const newAnswers = question.answers.filter((ans,ind) => ind !== index)
        
        setQuestion(prev => {return {...prev,answers:[...newAnswers],correctAnswers:[...newCorrectAnswers]}})
        const newBooleanCorrect = correctAnswersBoolean.filter((ans,ind)=> ind !== index)
        setCorrectAnswersBoolean([...newBooleanCorrect])
    }

    const addAnswer = async ()=>{ 
      const prev = question 
      await axios({
        method: "POST",
        url: `http://localhost:5002/api/questions/${qId}`,
        headers:{
            Authorization: `Bearer ${authContext.token}`
        },
        data: {
          answerName:"emptyAnswer",
          description:""
        }
      }).then(res => {
        prev.answers.push(res.data)
      }
      ).catch(err=>console.log(err))
      setQuestion({...prev}) // thx to omar


      // setQuestion(prev=>{
      //   const answers = [...prev.answers]
      //   console.log(prev.answers,answers)
      //   answers.push({name:"",description:""})
      //   console.log("Added  2")
      //   return {
      //     ...prev,
      //     answers:answers
      //   }
      // })
    }

    const handelSubmit = async(e) =>{
      e.preventDefault()
      await axios({
        method: "PATCH",
        url: `http://localhost:5002/api/questions`,
        data: {
          ...question,
          questionId: qId,
        },
        headers:{
            Authorization: `Bearer ${authContext.token}`
        }
      })
      .then(res=>console.log(res))
      .catch(err=>console.log(err))
    }

  return (
    <>
    {!authContext.isLoggedIn &&  <Navigate to="/" replace={true} />}
    {!(authContext.userType === "TEACHER") &&  <Navigate to="/" replace={true} />}
    {!(authContext.userId === question.createdBy) && question.createdBy && <Navigate to="/" replace={true} />}
      <form onSubmit={handelSubmit}>
        
        <hr/>
    {  question.correctAnswers?.length &&
        <table>
        <tbody>
          <tr><button className='darkButton' type='submit'>SaveChanges</button></tr>
          <tr>
            <td><h1>Question</h1></td>
            <td><button type='button' className='darkButton' onClick={toggleQuestionEditMode} >{!isQuestionEditMode?"Edit":"Close"}</button></td>
          </tr>
          
          
          <tr>
            <td>name:</td>
            {isQuestionEditMode && <td><input name='name' onChange={(e)=>handeleQuestionChange(e)} value={question.name}/></td>}
            {!isQuestionEditMode &&<td>{question.name}</td>}
          </tr>
          <tr>
            <td>category:</td>
            {isQuestionEditMode && <td><input name='category' onChange={(e)=>handeleQuestionChange(e)} value={question.category}/></td>}
            {!isQuestionEditMode &&<td>{question.category}</td>}
          </tr>
          <tr>
            <td>subCategory:</td>
            {isQuestionEditMode && <td><input name="subCategory" onChange={(e)=>handeleQuestionChange(e)} value={question.subCategory}/></td>}
            {!isQuestionEditMode &&<td>{question.subCategory}</td>}
          </tr>
          <tr> 
            <td>mark:</td>
            {isQuestionEditMode && <td><input name='mark' onChange={(e)=>handeleQuestionChange(e)} value={question.mark} type='number'/></td>}
            {!isQuestionEditMode &&<td>{question.mark}</td>}
          </tr>
          <tr>
            <td>expectedTime:</td>
            {isQuestionEditMode && <td><input name='expectedTime' onChange={(e)=>handeleQuestionChange(e)} value={question.expectedTime} type='number' /></td>}
            {!isQuestionEditMode &&<td>{question.expectedTime}</td>}
          </tr>
          <tr>
            <td><h1>Answers </h1></td>
            <td><button type='button' className='darkButton' onClick={toggleAnswerEditMode}>{!isAnswerEditMode?"Edit":"Close"}</button></td>
          </tr>
            {
              question.answers.map((ans,ind) => 
              <tr key={ans._id} >
                <td>name</td>
                {isAnswerEditMode &&  <td><input name="name" onChange={(e)=>handeleAnswerChange(e,ind)} value={question.answers[ind].name} key={ans._id} /></td>}
                {!isAnswerEditMode &&<td>{question.answers[ind].name}</td>}
                <td>{ans.description}</td>  
                {isAnswerEditMode &&  <td>{<input type='checkbox' checked={correctAnswersBoolean[ind]} onChange={(e)=>handeleAnswerChange(e,ind)} name={"check"}  key={ans._id}/>}</td>}
                {!isAnswerEditMode && <td>{<input type='checkbox' checked={correctAnswersBoolean[ind]} onChange={null} key={nanoid()}/>}</td>}
                {isAnswerEditMode && <td><button type='button' className='deleteButton' onClick={(e)=>deleteAnswer(e,ind)}>DELETE</button></td>}
              </tr>
                )
            }
            {isAnswerEditMode && <button className='darkButton' onClick={addAnswer} type='button'> ➕ </button>}
        </tbody>
        </table>}
        </form>
    </>
    
  )
}

export default QuestionPage