import Header from "./components/header/Header";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';
import { useState } from "react";
import { AuthContext } from './context/auth-context';
import UserProfile from "./pages/UserProfile";
import QuestionPage from "./pages/QuestionPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import QuestionsPage from "./pages/QuestionsPage"
import ExamsPage from "./pages/ExamsPage";
import CreateExamPage from "./pages/CreateExamPage";
import ExamPage from "./pages/ExamPage";
import TakeExamPage from "./pages/TakeExamPage";

/* 
let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Navigate to="/" />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Navigate to="/auth" />
      </Routes>
    );
  } */

if(true){
  
}

function App() {
  const [userType, setuserType] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [name, setName] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)

  let routes
  if(isLoggedIn){
    routes = (
      <Routes>
        
          <Route path="/" exact element={<Home />} />
          <Route path="/userprofile"  element={<UserProfile />} />
          {<Route path="/questions" exact element={<QuestionsPage />} />}
          <Route path="/questions/:qId"  element={<QuestionPage />} />
          <Route path="/exams/:eId"  element={<ExamPage />} />
          <Route path="/create/question" exact  element={<CreateQuestionPage />} />
          <Route path="/create/exam" exact  element={<CreateExamPage />} />
          <Route path="/exams"  element={<ExamsPage />} />
          <Route path="/takeexam/:examDifId/:examInstanceId" exact element={<TakeExamPage />} />
          <Route path="*" element={<Home />} />
        
      </Routes>
    )
  }else{
    routes = (
      <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/auth" exact element={<Auth />} />
          
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }


  const login = (userType,tokens,name,userId) => {
    setTokens(tokens)
    setName(name)
    setuserType(userType)
    setIsLoggedIn(true)
    setUserId(userId)
  }
  const logout = () => {
    setTokens(null)
    setName(null)
    setuserType(null)
    setIsLoggedIn(false)
    setUserId(null)
  }

  return (
    <>
    <AuthContext.Provider
      value={
        {
          isLoggedIn ,
          userType ,
          name ,
          userId ,
          tokens ,
          login,
          logout
        }
      }
    >
    
    <Router>
      <Header />
      {routes}
    </Router>
    </AuthContext.Provider>
    </>
  );
}

export default App;
