import React,{useContext, useEffect, useState} from 'react'
import Questions from '../components/questions&exams/Questions'
import { AuthContext } from '../context/auth-context'
import { Link } from 'react-router-dom'


function QuestionsPage() {
  const authContext = useContext(AuthContext)
    return (
      <main>
        <section className='hero'>
            <div className="container">
                <div className='welcome_div'>
                    <h2>Welcome back {authContext.userType === "teacher"? `Mr/s ${authContext.name.firstName}`: authContext.name.firstName} </h2>
                    <h3>This is the questions library</h3>
                    <Link to={"/create/question"}> <button className='create_btn'>Create Question</button></Link>
                </div>
                <div className='the_school'>
                    <h1>THE </h1>
                    <h1>SCHOOL </h1>
                </div>
            </div>
        </section>
        <section>
          <div className='container user_profile_exams'>      
            <Questions  />  
          </div>
        </section>
      </main>
    )
  
}

export default QuestionsPage