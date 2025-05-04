// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import firebase from 'firebase/compat';

const firebaseConfig = {
  apiKey: "AIzaSyCUIL8um7zLYzihYvBrv2gpE34UFxXRoxQ",
  authDomain: "threads-city-e4853.firebaseapp.com",
  databaseURL: "https://threads-city-e4853-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "threads-city-e4853",
  storageBucket: "threads-city-e4853.firebasestorage.app",
  messagingSenderId: "935009471431",
  appId: "1:935009471431:android:74d8d65324c71a129627e2"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };