import { useEffect, useState } from "react";
import API from "../api/axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get("my_applications/");
      setApplications(response.data);
    } catch (err) {
      console.log("Failed to load applications");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Applications</h2>

      {applications.length === 0 && <p>No applications yet.</p>}

      {applications.map((app, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <h4>{app.job_title}</h4>
          <p><strong>Score:</strong> {app.score}%</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {app.suggestions}
          </pre>
        </div>
      ))}
    </div>
  );
}

export default MyApplications;