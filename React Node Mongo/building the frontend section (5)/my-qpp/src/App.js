import './App.css';
import { BrowserRouter as Router , Route , Redirect , Switch} from 'react-router-dom'
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNav from './shared/components/navs/MainNav';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useCallback, useState } from 'react';
function App() {
  const [isLoggedIn,setIsLoading]=useState(false)
  const login =useCallback(()=>{
    setIsLoading(true)
  },[])
  const logout =useCallback(()=>{
    setIsLoading(false)
  },[])

  let routes=(
    isLoggedIn?(
      <Switch>
      <Route path="/" exact>
            <Users />
          </Route>
          <Route path="/:userId/places">
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            <NewPlace />
          </Route>
          <Route path="/places/:placeId" exact>
            <UpdatePlace />
          </Route>
          <Redirect to="/"/>
      </Switch>
    ):(
      <Switch>
      <Route path="/" exact>
            <Users />
          </Route>
          <Route path="/:userId/places">
            <UserPlaces />
          </Route>
          <Route path="/auth" exact>
            <Auth />
          </Route>
          <Redirect to="/auth"/>
      </Switch>
    )
  )

  return (
    <AuthContext.Provider value={{isLoggedIn:isLoggedIn,login:login,logout:logout}}>
      <Router >
        <MainNav/>
        <main>
        
          {routes}
        
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
