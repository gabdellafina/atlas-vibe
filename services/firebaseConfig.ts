// src/services/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC5i02NJtJKySAcuaQtgQB-AiBg0uPLbW4",
  authDomain: "atlasvibe-35af2.firebaseapp.com",
  projectId: "atlasvibe-35af2",
  storageBucket: "atlasvibe-35af2.firebasestorage.app",
  messagingSenderId: "751506892388",
  appId: "1:751506892388:web:814725580239765ac1a171",
  measurementId: "G-EQXK5LZNB7"
};

export const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);

