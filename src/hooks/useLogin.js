import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthContext } from './useAuthContext';
import { auth } from '../firebase/config'

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { login: _login } = useAuthContext();

  const login = async (email, password) => {
    setIsPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (!res) throw new Error('Could not complete login.');

      _login(res.user);
            
      setIsPending(false);
      setError(null);
    }
    catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  }

  return { login, isPending, error }
}