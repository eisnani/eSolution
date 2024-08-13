import { useReducer } from "react";
import { db, timestamp } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

let initialState = {
  isPending: false,
  document: null,
  success: null,
  error: null
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null };
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null };
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload };
    default:
      return state;
  }
};

export const useFirestore = (col) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const ref = collection(db, col);


  //ADD DOCUMENT
  const addDocument = async (document) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDoc = await addDoc(ref, { ...document, createdAt });
      dispatch({ type: 'ADDED_DOCUMENT', payload: addedDoc })
    }
    catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    }
  };

  //UPDATE A DOCUMENT
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const updatedDocument = await updateDoc(doc(ref, id), updates);
      dispatch({ type: 'UPDATED_DOCUMENT', payload: updatedDocument });
    }
    catch (err) {
      dispatch({ type: 'ERROR', payload: err.message });
    }
  };

  //DELETE A DOCUMENT
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(ref, id);
      await deleteDoc(docRef);
      dispatch({ type: 'DELETE_DOCUMENT' })
    }
    catch (err) {
      dispatch({ type: 'ERROR', payload: 'Failed to delete.' });
    }
  };
  
  return { response, addDocument, updateDocument, deleteDocument };
}; 