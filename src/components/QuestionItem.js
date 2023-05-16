import React, { useContext, useState, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../context/auth-context'
import AddModal from './AddModal'


function QuestionItem({question, setRefresh}) {
  
  const authContext = useContext(AuthContext)
  const [err, setErr] =useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [quest, setQuest] = useState(question)
  const toggleModal = () => {
    setOpenModal(prev=>!prev)
  }
  

  useEffect(() =>{
    if(!openModal){
      document.getElementById("modal-hook").style.zIndex = "-100"

      const getQuestion = async() =>{
            await axios({
                method: "GET",
                url: `http://localhost:5002/api/questions/${question._id}`,
                headers:{
                    Authorization: `Bearer ${authContext.token}`
                }
              })
              .then(res=>{
                
                setQuest({...res.data,_id:question._id})
                console.log(res.data)
            }
              )
              .catch(err=>{
                
                const message = err.response?.data?.message
                setErr(message || "server not working")
              })
        }

        getQuestion()
    }
  },[openModal])

  const handeleDelete = async (qId) =>{
    await axios({
      method: "DELETE",
      url: "http://localhost:5002/api/questions",
      data: {
        questionId: qId
      },
      headers:{
          Authorization: `Bearer ${authContext.token}`
      }
    })
    .then(()=>{
      
      setRefresh(prev => prev+1)
  }
    )
    .catch(err=>{
      console.log(err)
      const message = err.response?.data?.message
      setErr(message || "server not working")
    })
  }

  return (
    <li>
        {openModal && <AddModal toggleModal={toggleModal} type={"edit"} qId={quest._id}/>}
        {err && <p style={{color:"red"}}> {err} </p>}
        <div className='questionHeader'>
          <button onClick={()=>{handeleDelete(quest._id)}} style={{backgroundColor:"red", color: "white"}}>delete</button>
          {authContext.userId === question.createdBy &&
          <button onClick={toggleModal} style={{backgroundColor:"darkslategrey", color: "white"}} >edit</button>
          }
          
        </div>
        <br/>
        <h3>{quest.name}</h3>
        <h4>{quest.description}</h4>
        <ul className='answers'>{quest.answers.map(ans => <li key={ans.name}>{ans.name}</li>)}</ul>
        <hr/>
    </li>
  )
}

export default QuestionItem