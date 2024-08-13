import { createContext, useEffect, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: action.payload }
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true } 
    case 'IS_ADMIN':
      return { ...state, isAdmin: action.payload }
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
    isAdmin: false
  });

  const login = (user) => {
    dispatch({ type: 'LOGIN', payload: user })
  }

  const logout = (user) => {
    dispatch({ type: 'IS_ADMIN', payload: false })
    dispatch({ type: 'LOGOUT', payload: user })
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
      if (user && user.email === 'admin@test.com') dispatch({ type: 'IS_ADMIN', payload: true });
    })
    return () => unsub();
  }, []);

  // console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      { children }
    </AuthContext.Provider>
  )
}