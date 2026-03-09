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
    try {
      const response = await API.get(`job/${jobId}/ranking/`);
      setSelectedJob(jobId);
      setRanking(response.data);
    } catch (err) {
      setError("Failed to load ranking");
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await API.delete(`job/${jobId}/delete/`);
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Recruiter Dashboard
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create Job */}

      <div className="bg-white shadow-md rounded-xl p-6 mb-10 border">

        <h3 className="text-xl font-semibold mb-4">
          Create Job
        </h3>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={createJob}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Job
          </button>

        </div>

      </div>

      {/* Jobs */}

      <h3 className="text-xl font-semibold mb-4">
        Your Jobs
      </h3>

      {jobs.length === 0 && (
        <p className="text-gray-500">No jobs created yet</p>
      )}

      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition cursor-pointer"
            onClick={() => fetchRanking(job.id)}
          >

            <h4 className="text-lg font-semibold">
              {job.title}
            </h4>

            <p className="text-gray-600 mt-1">
              {job.description}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteJob(job.id);
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Job
            </button>

          </div>
        ))}

      </div>

      {/* Ranking Section (UNCHANGED LOGIC) */}

      {selectedJob && (
        <div className="mt-10">

          <h3 className="text-xl font-semibold mb-4">
            Ranking
          </h3>

          {ranking.length === 0 && (
            <p className="text-gray-500">No applicants yet</p>
          )}

          <div className="space-y-4">

            {ranking.map((app, index) => (
              <div
                key={app.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >

                <p><strong>Rank:</strong> #{index + 1}</p>
                <p><strong>Student:</strong> {app.student_name}</p>
                <p><strong>Score:</strong> {app.score}%</p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default RecruiterDashboard;