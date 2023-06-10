import React, { useContext, useEffect, useState } from 'react'
import { request } from "../../apis/request"
import { URLS } from '../../variables'
import { AuthContext } from '../../context/auth-context'
import LoadingSpinner from '../UIElements/loading/LoadingSpinner'
import Question from './Question'



export default function Questions(props) {
    const [page,setPage] = useState(1)
    const [questions,setQuestions] = useState([])
    const [err,setErr] = useState("")
    const [isLoading,setIsLoading] = useState(true)
    const authContext = useContext(AuthContext)

    useEffect(() => {
        const url = URLS.questions
        const method = "GET"
        const filters = props.filters
        const pagination = {
          skip:(page-1)*10, 
          limit:10  
        }
        const auth = authContext.tokens.access_token

        const questions = async () => {
          setIsLoading(true)
          let questions 
          await request({method,url,filters ,pagination,auth})
          .then(resp=>{setQuestions(resp.data.questions);setIsLoading(false)})
          .catch(err=>{setErr(err.response.data.message);setIsLoading(false)}) 
          
        }
      
        questions()

    },[page])

  return (
    <div className='questions'>
      {isLoading?<LoadingSpinner/>:
      <>
        {err?<h1 style={{color:"red"}}>{err}</h1>
        :<>{questions.map(q => <Question key={q._id} question={q}/>)}{!questions?.length && <h1>you still have no questions got to questions and create one </h1>}</>
        }
      </>
      }
    </div>
  )
}
