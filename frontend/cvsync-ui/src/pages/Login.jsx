import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {jwtDecode} from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("token/", {
        username,
        password,
      });

      const tokens = response.data;

      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);

      const decoded = jwtDecode(tokens.access);
      const role = decoded.role;

      localStorage.setItem("role", role);

      if (role === "student") {
        navigate("/job-feed");
      } else {
        navigate("/recruiter");
      }

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">

    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        CVSync Login
      </h2>

      {/* Username */}

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Password */}

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Login Button */}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Login
      </button>

      {/* Register */}

      <p className="text-center text-sm text-gray-600 mt-4">
        New user?{" "}
        <a
          href="/register"
        >
          Register here
        </a>
      </p>

    </div>

  </div>
);
}

export default Login;