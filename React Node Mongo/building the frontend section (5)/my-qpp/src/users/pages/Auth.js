import React, { useContext, useState } from 'react'
import Input from '../../shared/components/formElements/Input/Input'
import Card from '../../shared/components/Card'
import "./Auth.css"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validator'
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/components/formElements/Button/Button'
import { AuthContext } from '../../shared/context/auth-context'

function Auth() {
    const auth=useContext(AuthContext)
    const [isLoginMode,setIsLoginMode]=useState(true)
    const [formState,inputHandeler,setFormData]=useForm({
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        }
    },false)

    const submitHandeler = e=>{
        e.preventDefault()
        auth.login()
        console.log(formState.inputs)
    }
    const switchModeHandeler = ()=>{
        if(!isLoginMode){
            setFormData({...formState.inputs,name:undefined},formState.inputs.email.isValid&&formState.inputs.password.isValid)
        }else{
            setFormData({...formState.inputs,name:{value:"",isValid:false}},false)
        }
        
        setIsLoginMode(prev=>!prev)
    }
  return (
    <Card className="authintication">
        <h2>Login Required</h2>
        <hr/>
        <form onSubmit={submitHandeler}>
            {!isLoginMode&&
            <Input 
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please Enter a Name"
                onInput={inputHandeler}
            />
            }
            <Input
                title="email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Enter valid Email"
                label="E-mail" 
                type="email"
                element="input"
                id="email"
                onInput={inputHandeler}
                
            />
            <Input
                title="password"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Enter min 5 chars"
                label="Password" 
                type="password"
                element="input"
                id="password"
                onInput={inputHandeler}
                
            />
            <Button type="submit" disabled={!formState.isValid}>{isLoginMode?"Login":"SignUp"}</Button>
        </form>
        <Button inverse onClick={switchModeHandeler}>{isLoginMode?"SignUp":"Login"}</Button>
    </Card>
  )
}

export default Auth