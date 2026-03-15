import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import JobFeed from "./pages/JobFeed";
import MyApplications from "./pages/MyApplication";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Landing from "./pages/LandingPage";

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />   
    </BrowserRouter>
  );
}

export default App;