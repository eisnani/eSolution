import { initializeApp } from 'firebase/app';
import { getFirestore, collection, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCkNwjV8CaASnQlGdQ_JrnSMH4hLVvtQi8",
  authDomain: "my-solutionn.firebaseapp.com",
  projectId: "my-solutionn",
  storageBucket: "my-solutionn.appspot.com",
  messagingSenderId: "230532461770",
  appId: "1:230532461770:web:6e8067f304f23436eab033"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const colRef = collection(db, 'works');
const userRef = collection(db, 'users');
const timestamp = Timestamp;

export { db, colRef, auth, timestamp, storage, userRef };