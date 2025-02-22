
import { useState } from "react";
import { loginWithGitHub } from "../helpers/firebase";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const user = await loginWithGitHub();
    if (user) {
      onLogin(user);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login with GitHub"}
      </button>
    </div>
  );
};

export default Login;
