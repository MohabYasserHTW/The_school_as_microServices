import React, { useContext, useState } from "react";
import "./Auth.css";

import { AuthContext } from "../context/auth-context";
import { ErrorsMessages, ReqMethods, URLS } from "../variables";
import LoadingSpinner from "../components/UIElements/loading/LoadingSpinner";
import { request } from "../apis/request";

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userName, setUserName] = useState("");
  const [firstNameIn, setFirstNameIn] = useState("");
  const [lastNameIn, setLastNameIn] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const authContext = useContext(AuthContext);

  const checkValidation = () => {
    if (isLoginMode) {
      if (userName && password) {
        return true;
      } else {
        return false;
      }
    } else {
      if (userName && firstNameIn && lastNameIn && password) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = checkValidation();

    if (isValid) {
      setIsLoading(true);
      let url;
      let data;

      if (isLoginMode) {
        url = URLS.keycloak_login;
        data = { userName, password };
      } else {
        url = URLS.keycloak_register;
        data = {
          userName,
          password,
          userType,
          firstName: firstNameIn,
          lastName: lastNameIn,
        };
      }

      const response = request({
        method: ReqMethods.post,
        url,
        body: data,
      });

      response

        .then((res) => {
          const {
            userType,
            access_token,
            refresh_token,
            userId,
            firstName,
            lastName,
          } = res.data;

          if (isLoginMode)
            authContext.login(
              userType,
              { access_token, refresh_token },
              { firstName, lastName },
              userId
            );
          setErr(null);
          setIsLoading(false);
          reset();
        })
        .catch((err) => {
          const message = err.response?.data?.message;
          setErr(message);
          setIsLoading(false);
        });
    } else {
      setErr(ErrorsMessages.messingFields);
    }
  };

  const reset = () => {
    setErr(null);
    setUserName("");
    setFirstNameIn("");
    setLastNameIn("");
    setPassword("");
    setUserType("student");
  };

  return (
    <main>
      <section className="login_section">
        <div className="container form_container">
          <div className="form_div">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="form_header">
                {isLoginMode ? <h1>LOGIN</h1> : <h1>REGISTER</h1>}
              </div>
              <div className="form_body">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <input
                      type="text"
                      name="userName"
                      placeholder="Enter your user name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    {!isLoginMode && (
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={firstNameIn}
                        onChange={(e) => setFirstNameIn(e.target.value)}
                      />
                    )}
                    {!isLoginMode && (
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={lastNameIn}
                        onChange={(e) => setLastNameIn(e.target.value)}
                      />
                    )}
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLoginMode && (
                      <select onChange={(e) => setUserType(e.target.value)}>
                        <option value={"student"}>Student</option>
                        <option value={"teacher"}>Teacher</option>
                      </select>
                    )}
                    <h3 style={{ color: "red" }}>{err}</h3>
                  </>
                )}
              </div>
              <div className="form_footer">
                <button disabled={isLoading} type="submit">
                  {isLoginMode ? "LOGIN" : "REGISTER"}
                </button>
                <p>
                  {isLoginMode
                    ? "don't have an account ? create one instead"
                    : "already have an account ? login instead"}
                </p>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    reset();
                    setIsLoginMode((prev) => !prev);
                  }}
                >
                  {isLoginMode ? "REGISTER" : "LOGIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Auth;
