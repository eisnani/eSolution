import { useEffect, useRef, useState } from 'react';
import { onSnapshot, query, where, orderBy, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useCollection = (ref, _query) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  const q = useRef(_query).current;

  useEffect(() => {
    setIsPending(true);

    let colRef = collection(db, ref);
    if (q) colRef = query(colRef, where(...q));

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
  }, [ref, q])

  // console.log(documents)
  
  return { documents, isPending, error};
}; 