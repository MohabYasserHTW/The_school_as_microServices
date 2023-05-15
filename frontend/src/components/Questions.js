import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth-context';
import axios from "axios"
import {  Navigate, useNavigate } from 'react-router-dom';
import QuestionsLists from './QuestionsLists';
import AddModal from './AddModal';


export default function Questions() {
  const authContext = useContext(AuthContext)
  const [questions, setQuestions] = useState()
  const [err,setErr] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  const toggleModal = () => {
    setOpenModal(prev=>!prev)
  }

  useEffect(() =>{
    if(!openModal){
      document.getElementById("modal-hook").style.zIndex = "-100"
    }
  },[openModal])

  useEffect( () =>{

    const getQuestions = async ()=>{
      
      await axios({
        method: "GET",
        url: "http://localhost:5002/api/questions",
        params:{createdBy: authContext.userId},
        headers:{
          Authorization: `Bearer ${authContext.token}`
        }
      })
      .then(res=>{
        setQuestions(res.data)
        console.log(res.data)
      })
      .catch(err=>{
        const message = err.response.data.message
        setErr(message || "server not working") 
        
      })
    }


    if(authContext.isLoggedIn){
      getQuestions()
    }
    
  },[openModal])

  return (<div >
    {openModal && <AddModal toggleModal={toggleModal} />}
    <div className='questionsDiv'>
        <h1>Total questions : {questions?.length}</h1>
    <button className='addButton' onClick={toggleModal}>Add Question</button>
    </div>
    {!authContext.isLoggedIn &&  <Navigate to="/" replace={true} />}
    <div className='questions_section'>
      {questions? <QuestionsLists questions={questions} />: "No questions"}
    </div>
    <p>{err}</p>
    </div>
  )
}
