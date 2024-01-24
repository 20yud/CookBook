// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getDatabase} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP8gNSxfaFiLtelhHD-JpGFXUCgqhN02Y",
  authDomain: "cookbook-da4a3.firebaseapp.com",
  databaseURL: "https://cookbook-da4a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cookbook-da4a3",
  storageBucket: "cookbook-da4a3.appspot.com",
  messagingSenderId: "725396687156",
  appId: "1:725396687156:web:826a6e292314030ba63d61",
  measurementId: "G-TLN6DRZZTB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getDatabase();
export { auth,db };