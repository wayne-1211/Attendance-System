// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// 這個專案是純靜態 HTML / ES Modules（沒有用 npm + 打包工具），瀏覽器原生
// import 只能解析相對路徑或完整網址，不能用 "firebase/app" 這種裸模組名稱，
// 所以改成從 Firebase 官方 CDN 匯入。

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

// db.js 及 auth-gate.js 都是用 `import { getDb } from './firebase-config.js'`
// 再呼叫 getDb() 來取得 Firestore instance，所以這裡要 export 這個函式。
export function getDb() {
  return db;
}
