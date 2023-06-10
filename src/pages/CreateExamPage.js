import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { ErrorsMessages, Messages, ReqMethods, URLS } from "../variables";
import { request } from "../apis/request";
import LoadingSpinner from "../components/UIElements/loading/LoadingSpinner";
import Question from "../components/questions&exams/Question";
import { Navigate } from "react-router-dom";


export default function CreateExamPage() {
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState();
  const [err, setErr] = useState("");
  const [questionsErr, setQuestionsErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const authContext = useContext(AuthContext);

  const [exam, setExam] = useState({
    name: "",
    passing_score: 50,
    createdby: "",
    questions: [],
  });

  useEffect(() => {
    setIsLoading(true)

    const response = request({
      method: ReqMethods.get,
      url: URLS.questions,
      filters: {
         createdBy: authContext.userId 
      },
      pagination: {
        skip: (page - 1) * 10,
        limit: 10,
      },
      auth: authContext.tokens.access_token
    })

    response
        .then((resp) => {
          setQuestions(resp.data.questions);
          
          setIsLoading(false);
          
        })
        .catch((err) => {
          setQuestionsErr(err.response?.data?.err || ErrorsMessages.questionServiceNotWorking);
          setIsLoading(false);
        });
  }, [page]);

  const handeleChange = (e, ind) => {
    let { name, value } = e.target;

    if (name === "mark" || name === "expectedTime") {
      value = Number(value);
    }
    setExam((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const AddQuestion = (question) => {
    
    setExam((prev) => {
      let newQuestions = prev.questions;
      if (!newQuestions.find(q=>q._id===question._id)) {
        newQuestions.push(question);
      }
      return { ...prev, questions: newQuestions };
    });

    setQuestions(prev=>{
        let newQuestions = prev.filter(q=>q._id !== question._id)
        return [...newQuestions]
    })
  };

  const isValidData = () => {
    if(!exam.name || !exam.questions || !exam.questions.length){
      return false
    }else{
      return true
    }
  }

  const handeleSubmit = async(e) => {
    e.preventDefault();
    
    if(isValidData()){
      const response = request({
        method: ReqMethods.post,
        url: URLS.examDefination,
        body:{
          ...exam,
          questions: exam.questions.map(q => q._id)
        },
        auth: authContext.tokens.access_token
      })
  
         response.then(() => {
          setIsCreated(true)
            
          })
          .catch((err) => {
            
           setErr(err.response?.data?.err || ErrorsMessages.examServiceNotWorking)
          });
    }else{
      
      setErr(ErrorsMessages.messingFields)
    }

  }


  return (
    <main>
      {isCreated && <Navigate to={"/userprofile"}/>}
      <section className="hero">
        <div className="container">
          <div className="welcome_div">
            <h2>
              Welcome back{" "}
              {authContext.userType === "teacher"
                ? `Mr/s ${authContext.name.firstName}`
                : authContext.name.firstName}
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
          <h1 style={{color:"red"}}>{err}</h1>
          <form
            className="create_form"
            onSubmit={(e) => handeleSubmit(e)}
          >
            <div>
              <h2>add exam</h2>
              <input
                name="name"
                type="text"
                placeholder="name"
                onChange={(e) => handeleChange(e)}
                value={exam.name}
              />
              <label style={{ color: "red" }}>
                {!exam.name && "name is required"}
              </label>
              <input
                name="passing_score"
                type="number"
                placeholder="passing_score"
                onChange={(e) => handeleChange(e)}
                value={exam.passing_score}
              />
              
            </div>
            <div>
                {questionsErr}
                {!!exam.questions?.length  && <h1>your selected Questions</h1>}
                {!!exam.questions?.length &&
                  exam.questions.map((q) => <Question key={q._id} question={q}/>)}
              
            </div>

                <button className="submit_btn" type="submit">Creat the exam </button>

            <div>
                <h2>select the questions you want to add to your exam</h2>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  
                      {!!questions?.length && questions.map((q) => (
                        <Question
                          key={q._id}
                          question={q}
                          type={"add"}
                          onAdd={AddQuestion}
                        />
                      ))}
                      {!questions?.length && (
                        <h1>
                          {
                            Messages.noDataFound
                          }
                        </h1>
                      )}
                    
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
