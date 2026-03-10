import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow">

      <div className="w-full flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          CVSync
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm">

          {role === "student" && (
            <>
              <button
                onClick={() => navigate("/job-feed")}
                className="hover:text-blue-400 transition"
              >
                Jobs
              </button>

              <button
                onClick={() => navigate("/my-applications")}
                className="hover:text-blue-400 transition"
              >
                Applications
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="hover:text-blue-400 transition"
              >
                Profile
              </button>
            </>
          )}

          {role === "recruiter" && (
            <>
              <button
                onClick={() => navigate("/recruiter")}
                className="hover:text-blue-400 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="hover:text-blue-400 transition"
              >
                Profile
              </button>
            </>
          )}

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/about")}
            className="hover:text-blue-400 transition"
          >
            About
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;