import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAa67bI2MqCbYIYeDxUU4FoBfEv5vB57E",
  authDomain: "chat-82d32.firebaseapp.com",
  projectId: "chat-82d32",
  storageBucket: "chat-82d32.appspot.com",
  messagingSenderId: "1074324361346",
  appId: "1:1074324361346:web:034ff95736877d7c5e249b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();