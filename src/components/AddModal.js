import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from "axios"
import { AuthContext } from '../context/auth-context'

function AddModal({toggleModal,type,qId,setRefresh}) {
    const authContext = useContext(AuthContext)
    const [err, setErr] =useState(null)
    const [question, setQuestion] = useState({
        name: "",
        category: "",
        subCategory: "",
        mark: null,
        expectedTime: null,
        answers: [{name: "",description: ""},{name: "",description: ""}],
        correctAnswers:[]
    })
    const method = type === "edit"? "PATCH" : "POST"
    
    useEffect(()=>{
        console.log(qId,"ss")
        const getQuestion = async() =>{
        if(type === "edit"){
            await axios({
                method: "GET",
                url: `http://localhost:5002/api/questions/${qId}`,
                headers:{
                    Authorization: `Bearer ${authContext.token}`
                }
              })
              .then(res=>{
                setQuestion({
                    name: res.data.name,
                    category: res.data.category,
                    subCategory: res.data.subCategory,
                    mark: res.data.mark,
                    expectedTime: res.data.expectedTime,
                    answers: res.data.answers.map(ans => ans),
                    correctAnswers:[]
                })
                console.log(res.data)
            }
              )
              .catch(err=>{
                
                const message = err.response?.data?.message
                setErr(message || "server not working")
              })
        }}

        getQuestion()
    },[])
    
    const deleteAnswer = (e,ind) => {
        setQuestion(prev => {
            const answers = prev.answers.filter((ans,index) => index !== ind )
            const correctAnswers = prev.correctAnswers.filter(ans => ans !== ind)
            console.log(answers)
            return {...prev,answers: answers,correctAnswers: correctAnswers}
        })
        console.log(question)
    }


    const addAnswer = ()=>{
        setQuestion(prev=>{
            const newAnswer= {name:"",decription:""}
            const answers = [...prev.answers,newAnswer]
            console.log(answers)
            return {...prev,answers: answers} 
        })
    }

    const handeleSubmit = async (e)=>{    
        e.preventDefault()
        
        if((question.name && question.category && question.expectedTime && question.mark && question.subCategory && question.answers.length > 1 && question.correctAnswers.length > 0 && question.answers[0].name.length > 0 && question.answers[1].name.length > 0 )){
            await axios({
                method: method,
                url: `http://localhost:5002/api/questions`,
                data: {
                  ...question,
                  questionId: qId
                },
                headers:{
                    Authorization: `Bearer ${authContext.token}`
                }
              })
              .then(()=>{
                setErr("succedded")
                setRefresh(prev => prev+1)
                toggleModal()
            }
              )
              .catch(err=>{
                console.log(err)
                const message = err.response?.data?.message
                setErr(message || "server not working")
              })
        }
        
    }    
    
    const handeleChange = (e,ind) => {
        
        let {name, value, type, checked} = e.target
        if(type === "checkbox")
        {
            if(checked){
                const newCorrectAns = question.correctAnswers
                newCorrectAns.push(ind)
                setQuestion(prev => {
                    return{
                        ...prev,
                        correctAnswers: newCorrectAns
                    }
                })
            }else{
                const newCorrectAns = question.correctAnswers.filter(ans => ans !== ind)
                setQuestion(prev => {
                    return{
                        ...prev,
                        correctAnswers: newCorrectAns
                    }
                })
            }
            
        }else{
            if(name === "mark" || name === "expectedTime"){
                value = Number(value)
            }
            setQuestion( prev => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }        
    }

    const handeleAnswerChange = (event,index) =>{
        const newAns = question.answers.map((ans,ind) => {
            if(index !== ind)
            {
                return ans
            }
            return {...ans,name:event.target.value}
        })
        
        setQuestion(prev =>({...prev,answers:newAns}))
        console.log(question.answers[0] )
    }

    document.getElementById("modal-hook").style.zIndex = "100"
  return ReactDOM.createPortal(
    <form className='modalContainer' onSubmit={(e)=>handeleSubmit(e)}>
        <div className='addInputs'>
            <h2>Add question</h2>
            <input name='name' type='text' placeholder='name' onChange={(e)=>handeleChange(e)} value={question.name}/>
            <label className='warn'>{!question.name && "name is required"}</label>

            <input name='category' type='text' placeholder='category' onChange={(e)=>handeleChange(e)} value={question.category}/>
            <label className='warn'>{!question.category && "category is required"}</label>

            <input name='subCategory' type='text' placeholder='sub category' onChange={(e)=>handeleChange(e)}  value={question.subCategory}/>
            <label className='warn'>{!question.subCategory && "subCategory is required"}</label>

            <input name='mark' type='number' placeholder='mark' onChange={(e)=>handeleChange(e)} value={question.mark}/>
            <label className='warn'>{!question.mark && "mark is required"}</label>

            <input name='expectedTime' type='number' placeholder='expected time in seconds' onChange={(e)=>handeleChange(e)} value={question.expectedTime}/>
            <label className='warn'>{!question.expectedTime && "expectedTime is required"}</label>

            {question.answers.map((ans,index) => 
            <div key={index} className='inputsAddmodal'>
                <input 
                    type='text' 
                    placeholder={`answer ${index+1}`} 
                    value={question.answers[index].name} 
                    onChange={(e)=>handeleAnswerChange(e,index)} 
                />
                {index > 1&&
                    <button style={{backgroundColor:"red",color:"white",width:"30px",height:"30px",margin:"0",marginRight:"5px",borderRadius:"50%",padding:"0px"}} type='button' onClick={(event)=>deleteAnswer(event,index)}>➖</button>
                }
                <input 
                    type='checkbox'
                    className='checkbox'
                    onChange={(e) =>handeleChange(e,index)}
                />
                
            </div>
            )}
            <label style={{color:"red"}}>{err}</label>
            <button style={{backgroundColor:"darkslategrey",color:"white",width:"50px",height:"50px",margin:"0",borderRadius:"50%",padding:"0px"}} onClick={addAnswer}>➕</button>
            
        </div>
        <div style={{backgroundColor:"white"}}>
        <button className='closeModaBtnl' onClick={toggleModal}>Close</button>
        <button className='addModaBtnl' type="Submit" disabled={!(question.name && question.category && question.expectedTime && question.mark && question.subCategory && question.answers.length > 1 && question.correctAnswers.length > 0 && question.answers[0].name.length > 0 && question.answers[1].name.length > 0 )}>Create</button>
        </div>
    </form>
    ,document.getElementById("modal-hook"))
}

export default AddModal