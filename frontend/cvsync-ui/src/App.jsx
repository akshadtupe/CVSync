import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import JobFeed from "./pages/JobFeed";  
import MyApplications from "./pages/MyApplication";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
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

<Route path="/my-applications" element={<MyApplications/>} />

<Route path="/profile" element={<Profile/>} />


</Routes>
    </BrowserRouter>

  );
}

export default App;