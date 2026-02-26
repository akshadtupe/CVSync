import { useEffect, useState } from "react";
import API from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const response = await API.get("profile/");
    setProfile(response.data);
  };

  const updateResume = async () => {
    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.put("update-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Resume updated");
      fetchProfile();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Profile</h2>

      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      {profile.role === "student" && (
        <>
          <p>
            <strong>Resume:</strong>{" "}
            {profile.resume ? (
              <a href={`http://127.0.0.1:8000${profile.resume}`} target="_blank">
                View Resume
              </a>
            ) : (
              "No resume uploaded"
            )}
          </p>

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={updateResume}>Update Resume</button>
        </>
      )}
    </div>
  );
}

export default Profile;