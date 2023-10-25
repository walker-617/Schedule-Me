import { initializeApp } from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, collection, getDoc, doc } from "firebase/firestore";

import firebaseConfig from "./config";
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);

export {db}

