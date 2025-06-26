// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmv0HKBrLlKqyAKt3r3noMReHEi7lVj6Q",
  authDomain: "dessert-tap.firebaseapp.com",
  projectId: "dessert-tap",
  storageBucket: "dessert-tap.firebasestorage.app",
  messagingSenderId: "47728839713",
  appId: "1:47728839713:web:b55f1418ad8fd935e4e760"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
