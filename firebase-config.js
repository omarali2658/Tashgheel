// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyD8TbLs0IAqrnFYos7TPJ_G1N33Zv4wN1o",
  authDomain: "industrolink-67598.firebaseapp.com",
  databaseURL: "https://industrolink-67598-default-rtdb.firebaseio.com",
  projectId: "industrolink-67598",
  storageBucket: "industrolink-67598.firebasestorage.app",
  messagingSenderId: "904792303444",
  appId: "1:904792303444:web:5077d3b983ec58cc798ac1",
  measurementId: "G-X4YR3GX4W1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export database and auth
const db = firebase.firestore();
const auth = firebase.auth();
