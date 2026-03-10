import "./About.css";

function About() {
  return (
    <div className="about-container">

      <h1 className="about-title">About CVSync</h1>

      <p className="about-description">
        CVSync is a resume analysis platform that helps students
        match their resumes with job descriptions and helps recruiters
        rank candidates automatically.
      </p>

      <div className="about-steps">

        <h2>How to Use</h2>

        <div className="about-step">
          <strong>1.</strong> Register and upload your resume.
        </div>

        <div className="about-step">
          <strong>2.</strong> Browse available jobs.
        </div>

        <div className="about-step">
          <strong>3.</strong> Click "Apply & Analyze" to see how well your resume matches the job.
        </div>

        <div className="about-step">
          <strong>4.</strong> Recruiters can view ranked applicants.
        </div>

      </div>

    </div>
  );
}

export default About;