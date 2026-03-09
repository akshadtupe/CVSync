import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold tracking-wide cursor-pointer"
          onClick={() => navigate("/")}>
        CVSync
      </h1>

      <div className="space-x-6 flex items-center">
        {role === "student" && (
          <>
            <button onClick={() => navigate("/job-feed")} className="hover:text-blue-400">
              Jobs
            </button>
            <button onClick={() => navigate("/my-applications")} className="hover:text-blue-400">
              Applications
            </button>
            <button onClick={() => navigate("/profile")} className="hover:text-blue-400">
              Profile
            </button>
          </>
        )}

        {role === "recruiter" && (
          <>
            <button onClick={() => navigate("/recruiter")} className="hover:text-blue-400">
              Dashboard
            </button>
            <button onClick={() => navigate("/profile")} className="hover:text-blue-400">
              Profile
            </button>
          </>
        )}

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;