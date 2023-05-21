import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function shouldConnectToEmulator(): boolean {
  // You could do any logic here to decide whether to connect to the emulator or not
  return process.env.NEXT_PUBLIC_ENV === 'dev';
}

const app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore();

if (shouldConnectToEmulator()) {
  console.log('Connecting to emulators');
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  console.log('Connected to auth');
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('Connected to firestore');
} else {
  console.log('Not connecting to emulators');
}


export { auth, db };
export default app
