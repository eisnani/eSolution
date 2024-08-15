import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useCollection = (ref) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setIsPending(true);

    const colRef = collection(db, ref);

    const unsub = onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) {
        setError('No data to fetch.');
        setIsPending(false);
      } 
      else {
        let results = [];
        snapshot.docs.forEach(doc => results.push({ ...doc.data(), id: doc.id }));
        setDocuments(results);
        setIsPending(false);
        setError(null);
      }
    },
      (err) => {
        console.log('Fetch data error:' + err.message);
        setError('Could not fetch data.');
        setIsPending(false);
      }
    );
    return () => unsub();
  }, [ref])

  // console.log(documents)
  
  return { documents, isPending, error};
}; 