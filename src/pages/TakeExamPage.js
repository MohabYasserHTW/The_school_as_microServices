import React, { useContext, useEffect, useState } from "react";
import { request } from "../apis/request";
import { ErrorsMessages, ReqMethods, URLS } from "../variables";
import { AuthContext } from "../context/auth-context";
import Card from "../components/UIElements/card/Card";
import LoadingSpinner from "../components/UIElements/loading/LoadingSpinner";
import "./TakeExam.css";
import { useParams } from "react-router-dom";

export default function TakeExamPage(props) {
  const { examDifId, examInstanceId } = useParams();

  const [err, setErr] = useState(null);
  const [examDef, setExamDef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examStatus, setExamStatus] = useState(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    const respo = request({
      method:ReqMethods.get,
      url: URLS.examInstance + examInstanceId,
      auth: authContext.tokens.access_token
    })
    .then(res=>{
      setExamStatus(res.data[0].qstatus)
    })
    .catch(err=>{
      setErr(ErrorsMessages.examServiceNotWorking)
    })
    
    const response = request({
      method: ReqMethods.get,
      url: URLS.examDefination + examDifId,
      auth: authContext.tokens.access_token,
    });
    response
      .then((resp) => {
        setExamDef(resp.data);
        setErr(null);
        setIsLoading(false);
      })
      .catch((err) => {
        setErr(err?.data?.err || ErrorsMessages.examServiceNotWorking);
        setExamDef(null);
        setIsLoading(false);
      });
  }, []);

  const startTheExam = () => {
    setIsLoading(true);
    const response = request({
      method: ReqMethods.patch,
      url: URLS.examInstance + examInstanceId,
      body: {
        filters: {
          qstatus: "taken",
        },
      },
      auth: authContext.tokens.access_token,
    });

    response
      .then((res) => {
        examDef.questions.forEach((questionId) => {
          const resp = request({
            method: ReqMethods.get,
            url: URLS.questions + questionId,
            params: {
              userType: "student",
            },
            auth: res.data.examToken,
          });

          resp
            .then((res) => {
              setQuestions((prev) => {
                const newAnswers = res.data.answers.map(answer=>({...answer,isSelected:false}))
                return [...prev, {...res.data,answers:newAnswers}];
              });
              setIsLoading(false);
              setIsExamStarted(true);
            })
            .catch((err) => {
              setErr(
                err.response?.data?.err ||
                  ErrorsMessages.questionServiceNotWorking
              );
            });
        });
      })
      .catch((err) => {
        setErr(err.response?.data?.err || ErrorsMessages.examServiceNotWorking);
        setIsLoading(false);
      });
  };

  const nextQuestion = () => {
    if(questions[currentQuestionCount].answers.find(answer=>answer.isSelected===true)){
      setCurrentQuestionCount((prev) => prev + 1);
    }
  };
  const handeleAnswerChange = (e,index,questionIndex) => {
    setQuestions(prev=>{
    const newQuestions = [...prev]
    
    newQuestions[questionIndex].answers[index].isSelected = !newQuestions[questionIndex].answers[index].isSelected
    
    return [...newQuestions]
    })
  }
  const submitTheExam = () => {
    setIsExamStarted(false);
    setIsExamFinished(true);

    const response = request({
      method:ReqMethods.patch,
      url: URLS.examInstance + examInstanceId,
      body: {
        filters:{
          questions: questions.map(q=>{
            const selectedAns =q.answers.filter(answer=> answer.isSelected)
            return {
              id: q._id,
              selectedAnsewrs: selectedAns.map(a=>a._id)
            }
          })
        }
      },
      auth: authContext.tokens.access_token
    })

    response.then(res=>console.log(res)).catch(err=>console.log(err))

  };

  return (
    <main>
      <section className="hero">
        <div className="container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {" "}
              <div className="welcome_div">
                <h2>
                  Welcome back{" "}
                  {authContext.userType === "teacher"
                    ? `Mr/s ${authContext.name.firstName}`
                    : authContext.name.firstName}{" "}
                </h2>
                <h3>Are you ready for ? </h3>
                <h1>{err ? null : examDef.name} exam</h1>
              </div>
              <div className="the_school">
                <h1>THE </h1>
                <h1>SCHOOL </h1>
              </div>
            </>
          )}
        </div>
      </section>
      <section>
        <div className="container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {err ? (
                <p style={{ color: "red" }}>{err}</p>
              ) : (
                <Card className="exam_div">
                  {!isExamStarted ? (
                    <>
                      <h3>exam name: {examDef.name}</h3>
                      <h3>passing score: {examDef.passing_score}</h3>
                      <h3>questions count: {examDef.questions.length}</h3>
                      {!isExamFinished && examStatus !== "taken" && (
                        <button className="start_btn" onClick={startTheExam}>
                          Start Exam
                        </button>
                      )}
                      {examStatus === "taken" &&(
                    <h1>Taken, wait for your result </h1>
                      ) }
                    </>
                  ) : (
                    <>
                      <h1>{questions[currentQuestionCount].name}</h1>
                      <div className="answers">
                          {
                            questions[currentQuestionCount].answers.map((answer,index)=>{
                              const questionIndex = currentQuestionCount
                              return <p key={answer._id}>{answer.name}<input type="checkbox" checked={answer.isSelected} onChange={(e)=>handeleAnswerChange(e,index,questionIndex)}/></p>
                            })
                          }
                      </div>
                      {currentQuestionCount < examDef.questions.length - 1 && (
                        <button className="next_btn" onClick={nextQuestion}>
                          next
                        </button>
                      )}
                      {currentQuestionCount ===
                        examDef.questions.length - 1 && (
                        <button className="next_btn" onClick={submitTheExam}>
                          submit the exam
                        </button>
                      )}
                    </>
                  )}
                  {isExamFinished ? (
                    <h1>whish you did good, see you next time bye ! </h1>
                  ) : null}
                </Card>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
