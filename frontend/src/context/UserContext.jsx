// src/context/UserContext.js
import { createContext } from 'react';

export const UserContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  showLogin: false,
  setShowLogin: () => {},
  username: '',
  setUsername: () => {},
  phone: '',
  setPhone: () => {},
});
