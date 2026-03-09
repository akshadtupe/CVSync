import { useEffect, useState } from "react";
import API from "../api/axios";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("jobs/");
      setJobs(response.data);
    } catch (error) {
      console.log("Failed to fetch jobs");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await API.get("my-applications/");
      const jobIds = response.data.map(app => app.job_id);
      setAppliedJobs(jobIds);
    } catch (error) {
      console.log("Failed to fetch applications");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      const response = await API.post("run-analysis/", {
        job_id: jobId,
      });

      setAnalysisResult(response.data);
      setAppliedJobs([...appliedJobs, jobId]);
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
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Job Opportunities
      </h1>

      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
          >

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              {appliedJobs.includes(job.id) && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  Applied
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              {job.description}
            </p>

            <div className="flex justify-end">

              <button
                disabled={appliedJobs.includes(job.id)}
                onClick={() => applyToJob(job.id)}
                className={`px-5 py-2 rounded-lg text-white font-medium ${
                  appliedJobs.includes(job.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {appliedJobs.includes(job.id)
                  ? "Already Applied"
                  : "Apply & Analyze"}
              </button>

            </div>

          </div>
        ))}

      </div>

      {analysisResult && (
        <div className="mt-8 bg-green-50 border border-green-300 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Analysis Result</h2>
          <p className="mb-2">
            <strong>Score:</strong> {analysisResult.score}%
          </p>
          <div className="whitespace-pre-wrap text-gray-700">
            {analysisResult.suggestions}
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}

    </div>
  );
}

export default JobFeed;