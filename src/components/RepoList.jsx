import { useState, useEffect } from "react";
import axios from "axios";
import { saveRepoToDatabase } from "../helpers/firebase";


const RepoList = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get(`https://api.github.com/users/${user.displayName}/repos`);
        setRepos(res.data);
      } catch (error) {
        console.error("Error fetching repos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [user]);

  const handleSelectRepo = (repo) => {
    saveRepoToDatabase(user.uid, repo);
    alert(`Saved: ${repo.name}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select a Repository</h2>
      {loading ? (
        <p>Loading repositories...</p>
      ) : (
        <ul className="space-y-2">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="border p-2 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectRepo(repo)}
            >
              <span>{repo.name}</span>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RepoList;
