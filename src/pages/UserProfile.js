import React,{useContext, useEffect, useState} from 'react'
import "./UserProfile.css"
import { AuthContext } from '../context/auth-context'
import Questions from '../components/questions&exams/Questions'
import Exams from '../components/questions&exams/Exams'


export default function UserProfile() {
    const [isExams,setIsExams] = useState(true) 
    const authContext = useContext(AuthContext)
      let content 

      if(authContext.userType === "teacher"){
        content = <>
            {isExams
                ?<Exams filters={{createdby: authContext.userId}} />
                :<Questions filters={{createdBy: authContext.userId}} />
            }
        </>
      }else if(authContext.userType === "student"){
        content = <>
            {
                <Exams type={"student"} filters={{takenby: authContext.userId}}/>
            }
        </>
      }

  return (
    <main>
        <section className='hero'>
            <div className="container">
                <div className='welcome_div'>
                    <h2>Welcome back {authContext.userType === "teacher"? `Mr/s ${authContext.name.firstName}`: authContext.name.firstName} </h2>
                    <select onChange={()=>setIsExams(prev => !prev)}>
                        <option value="exam">my exams</option>
                        <option value="question" >my questions</option>
                    </select>
                </div>
                <div className='the_school'>
                    <h1>THE </h1>
                    <h1>SCHOOL </h1>
                </div>
            </div>
        </section>
        <section>
            <div className='container user_profile_exams'>
                {
                    content

                }
                
            </div>
        </section>
    </main>
  )
}
