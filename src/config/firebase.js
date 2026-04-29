import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDhZxH4pwm6Yp6Rs-KCjQn3TZNJzE1VrQs",
  authDomain: "myfoodapp-77675.firebaseapp.com",
  projectId: "myfoodapp-77675",
  storageBucket: "myfoodapp-77675.firebasestorage.app",
  messagingSenderId: "980191655992",
  appId: "1:980191655992:web:99167b5cedf9da97c64ecd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;