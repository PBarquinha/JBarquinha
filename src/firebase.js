import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCircQ052liTGXU7joXGfIdlbokcE-EkwM",
  authDomain: "jbarquinha-28a41.firebaseapp.com",
  projectId: "jbarquinha-28a41",
  storageBucket: "jbarquinha-28a41.appspot.com",
  messagingSenderId: "669766058659",
  appId: "1:669766058659:web:5938d7ae1a0cf7f978f516",
  measurementId: "G-6916F0L383"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

