import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { ErrorsMessages, URLS } from "../variables";
import "./CreateQuestions.css";
import { Navigate } from "react-router-dom";

function CreateQuestionPage({ toggleModal, type, qId, setRefresh }) {
  const authContext = useContext(AuthContext);
  const [created,setCreated] = useState(false)
  const [err, setErr] = useState(null);
  const [question, setQuestion] = useState({
    name: "",
    category: "",
    subCategory: "",
    mark: null,
    expectedTime: null,
    answers: [
      { name: "", description: "" },
      { name: "", description: "" },
    ],
    correctAnswers: [],
  });
  /* const [correctAnswersAsBoolean, setCorrectAnswersAsBoolean] = useState([]) */

  /*  const transferTheCorrectAnswersToBooleans = () =>{
      question.answers.forEach( (answer, index) => {
        if(question.correctAnswers.includes(answer._id)){
          
          setCorrectAnswersAsBoolean(prev => [...prev,true])
        }else{
          setCorrectAnswersAsBoolean(prev => [...prev,false])
        }
      })
    } */

  /* const method = type === "edit"? "PATCH" : "POST" */

  /* useEffect(()=>{
        
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
                const convertedCorrectAnswers =[]
                res.data.answers.map((ans,ind) => {
                    if(res.data.correctAnswers.includes(ans._id))
                    {
                        convertedCorrectAnswers.push(true)
                    }else{
                        
                        convertedCorrectAnswers.push(false)
                    }
                    
                })
                setQuestion({
                    name: res.data.name,
                    category: res.data.category,
                    subCategory: res.data.subCategory,
                    mark: res.data.mark,
                    expectedTime: res.data.expectedTime,
                    answers: res.data.answers.map(ans => ans),
                    correctAnswers:res.data.correctAnswers
                })
                transferTheCorrectAnswersToBooleans()
                
            }
              )
              .catch(err=>{
                
                const message = err.response?.data?.message
                setErr(message || "server not working")
              })
        }}

        getQuestion()
    },[]) */

  const deleteAnswer = (e, ind) => {
    setQuestion((prev) => {
      const answers = prev.answers.filter((ans, index) => index !== ind);
      const correctAnswers = prev.correctAnswers.filter((ans) => ans !== ind);
      return { ...prev, answers: answers, correctAnswers: correctAnswers };
    });
    
  };

  const addAnswer = () => {
    setQuestion((prev) => {
      const newAnswer = { name: "", decription: "" };
      const answers = [...prev.answers, newAnswer];
      
      return { ...prev, answers: answers };
    });
  };

  const handeleSubmit = async (e) => {
    e.preventDefault();

    if (
      question.name &&
      question.category &&
      question.expectedTime &&
      question.mark &&
      question.subCategory &&
      question.answers.length > 1 &&
      question.correctAnswers.length > 0 &&
      question.answers[0].name.length > 0 &&
      question.answers[1].name.length > 0
    ) {
      /* let newCorrectAnswers =[]
            if(type === "edit"){
                  
                question.correctAnswers.forEach((answer1,ind) => answer1?newCorrectAnswers.push(ind):null)
            } */

      await axios({
        method: "POST",
        url: URLS.questions,
        data: {
          ...question,
          questionId: qId,
          correctAnswers:
            /* type==="edit"?newCorrectAnswers: */ question.correctAnswers,
        },
        headers: {
          Authorization: `Bearer ${authContext.tokens.access_token}`,
        },
      })
        .then(() => {
          
          setCreated(true)
        })
        .catch((err) => {
          
          const message = err.response?.data?.message;
          setErr(message || ErrorsMessages.questionServiceNotWorking);
        });
    }
  };

  const handeleChange = (e, ind) => {
    
    let { name, value, checked } = e.target;
    let compType = e.target.type;
    if (compType === "checkbox") {
      
      if (type === "edit") {
        
        setQuestion((prev) => {
          const newCorrectAns = prev.correctAnswers.map((ans, index) =>
            index === ind ? !ans : ans
          );
          return {
            ...prev,
            correctAnswers: newCorrectAns,
          };
        });
      } else {
        
        if (checked) {
          const newCorrectAns = question.correctAnswers;
          newCorrectAns.push(ind);
          setQuestion((prev) => {
            return {
              ...prev,
              correctAnswers: newCorrectAns,
            };
          });
        } else {
          const newCorrectAns = question.correctAnswers.filter(
            (ans) => ans !== ind
          );
          setQuestion((prev) => {
            return {
              ...prev,
              correctAnswers: newCorrectAns,
            };
          });
        }
      }
    } else {
      if (name === "mark" || name === "expectedTime") {
        value = Number(value);
      }
      setQuestion((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handeleAnswerChange = (event, index) => {
    const { name } = event.target;
    const newAns = question.answers.map((ans, ind) => {
      if (index !== ind) {
        return ans;
      }
      return { ...ans, [name]: event.target.value };
    });

    setQuestion((prev) => ({ ...prev, answers: newAns }));
    
  };

  /* document.getElementById("modal-hook").style.zIndex = "100"
  return ReactDOM.createPortal(
    <form className='modalContainer' onSubmit={(e)=>handeleSubmit(e)}>
        <div className='addInputs'>
            <h2>Add question</h2>
            <input name='name' type='text' placeholder='name' onChange={(e)=>handeleChange(e)} value={question.name}/>
            <label style={{color:"red"}}>{!question.name && "name is required"}</label>

            <input name='category' type='text' placeholder='category' onChange={(e)=>handeleChange(e)} value={question.category}/>
            <label style={{color:"red"}}>{!question.category && "category is required"}</label>

            <input name='subCategory' type='text' placeholder='sub category' onChange={(e)=>handeleChange(e)}  value={question.subCategory}/>
            <label style={{color:"red"}}>{!question.subCategory && "subCategory is required"}</label>

            <input name='mark' type='number' placeholder='mark' onChange={(e)=>handeleChange(e)} value={question.mark}/>
            <label style={{color:"red"}}>{!question.mark && "mark is required"}</label>

            <input name='expectedTime' type='number' placeholder='expected time in seconds' onChange={(e)=>handeleChange(e)} value={question.expectedTime}/>
            <label style={{color:"red"}}>{!question.expectedTime && "expectedTime is required"}</label>
            <hr></hr>
            <h2>Answers</h2>
            {question.answers.map((ans,index) => 
            <>
                <div key={index} className='inputsAddmodal'>
                    <input 
                        name='name'
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
                        checked={type==="edit"?question.correctAnswers[index]:null}
                    />
                    
                </div>
                <input 
                name = "description"
                type='text' 
                placeholder={`description for ans no: ${index+1} [OPTIONAL]`} 
                value={question.answers[index].description} 
                onChange={(e)=>handeleAnswerChange(e,index)} 
                />
            </>
            
            
            )}
            <label style={{color:"red"}}>{err}</label>
            <button style={{backgroundColor:"darkslategrey",color:"white",width:"50px",height:"50px",margin:"0",borderRadius:"50%",padding:"0px"}} onClick={addAnswer} type='button'>➕</button>
            
        </div>
        <div style={{backgroundColor:"white"}}>
        <button className='closeModaBtnl' onClick={toggleModal}>Close</button>
        <button className='addModaBtnl' type="Submit" disabled={!(question.name && question.category && question.expectedTime && question.mark && question.subCategory && question.answers.length > 1 && question.correctAnswers.length > 0 && question.answers[0].name.length > 0 && question.answers[1].name.length > 0 )}>Create</button>
        </div>
    </form>
    ,document.getElementById("modal-hook")) */

  return (
    <main>
        {created && <Navigate to={"/userprofile"}/>}
      <section className="hero">
        <div className="container">
          <div className="welcome_div">
            <h2>
              Welcome back{" "}
              {authContext.userType === "teacher"
                ? `Mr/s ${authContext.name.firstName}`
                : authContext.name.firstName}{" "}
            </h2>
          </div>
          <div className="the_school">
            <h1>THE </h1>
            <h1>SCHOOL </h1>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <form className="create_form" onSubmit={(e) => handeleSubmit(e)}>
            <div>
              <h2>Add question</h2>
              <input
                name="name"
                type="text"
                placeholder="name"
                onChange={(e) => handeleChange(e)}
                value={question.name}
              />
              <label style={{ color: "red" }}>
                {!question.name && "name is required"}
              </label>

              <input
                name="category"
                type="text"
                placeholder="category"
                onChange={(e) => handeleChange(e)}
                value={question.category}
              />
              <label style={{ color: "red" }}>
                {!question.category && "category is required"}
              </label>

              <input
                name="subCategory"
                type="text"
                placeholder="sub category"
                onChange={(e) => handeleChange(e)}
                value={question.subCategory}
              />
              <label style={{ color: "red" }}>
                {!question.subCategory && "subCategory is required"}
              </label>

              <input
                name="mark"
                type="number"
                placeholder="mark"
                onChange={(e) => handeleChange(e)}
                value={question.mark}
              />
              <label style={{ color: "red" }}>
                {!question.mark && "mark is required"}
              </label>

              <input
                name="expectedTime"
                type="number"
                placeholder="expected time in seconds"
                onChange={(e) => handeleChange(e)}
                value={question.expectedTime}
              />
              <label style={{ color: "red" }}>
                {!question.expectedTime && "expectedTime is required"}
              </label>
            </div>
            <div>
              <h2>Answers</h2>
              {question.answers.map((ans, index) => (
                <>
                  <div className="answer_div" key={index}>
                    <input
                      name="name"
                      type="text"
                      placeholder={`answer ${index + 1}`}
                      value={question.answers[index].name}
                      onChange={(e) => handeleAnswerChange(e, index)}
                    />

                    {index > 1 && (
                      <button
                        type="button"
                        onClick={(event) => deleteAnswer(event, index)}
                      >
                        ➖
                      </button>
                    )}
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => handeleChange(e, index)}
                      checked={
                        type === "edit" ? question.correctAnswers[index] : null
                      }
                    />
                  </div>
                  {/* <input
                    name="description"
                    type="text"
                    placeholder={`description for ans no: ${
                      index + 1
                    } [OPTIONAL]`}
                    value={question.answers[index].description}
                    onChange={(e) => handeleAnswerChange(e, index)}
                  /> */}
                </>
              ))}
              <label style={{ color: "red" }}>{err}</label>
              <button onClick={addAnswer} type="button">
                ➕
              </button>
            </div>
            <div>
              <button
                className="submit_btn"
                type="Submit"
                disabled={
                  !(
                    question.name &&
                    question.category &&
                    question.expectedTime &&
                    question.mark &&
                    question.subCategory &&
                    question.answers.length > 1 &&
                    question.correctAnswers.length > 0 &&
                    question.answers[0].name.length > 0 &&
                    question.answers[1].name.length > 0
                  )
                }
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreateQuestionPage;
