import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import JobFeed from "./pages/JobFeed";  


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
  path="/student"
  element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter"
  element={
    <ProtectedRoute role="recruiter">
      <RecruiterDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-feed"
  element={
    <ProtectedRoute role="student">
      <JobFeed />
    </ProtectedRoute>
  }
/>

<Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;