import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBicDiRHtOssiBkhEC77Zr1evgYSU1pNGQ",
    authDomain: "padsanstha.firebaseapp.com",
    databaseURL: "https://padsanstha-default-rtdb.firebaseio.com",
    projectId: "padsanstha",
    storageBucket: "padsanstha.firebasestorage.app",
    messagingSenderId: "385684814164",
    appId: "1:385684814164:web:8499a1ea21de2dd71830c1",
    measurementId: "G-K97B0X2GKS"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { firebaseConfig,db };
