import { useEffect, useState } from "react";
import API from "../api/axios";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const response = await API.get("jobs/");
    setJobs(response.data);
  };

  const applyToJob = async (jobId) => {
  try {
    const response = await API.post("run-analysis/", {
      job_id: jobId,
    });

    setAnalysisResult(response.data);
    setErrorMessage("");

  } catch (error) {
    setAnalysisResult(null);

    if (error.response) {
      setErrorMessage(error.response.data.error);
    } else {
      setErrorMessage("Server error");
    }
  }
};

  return (
  <div style={{ padding: "30px" }}>
    <h2>Job Feed</h2>

    {errorMessage && (
      <p style={{ color: "red" }}>{errorMessage}</p>
    )}

    {analysisResult && (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #aaa",
        }}
      >
        <h3>Analysis Result</h3>
        <p><strong>Score:</strong> {analysisResult.score}%</p>
        <p><strong>Suggestions:</strong></p>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {analysisResult.suggestions}
        </pre>
      </div>
    )}

    {jobs.map((job) => (
      <div
        key={job.id}
        style={{
          border: "1px solid #ccc",
          marginBottom: "20px",
          padding: "15px",
        }}
      >
        <h3>{job.title}</h3>
        <p>{job.description}</p>
        <button onClick={() => applyToJob(job.id)}>
          Apply & Analyze
        </button>
      </div>
    ))}
  </div>
);

}

export default JobFeed;