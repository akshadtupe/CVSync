import { useEffect, useState } from "react";
import API from "../api/axios";

function StudentDashboard() {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("jobs/");
      setJobs(response.data);
    } catch (error) {
      console.log("Error fetching jobs");
    }
  };

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post("upload-resume/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Resume uploaded");
  };

  const runAnalysis = async () => {
    const response = await API.post("run-analysis/", {
      resume_id: 1,   // temporarily hardcoded
      job_id: selectedJob,
    });

    setAnalysisResult(response.data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Student Dashboard</h2>

      <h3>Upload Resume</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadResume}>Upload</button>

      <h3>Select Job</h3>
      <select onChange={(e) => setSelectedJob(e.target.value)}>
        <option>Select Job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>

      <br /><br />
      <button onClick={runAnalysis}>Analyze</button>

      {analysisResult && (
        <div>
          <h3>Result</h3>
          <p>Score: {analysisResult.score}%</p>
          <p>Matched Skills: {analysisResult.matched_skills.join(", ")}</p>
          <p>Missing Skills: {analysisResult.missing_skills.join(", ")}</p>
          <p>Suggestions: {analysisResult.suggestions}</p>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;