// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  signInWithEmailAndPassword, 
  getAuth, 
  signOut, 
  sendPasswordResetEmail
} from "firebase/auth"

import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import {v4} from "uuid"

const firebaseConfig = {
  apiKey: "AIzaSyAx62IrQXvsvNb7909DB7v3pNZGcNhKeDQ",
  authDomain: "autospolo-9eb33.firebaseapp.com",
  projectId: "autospolo-9eb33",
  storageBucket: "autospolo-9eb33.appspot.com",
  messagingSenderId: "376249166826",
  appId: "1:376249166826:web:44a5480df2e2923a392093",
  measurementId: "G-T83NSNH4CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
export const db = getFirestore(app);


export const onSignIn = async ({email, password}) => {
    
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return res;
  } catch (error) {
    console.log(error);
  }
    
}
  
export const onLogOut = () => {
  signOut(auth);
}
  
export const forgotPassword = async ({email}) => {
  try {
    let res = await sendPasswordResetEmail(auth, email)
    return res;
  } catch (error) {
    console.log(error);
  }
}
  
export const uploadFile = async (file) =>{
  const storageRef = ref(storage, v4() )
  await uploadBytes(storageRef, file);
  let url = await getDownloadURL(storageRef)
  return url;
}