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
  const [userId, setUserId] = useState(authContext.userId)
  const [category, setCategory] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [page,setPage] = useState(1)
  const [totalLength,setTotalLength] = useState(0)
  const [loading, setLoading] = useState(false)
  

  const toggleModal = () => {
    setOpenModal(prev=>!prev)
    setRefresh(prev => prev+1)
  }

  const nextPage = () => {
    if(page*5 < totalLength){
      setPage(prev => prev+1)
    }
  }

  const prevPage = () => {
    if(page>1){
      setPage(prev => prev-1)
    }
  }

  useEffect(() =>{
    if(!openModal){
      document.getElementById("modal-hook").style.zIndex = "-100"
    }
  },[openModal])

  
  useEffect(() =>{

    const getQuestions = async ()=>{
      let filters = {}
      if(userId){
        filters.createdBy = userId
      }

      if(category){
        filters.category = category
      }
      setLoading(true)
      await axios({
        method: "GET",
        url: "http://localhost:5002/api/questions",
        params:{
          createdBy: authContext.userId, 
          filters: filters, 
          pagination:{
            skip:(page-1)*5, 
            limit:5
          }},
        headers:{
          Authorization: `Bearer ${authContext.token}`
        }
      })
      .then(res=>{
        console.log(res.data.totalLength)
        setQuestions(res.data.questions)
        setTotalLength(res.data.totalLength)
        
      })
      .catch(err=>{
        console.log(err)
        const message = err?.response?.data?.message
        setErr(message || "server not working") 
        
      })
    }

    if(authContext.isLoggedIn){
      getQuestions()
    }

    

    setLoading(false)
  },[userId, category, refresh,page])

  return (<div >
    {openModal && <AddModal toggleModal={toggleModal} setRefresh={setRefresh}/>}
    <div className='questionsDiv'>
        <div>
          <h1>Total questions : {questions?.length}</h1>
          <select onChange={
            (e) =>{
              setUserId(e.target.value)
            }
          }>
            <option value={authContext.userId} defaultChecked>My Questions</option>
            <option value={""}>All Questions</option>
          </select>
          <input type='text' onChange={(e) => setCategory(e.target.value)} value={category} placeholder='category ... math for example'/>
        </div>
        {authContext.userType === "TEACHER" &&
          <button className='addButton' onClick={toggleModal}>Add Question</button>
        }
          
    </div>
    {!authContext.isLoggedIn &&  <Navigate to="/" replace={true} />}
    <hr/>
    <div className='questions_section'>
      {loading? "Loading....":
      questions?<QuestionsLists questions={questions} setRefresh={setRefresh}/>
      :"No questions"
      }
      <div className='pageBtns'>
        <button style={{backgroundColor:"darkslategray", color:"white"}} onClick={prevPage} > {"<"} </button>
        <p style={{fontSize:"1.4rem"}}>{page}</p>
        <button style={{backgroundColor:"darkslategray", color:"white"}} onClick={nextPage} > {">"} </button>
      </div>
    </div>
    <p>{err}</p>
    </div>
  )
}
