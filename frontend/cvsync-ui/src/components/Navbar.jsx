import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#222",
      color: "white"
    }}>
      <div>
        <strong>CVSync</strong>
      </div>

      <div>
        {role === "student" && (
          <>
            <button onClick={() => navigate("/job-feed")}>Jobs</button>
            <button onClick={() => navigate("/my-applications")}>
              My Applications
            </button>
            <button onClick={() => navigate("/profile")}> Profile</button>        
          </>
        )}

        {role === "recruiter" && (
          <>
            <button onClick={() => navigate("/recruiter")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/profile")}> Profile</button>  
          </>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;