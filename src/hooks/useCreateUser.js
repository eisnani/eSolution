import { useState } from "react"
import { useAuthContext } from "./useAuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, userRef } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export const useCreateUser = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { login: _createUser } = useAuthContext();
  const [res, setRes] = useState(null);

  const createUser = async (email, password, firstName, lastName, designation, department) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) throw new Error('Could not complete signup');
      setRes(res); //access to reset the form

      await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` })

      await setDoc(doc(userRef, res.user.uid), {
        firstName,
        lastName,
        designation,
        department,
        email
      })

      _createUser(res.user);

      setIsPending(false);
      setError(null);
    }
    catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  }

  return{ error, createUser, isPending, res }
}