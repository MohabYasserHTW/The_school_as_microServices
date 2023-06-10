import React,{useContext, useEffect, useState} from 'react'
import Exams from '../components/questions&exams/Exams'
import { AuthContext } from '../context/auth-context'
import { Link } from 'react-router-dom'


function ExamsPage() {
    const authContext = useContext(AuthContext)
    return (
      <main>
        <section className='hero'>
            <div className="container">
                <div className='welcome_div'>
                    <h2>Welcome back {authContext.userType === "teacher"? `Mr/s ${authContext.name.firstName}`: authContext.name.firstName} </h2>
                    <h3>This is the exams library</h3>
                    <Link to={"/create/exam"}> <button className='create_btn'>Create Exam</button></Link>
                </div>
                <div className='the_school'>
                    <h1>THE </h1>
                    <h1>SCHOOL </h1>
                </div>
            </div>
        </section>
        <section>
          <div className='container user_profile_exams'>      
            <Exams  />  
          </div>
        </section>
      </main>
    )
  
}

export default ExamsPage