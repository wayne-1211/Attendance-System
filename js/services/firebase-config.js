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
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

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
