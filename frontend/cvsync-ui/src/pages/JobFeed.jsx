import { useEffect, useState } from "react";
import API from "../api/axios";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingJob, setLoadingJob] = useState(null);

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
      const jobIds = response.data.map((app) => app.job_id);
      setAppliedJobs(jobIds);
    } catch (error) {
      console.log("Failed to fetch applications");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      setLoadingJob(jobId);

      const response = await API.post("run-analysis/", {
        job_id: jobId,
      });

      setAnalysisResult(response.data);

      setAppliedJobs((prev) => [...prev, jobId]);

      setErrorMessage("");

    } catch (error) {
      setAnalysisResult(null);

      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Server error");
      }
    } finally {
      setLoadingJob(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Job Opportunities
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* LEFT SIDE — JOB LIST */}

        <div className="col-span-2 space-y-6">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
            >

              <div className="flex justify-between items-center mb-2">

                <h2 className="text-xl font-semibold text-gray-800">
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

              <button
                disabled={appliedJobs.includes(job.id) || loadingJob === job.id}
                onClick={() => applyToJob(job.id)}
                className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                  appliedJobs.includes(job.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingJob === job.id
                  ? "Analyzing..."
                  : appliedJobs.includes(job.id)
                  ? "Already Applied"
                  : "Apply & Analyze"}
              </button>

            </div>

          ))}

        </div>

        {/* RIGHT SIDE — ANALYSIS PANEL */}

        <div className="bg-white shadow-md rounded-xl p-6 border h-fit sticky top-24">

          <h2 className="text-xl font-semibold mb-4">
            Analysis Result
          </h2>

          {!analysisResult && (
            <p className="text-gray-500">
              Click "Apply & Analyze" on a job to see your resume match score.
            </p>
          )}

          {analysisResult && (
            <>
              <p className="font-medium mb-2">
                Match Score: {analysisResult.score}%
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${analysisResult.score}%` }}
                ></div>
              </div>

              <div className="whitespace-pre-wrap text-gray-700">
                {analysisResult.suggestions}
              </div>
            </>
          )}

          {errorMessage && (
            <p className="text-red-500 mt-4">
              {errorMessage}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default JobFeed;