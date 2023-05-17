
import Auth from './components/Auth';
import {
  BrowserRouter ,
  Route,
  redirect,
  Routes
} from 'react-router-dom';
import Header from './components/nav/Header';
import UserProfile from './components/UserProfile';
import { AuthContext } from './context/auth-context';
import { useState } from 'react';
import Questions from './components/Questions';
import QuestionPage from './components/Questions/QuestionPage';


function App() {
  const [userType, setuserType] = useState(null)
  const [token, setToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = (userType,token,userName,userId) => {
    setToken(token)
    setUserName(userName)
    setuserType(userType)
    setIsLoggedIn(true)
    setUserId(userId)
  }
  const logout = () => {
    setToken(null)
    setUserName(null)
    setuserType(null)
    setIsLoggedIn(false)
    setUserId(null)
  }

  let routes 
  


  return (
    <AuthContext.Provider
      value={
        {
          isLoggedIn:isLoggedIn,
          userType: userType,
          userName: userName,
          userId: userId,
          token: token,
          login: login,
          logout: logout
        }
      }
    >
    <div className="App">
      
      <BrowserRouter>
      <Header /> 
        <Routes>
           <Route path='/' element={<Auth />} />
           <Route path='/userProfile' element={<UserProfile />} />
           <Route path='/question/:qId' element={<QuestionPage />} />
           
        </Routes> 
      </BrowserRouter>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
