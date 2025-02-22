import { useState } from "react";
import Login from "./components/Login";
import RepoList from "./components/RepoList";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!user ? <Login onLogin={setUser} /> : <RepoList user={user} />}
    </div>
  );
}

export default App;
