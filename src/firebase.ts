
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByCUJuf6ugF8zvSc5lZaTD6IRTlQHjcxM",
  authDomain: "proyecto-edu-y-lis.firebaseapp.com",
  projectId: "proyecto-edu-y-lis",
  storageBucket: "proyecto-edu-y-lis.appspot.com",
  messagingSenderId: "424222507932",
  appId: "1:424222507932:web:aa99070a8b04ec78ddbe59",
  measurementId: "G-QGN8QQK6N2"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export async function getCities(db:Firestore) {
    const citiesCol = collection(db, 'lisita');
    const citySnapshot = await getDocs(citiesCol);
   return citySnapshot.docs.map(doc => doc.data());
    
  }

