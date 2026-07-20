// js/services/firebase-config.js
//
// 這個專案是純靜態 HTML / ES Modules，沒有用 npm + 打包工具，
// 所以 import 一律要用完整網址（CDN），不能用 "firebase/app" 這種裸模組名稱。
//
// 對外介面（依 main.js / db.js 的實際呼叫方式）：
//   initFirebase() - 在 main.js 的 bootstrap() 裡呼叫一次，負責初始化 app 與 db
//   getDb()        - 給 db.js 等其他模組呼叫，取得已初始化的 Firestore instance

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
  measurementId: "G-5LQ5B4908K",
};

let app;
let db;

/**
 * 初始化 Firebase app 與 Firestore。main.js 只會呼叫這個函式一次，
 * 但這裡還是加了 guard，避免萬一被重複呼叫時重新 initializeApp 出錯。
 */
export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return app;
}

/**
 * 取得 Firestore instance。必須先呼叫過 initFirebase()，
 * 否則丟出明確的錯誤，方便除錯（而不是拿到 undefined 之後在很遠的地方才爆炸）。
 */
export function getDb() {
  if (!db) {
    throw new Error('Firebase 尚未初始化，請確認 main.js 有先呼叫 initFirebase()。');
  }
  return db;
}
