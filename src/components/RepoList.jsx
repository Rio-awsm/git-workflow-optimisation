import { useState, useEffect } from "react";
import axios from "axios";
import { saveRepoToDatabase } from "../firebase/db";
import { FaCodeBranch, FaStar } from "react-icons/fa6";

const RepoList = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const githubProvider = user.providerData.find(
          (provider) => provider.providerId === "github.com"
        );

        if (!githubProvider) {
          throw new Error("No GitHub authentication found");
        }

        const credential = user.reloadUserInfo?.providerUserInfo?.find(
          (provider) => provider.providerId === "github.com"
        );

        if (!credential) {
          throw new Error("No GitHub credentials found");
        }

        const res = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            sort: "updated",
            per_page: 100,
            type: "owner",
            affiliation: "owner,collaborator",
          },
        });

        setRepos(res.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
        try {
          const username =
            user.reloadUserInfo?.screenName || user.providerData[0]?.uid;

          if (username) {
            const res = await axios.get(
              `https://api.github.com/users/${username}/repos`,
              {
                params: {
                  sort: "updated",
                  per_page: 100,
                  type: "public",
                },
              }
            );
            setRepos(res.data);
            setError(null);
          } else {
            setError("Could not find GitHub username");
          }
        } catch (fallbackError) {
          setError(
            "Failed to load repositories. Please try logging out and back in."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [user]);

  const handleSelectRepo = async (repo) => {
    try {
      setSelectedRepo(repo.id);
      await saveRepoToDatabase(user.uid, repo);
      alert(`Successfully saved repository: ${repo.name}`);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error saving repo:", error);
      alert(`Error saving repository: ${error.message}`);
    } finally {
      setSelectedRepo(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#101311] flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D3FFCA]"></div>
        <p className="mt-4 text-[#D3FFCA] opacity-40">
          Loading repositories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Error loading repositories</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
          <a
            href="https://github.com/settings/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Check GitHub Permissions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101311] text-white">
      <div className="p-8 border-b border-[#232B23]">
        <div className="bg-[#232B23] text-[#D3FFCA] rounded-2xl w-[200px] text-center py-3 mb-6">
          Your Repositories
        </div>
        <div className="text-4xl mb-4">
          Select a repository to{" "}
          <span className="text-[#D3FFCA]">optimize</span>
        </div>
        <p className="opacity-40">
          Choose from your GitHub repositories to begin optimization
        </p>
      </div>

      {repos.length === 0 ? (
        <div className="p-16 text-center">
          <FaStar className="text-4xl text-[#D3FFCA] mx-auto mb-4" />
          <p className="opacity-40 mb-4">No repositories found</p>
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D3FFCA] text-[#101311] px-6 py-3 rounded-2xl font-bold inline-block"
          >
            Create Repository
          </a>
        </div>
      ) : (
        <div className="divide-y divide-[#232B23]">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="p-8 hover:bg-[#232B23] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-medium">{repo.name}</h3>
                    {repo.private && (
                      <span className="bg-[#232B23] text-[#D3FFCA] px-4 py-1 rounded-full text-sm">
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="opacity-40 mb-4">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm opacity-40">
                    <span className="flex items-center gap-2">
                      <FaStar /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCodeBranch /> {repo.forks_count}
                    </span>
                    <span>
                      Updated: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selectedRepo === repo.id ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D3FFCA]"></div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSelectRepo(repo)}
                        className="bg-[#D3FFCA] text-[#101311] px-6 py-3 rounded-2xl font-bold cursor-pointer"
                      >
                        Select Repository
                      </button>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border cursor-pointer border-[#232B23] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#232B23] transition-colors"
                      >
                        View →
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoList;
