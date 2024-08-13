import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export const useDocument = (ref, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, ref, id), snapshot => {
      if (snapshot.data()) {
        setDocument({ ...snapshot.data(), id: snapshot.id });
        setError(null);
      }
      else {
        setError('Failed to fetch data.');
      }
    },
    (err) => {
      setError('Failed to fetch data.');
      console.log(err.message);
    });

    return () => unsub();
  }, [id, ref])

  return { document, error };
};