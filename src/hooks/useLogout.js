import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { logout: _logout } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);
    
    try {
      await signOut(auth);
      
      _logout(null);
      setError(null);
      setIsPending(false);

    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    };
  }

  return { logout, isPending, error };
};
