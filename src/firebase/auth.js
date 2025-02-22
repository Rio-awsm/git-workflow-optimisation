import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./config";

export const loginWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    // Add required scopes for repository access
    provider.addScope('repo');
    provider.addScope('read:user');
    
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("GitHub login error:", error);
    throw error;
  }
};