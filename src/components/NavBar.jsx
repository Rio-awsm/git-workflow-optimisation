import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { loginWithGitHub } from "../firebase/auth";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleNavigation = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Delay to ensure the homepage loads first
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGitHub();
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login with GitHub. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-[#101311] text-white flex justify-between py-6 px-16">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        OPT/CI
      </div>
      <div className="flex justify-center space-x-10 text-lg font-semibold">
        <a href="/" className="opacity-40 cursor-pointer hover:opacity-80">
          Home
        </a>
        <a href="/dashboard" className="opacity-40 cursor-pointer hover:opacity-80"
        >
          Dashboard
        </a>
        <div
          onClick={() => handleNavigation("services")}
          className="opacity-40 cursor-pointer hover:opacity-80"
        >
          Services
        </div>
      </div>

      {!user ? (
        <div
          onClick={handleLogin}
          className="bg-[#D3FFCA] text-md font-bold text-black rounded-2xl px-4 py-2 cursor-pointer"
        >
          Analyze Now
        </div>
      ) : (
        <div
          onClick={handleLogout}
          className="bg-red-500 text-md font-bold text-black rounded-2xl px-4 py-2 cursor-pointer"
        >
          Logout
        </div>
      )}
    </div>
  );
};

export default NavBar;
