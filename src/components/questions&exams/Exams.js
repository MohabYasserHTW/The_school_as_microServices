import React, { useContext, useEffect, useState } from "react";
import { request } from "../../apis/request";
import { ErrorsMessages, ReqMethods, URLS } from "../../variables";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UIElements/loading/LoadingSpinner";
import Exam from "./Exam";
import Card from "../UIElements/card/Card";
import { Link } from "react-router-dom";

export default function Exams(props) {
  const [page, setPage] = useState(1);
  const [examsDefs, setExamsDefs] = useState([]);
  const [exams, setExams] = useState(null);
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);

    if (authContext.userType === "student") {
      if (!exams) {
        const examInstancesResponse = request({
          method: ReqMethods.get,
          url: URLS.examInstance,
          auth: authContext.tokens.access_token,
          filters: {
            takenby: authContext.userId,
          },
        });

        examInstancesResponse
          .then((resp) => {
            setExams(resp.data);
            setErr(null);

            resp.data.forEach((exam) => {
              const response = request({
                method: ReqMethods.get,
                url: URLS.examDefination + exam.examdif,
                auth: authContext.tokens.access_token,
              });

              response
                .then((resp) => {
                  setExamsDefs((prev) => {
                    if (prev.find((exam) => exam.name === resp.data.name)) {
                      return [...prev];
                    } else {
                      return [
                        ...prev,
                        { ...resp.data, examInstanceId: exam.id },
                      ];
                    }
                  });
                })
                .catch((err) => {
                  setErr(
                    err?.data?.err || ErrorsMessages.examServiceNotWorking
                  );
                });
            });
            setIsLoading(false);
          })
          .catch((err) => {
            setErr(err?.data?.err || ErrorsMessages.examServiceNotWorking);
            setExams(null);
            setIsLoading(false);
          });
      }
    }
    if (authContext.userType === "teacher") {
      const response = request({
        method: ReqMethods.get,
        url: URLS.examDefination,
        auth: authContext.tokens.access_token,
        filters: {
          createdby: authContext.userId,
        },
      });
      response
        .then((resp) => {
          setExamsDefs(resp.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setErr(err?.data?.err || ErrorsMessages.examServiceNotWorking);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className="exams">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {err ? (
            <h1 style={{ color: "red" }}>{err}</h1>
          ) : (
            <>
              {!!examsDefs?.length && examsDefs.map((e) => {
                if (authContext.userType === "teacher") {
                  return <Exam key={e.id} exam={e} />;
                } else {
                  return (
                    <Card className="exam_card">
                      <h1>{e.name}</h1>
                      <p>number of questions : {e.questions?.length}</p>
                      <Link to={`/takeexam/${e.id}/${e.examInstanceId}`}>
                        <button className="view_exam-btn">
                          {"View exam >>>"}
                        </button>
                      </Link>
                    </Card>
                  );
                }
              })}
              {!examsDefs?.length && (
                <h1>you still have no exams got to exams and create one </h1>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
