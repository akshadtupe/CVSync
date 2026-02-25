import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [resume, setResume] = useState(null);

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill all required fields");
      return;
    }

    if (role === "student" && !resume) {
      alert("Resume is required for students");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("role", role);

    if (role === "student") {
      formData.append("resume", resume);
    }

    try {
      await API.post("register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration successful");
      navigate("/");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <br /><br />

      {role === "student" && (
        <>
          <label>Upload Resume (PDF/DOCX)</label>
          <br />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <br /><br />
        </>
      )}

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;