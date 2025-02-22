import { ref, set } from "firebase/database";
import { database } from "./config";

export const saveRepoToDatabase = async (userId, repo) => {
  try {
    await set(ref(database, `users/${userId}/selectedRepo`), {
      id: repo.id,
      name: repo.name,
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