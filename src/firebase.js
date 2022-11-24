import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-58etbFVfm6Xg1mSpfibitM204YhBMyg",
  authDomain: "todo-list-9860.firebaseapp.com",
  projectId: "todo-list-9860",
  storageBucket: "todo-list-9860.appspot.com",
  messagingSenderId: "955730342776",
  appId: "1:955730342776:web:0a33ded1db97e145768e8d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
