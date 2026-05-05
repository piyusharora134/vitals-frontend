import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDekzlEsmGH6cGXvwx51ABslTCtCrDNFHw",
  authDomain: "vitals-app-minor-c323d.firebaseapp.com",
  projectId: "vitals-app-minor-c323d",
  storageBucket: "vitals-app-minor-c323d.firebasestorage.app",
  messagingSenderId: "212621668865",
  appId: "1:212621668865:web:6ccb818739964256124600"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);