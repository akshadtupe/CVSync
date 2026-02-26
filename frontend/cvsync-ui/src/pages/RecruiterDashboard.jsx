import { useEffect, useState } from "react";
import API from "../api/axios";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");


  useEffect(() => {
    fetchMyJobs();
  }, []);

  const createJob = async () => {
  if (!title || !description) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await API.post("create-job/", {
      title: title,
      description: description,
    });

    setJobs([...jobs, response.data]);
    setTitle("");
    setDescription("");
    setError("");

  } catch (err) {
    if (err.response) {
      setError(err.response.data.error);
    } else {
      setError("Failed to create job");
    }
  }
};

  const fetchMyJobs = async () => {
    try {
      const response = await API.get("recruiter/jobs/");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs");
    }
  };

  const fetchRanking = async (jobId) => {
  console.log("Fetching ranking for job:", jobId);

  try {
    const response = await API.get(`job/${jobId}/ranking/`);
    console.log("Ranking response:", response.data);

    setSelectedJob(jobId);
    setRanking(response.data);

  } catch (err) {
    console.error("Ranking error:", err);
    setError("Failed to load ranking");
  }

  
};

const deleteJob = async (jobId) => {
  console.log("Deleting job:", jobId);

  try {
    const response = await API.delete(`job/${jobId}/delete/`);
    console.log("Delete response:", response);

    setJobs(jobs.filter((job) => job.id !== jobId));

  } catch (err) {
    console.error("Delete error:", err);
    setError("Failed to delete job");
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h2>Recruiter Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Create Job</h3>
      <input
      type="text"
      placeholder="Job Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <br /><br />

    <textarea
      placeholder="Job Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      cols={40}
    />
    <br /><br />

      <button onClick={createJob}>Create Job</button>

      <hr />

      <h3>Your Jobs</h3>

      {jobs.length === 0 && <p>No jobs created yet</p>}

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            cursor: "pointer",
          }}
          onClick={() => fetchRanking(job.id)}
        >
          
          <h4>{job.title}</h4>
          <p>{job.description}</p>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevents triggering ranking
              deleteJob(job.id);
            }}
            style={{ marginTop: "10px", background: "red", color: "white" }}
          >
            Delete Job
          </button>

        </div>

        
      ))}

      {selectedJob && (
        <>
          <h3>Ranking</h3>

          {ranking.length === 0 && <p>No applicants yet</p>}

          {ranking.map((app, index) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #aaa",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p><strong>Rank:</strong> #{index + 1}</p>
              <p><strong>Student:</strong> {app.student_name}</p>
              <p><strong>Score:</strong> {app.score}%</p>
              {/* <p><strong>Suggestions:</strong></p>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {app.suggestions}
              </pre> */}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default RecruiterDashboard;