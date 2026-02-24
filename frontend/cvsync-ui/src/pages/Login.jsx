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
        navigate("/student");
      } else {
        navigate("/recruiter");
      }

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>CVSync Login</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
      <p>
        New user? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;