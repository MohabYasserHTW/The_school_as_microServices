 import React, { useContext, useEffect, useState } from 'react';
 import ReactDOM  from 'react-dom';
import './Signup.css';
import axios from "axios"
import { AuthContext } from '../context/auth-context';
import {  Navigate, useNavigate } from 'react-router-dom';
const Auth = () => {
const authContext = useContext(AuthContext)

  const navigate = useNavigate
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState("STUDENT")
  const [isLogin, setIsLogin] = useState(true)
  const [err,setErr] = useState(null)
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(isLogin){
      
        await axios({
          method: "POST",
          url: "http://localhost:5001/auth/login",
          data: {
            userName: name,
            password: password
          }
        })
        .then(res=>{
          const {userType,token,userId} = res.data
          authContext.login(userType,token,name,userId)
          setErr(null)
          
        })
        .catch(err=>{
          
          const message = err.response?.data?.err.message
          setErr(message || "server not working")
        })
      
     
      
    }else{
      await axios({
        method: "POST",
        url: "http://localhost:5001/auth/signup",
        data: {
          userName: name,
          password,
          userType
        }
      })
      .then(res=>{
        const {userType,token,userId} = res.data
        authContext.login(userType,token,name,userId)
        setErr(null)
      })
      .catch(err=>{
        
        const message = err.response?.data?.err.message
        setErr(message || "server not working")
      })
      
    }
    
    
  };

  return (<div className='formDiv' >
    {authContext.isLoggedIn &&  <Navigate to="/userprofile" replace={true} />}
    <form onSubmit={handleSubmit} className="signup-form">
      <label>
        Name:
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>
        Password:
        </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {!isLogin && <label>user type:</label>}
        {!isLogin && <select onChange={(e) => setUserType(e.target.value) }>
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
        </select> }
        <label>{err}</label>
      
      <button type="submit">{isLogin?"LOGIN":"SIGNUP"}</button>
      <p> {isLogin?"Don't have an account?":"You already have an account?"}<span onClick={()=>setIsLogin(prev=>!prev)}>{isLogin?"SIGNUP":"LOGIN"}</span></p>
    </form>
    </div>
  );
};

export default Auth;