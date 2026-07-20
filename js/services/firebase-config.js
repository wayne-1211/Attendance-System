// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoQB6SrzIvifO8QqNoMzm56JAHJS5qQiA",
  authDomain: "attendance-system-412f9.firebaseapp.com",
  projectId: "attendance-system-412f9",
  storageBucket: "attendance-system-412f9.firebasestorage.app",
  messagingSenderId: "332152843833",
  appId: "1:332152843833:web:a03fc3b338c8c15dc967e8",
  measurementId: "G-5LQ5B4908K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function getDb() {
  return db;
}
