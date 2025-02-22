import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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
const auth = getAuth(app);
const provider = new GithubAuthProvider();
const database = getDatabase(app);

const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(error);
  }
};

const logout = () => {
  signOut(auth);
};

const saveRepoToDatabase = (userId, repo) => {
  set(ref(database, `users/${userId}/selectedRepo`), {
    name: repo.name,
    url: repo.html_url,
  });
};

export { auth, loginWithGitHub, logout, saveRepoToDatabase };
