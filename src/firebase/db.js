import { ref, set } from "firebase/database";
import { database } from "./config";

export const saveRepoToDatabase = async (userId, repo) => {
  try {
    // Extract repo name from the URL by removing 'https://github.com/'
    const repoName = repo.html_url.replace('https://github.com/', '');
    
    // Extract owner name (everything after github.com/ and before the next /)
    const ownerName = repoName.split('/')[0];

    await set(ref(database, `users`), {
      id: repo.id,
      repo_name: repoName,
      owner_name: ownerName,
      url: repo.html_url,
      description: repo.description,
      private: repo.private,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    throw error;
  }
};