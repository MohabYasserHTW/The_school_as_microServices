import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userType: null,
  name: {
    firstName: null,
    lastName: null
  },
  userId: null,
  tokens: {
    access_token: "",
    refresh_token: ""
  },
  login: () => {},
  logout: () => {}
});
