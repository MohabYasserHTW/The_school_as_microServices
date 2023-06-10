import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { ErrorsMessages, ReqMethods, URLS } from "../variables";

import LoadingSpinner from "../components/UIElements/loading/LoadingSpinner";
import Question from "../components/questions&exams/Question";
import "./ExamPage.css"
import Select from "react-select";
import { request } from "../apis/request";

export default function ExamPage() {
  const { eId } = useParams();
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState({});
  const [err, setErr] = useState();
  const [students, setStudents] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [scheduleFrom, setScheduleFrom] = useState([]);
  const [scheduleTo, setScheduleTo] = useState([]);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [questionsObj, setQuestionsObj] = useState();
  const [options, setOptions] = useState();

  const authContext = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);

    const response = request({
      method: ReqMethods.get,
      url: URLS.examDefination + eId,
      auth: authContext.tokens.access_token,
    });

    response
      .then((res) => {
        setExam(res.data);
        setIsLoading(false);

        let questionsObjs = [];
        setQuestionsReady(false);
        
        var bar = new Promise((resolve, reject) => {

          res.data.questions.forEach((q,ind) => {
            request({
              method: ReqMethods.get,
              url: URLS.questions + q,
              auth: authContext.tokens.access_token,
            })
              .then((resp) => {
                questionsObjs.push(resp.data);
                if(ind===res.data.questions.length-1){
                  resolve()
                  
                }
              })
              .catch((err) => {
                console.log(err)
                setErr(err.response?.data?.message);
              });
            
      })
    })

      bar.then(() => {
        console.log(questionsObjs)
          setQuestionsObj(questionsObjs)
          setQuestionsReady(true)
      });

       
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

 

  useEffect(() => {
    const response = request({
      method: ReqMethods.get,
      url: URLS.users + "STUDENT",
      auth: authContext.tokens.access_token,
    });

    response
      .then((res) => {
        setOptions((prev) => {
          const students = res.data.map((student) => {
            return {
              ...student,
              value: student.firstName + " " + student.lastName,
              label: student.firstName + " " + student.lastName,
            };
          });
          return students;
        });
        setStudents(res.data);
      })
      .catch((err) => {
        setErr(err.response.data.err || ErrorsMessages.keyCloakNotWorking);
      });
  }, []);

  const assignStudent = (student) => {
    if (!assignedTo.includes(student.id)) {
      setAssignedTo((prev) => [...prev, student]);
    }
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  const isValidData = () => {
    if (!assignedTo.length) {
      return false;
    } else {
      return true;
    }
  };

  const reset = () => {
    setAssignedTo(null);
    setScheduleFrom(null);
    setScheduleTo(null);
  };

  const handeleSubmit = (e) => {
    e.preventDefault();
    if (isValidData()) {
      assignedTo.forEach((s) => {
        const response = request({
          method: ReqMethods.post,
          url: URLS.examInstance,
          auth: authContext.tokens.access_token,
          body: {
            examDifId: exam.id,
            generatedLink: {
              scheduleTimeFrom: scheduleFrom,
              scheduleTimeTo: scheduleTo,
              url: URLS.takeExam,
            },
            createdBy: authContext.userId,
            takenBy: s.id,
          },
        });

        response
          .then((resp) => {
            setIsAssignMode(false);
            setErr(null);
            reset();
          })
          .catch((err) => {
            console.log(err);
            setErr(
              err.response?.data?.err || ErrorsMessages.examServiceNotWorking
            );
          });
      });
    } else {
      setErr(ErrorsMessages.messingFields);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <main>
          <section className="hero">
            <div className="container">
              <div className="welcome_div">
                <h2>
                  Welcome back{" "}
                  {authContext.userType === "teacher"
                    ? `Mr/s ${authContext.name.firstName}`
                    : authContext.name.firstName}{" "}
                </h2>
                <button
                  className="create_btn"
                  onClick={() => setIsAssignMode((prev) => !prev)}
                >
                  Assign the exam{" "}
                </button>
              </div>
              <div className="the_school">
                <h1>THE </h1>
                <h1>SCHOOL </h1>
              </div>
            </div>
          </section>
          <section>
            <div className="container exam_container">
              {<h1 style={{ color: "red" }}>{err}</h1>}
              <h1>exam name: {exam.name}</h1>
              <h1>passing score : {exam.passing_score}</h1>
              {!questionsReady ? (
                <LoadingSpinner />
              ) : (
                <>
                  {
                    questionsObj.map((q) => (
                      <Question key={q._id} question={q} />
                    ))}
                </>
              )}
            </div>
          </section>
          {isAssignMode && (
            <>
              <section>
                <div className="container">
                  <h1>assigned for</h1>
                  {!!assignedTo?.length
                    ? assignedTo.map((s) => (
                        <h1 key={s.id}>
                          {s.firstName} {s.lastName}
                        </h1>
                      ))
                    : null}
                </div>
              </section>
              <section>
                <div className="container ">
                  <h1>select to assign</h1>
                  <Select
                    options={options}
                    isMulti
                    onChange={(e) => setAssignedTo(e)}
                  />
                </div>
              </section>
              <section>
                <div className="container assignInputs">
                  <h1>scheduleFrom:</h1>
                  <input
                    name="scheduleFrom"
                    type="date"
                    placeholder="schedule from"
                    onChange={(e) => setScheduleFrom(e.target.value)}
                    value={scheduleFrom}
                  />

                  <h1>scheduleto:</h1>
                  <input
                    name="scheduleto"
                    type="date"
                    placeholder="schedule to"
                    onChange={(e) => setScheduleTo(e.target.value)}
                    value={scheduleTo}
                  />
                </div>
                <div className="container">
                  <form onSubmit={(e) => handeleSubmit(e)}>
                    <button className="submit_btn">submit</button>
                  </form>
                </div>
              </section>
            </>
          )}
        </main>
      )}
    </>
  );
}
