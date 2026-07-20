import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  connectFirestoreEmulator,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ------------------------------------------------------------------
// 請將以下設定換成你自己 Firebase 專案的設定值。
// 在 Firebase Console → 專案設定 → 一般 → 你的應用程式 → SDK 設定與程式碼 取得。
// 建議另外用環境變數/建置流程注入，不要把正式金鑰提交進公開版本控制。
// ------------------------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);

let app = null;
let db = null;

export function initFirebase() {
  if (app) return { app, db };
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // 開發時如果想接本機 Firestore Emulator，取消下一行註解：
  // connectFirestoreEmulator(db, '127.0.0.1', 8080);

  return { app, db };
}

export function getDb() {
  if (!db) {
    throw new Error('Firebase 尚未初始化，請先呼叫 initFirebase()。');
  }
  return db;
}
