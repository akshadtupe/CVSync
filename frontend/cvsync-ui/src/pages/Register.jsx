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
    <div className="min-h-dvh flex items-center justify-center bg-gray-100 px-4">

  <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      Register
    </h2>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
    />

    <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full border rounded-lg px-4 py-2 mb-4 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="student">Student</option>
      <option value="recruiter">Recruiter</option>
    </select>

    {role === "student" && (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload Resume (PDF/DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full"
        />
      </div>
    )}

    <button
      onClick={handleRegister}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Register
    </button>

  </div>

</div>

    
  );
}

export default Register;