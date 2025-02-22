import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkoaipcAwK052ikCJn6DLcfgN2t5iSPxk",
  authDomain: "devbud-4f264.firebaseapp.com",
  databaseURL: "https://devbud-4f264-default-rtdb.firebaseio.com",
  projectId: "devbud-4f264",
  storageBucket: "devbud-4f264.firebasestorage.app",
  messagingSenderId: "946167149971",
  appId: "1:946167149971:web:49af0525a466d08f002466",
  measurementId: "G-678QS7K8BE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;