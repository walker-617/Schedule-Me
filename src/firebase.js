import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiK41_ZXl-kBxEBUgMivL228Vf5C2FTes",
  authDomain: "schedule-me-8c9c5.firebaseapp.com",
  projectId: "schedule-me-8c9c5",
  storageBucket: "schedule-me-8c9c5.appspot.com",
  messagingSenderId: "165993725132",
  appId: "1:165993725132:web:6eb237ddcb642bb307d669",
  measurementId: "G-TB5H0ESWKK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
