import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("Software Engineer"); // Job Role Dropdown
  const [location, setLocation] = useState("India");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [loading, setLoading] = useState(false);

  const jobRoles = ["Software Engineer", "Data Analyst", "Project Manager", "Product Manager", "UI/UX Designer", "Cyber Security Analyst", "DevOps Engineer", "AI/ML Engineer"];

  const allSkills = ["JavaScript", "Python", "React", "Node.js", "Django", "SQL", "MongoDB", "AWS", "GraphQL", "TypeScript", "Go", "Swift", "Kotlin", "Docker", "Flutter", "PHP"];
  const skillColors = ["#b57f2b", "#ff5733", "#3498db", "#27ae60", "#9b59b6", "#f39c12", "#e74c3c"];
  const randomColors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/jobs", {
        keywords: searchQuery.trim() || selectedJobRole, // Use selected job role
        location: location.trim() || "India",
      });
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedJobRole, location]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; 
  };

  const getRandomSkillColor = () => skillColors[Math.floor(Math.random() * skillColors.length)];
  const getRandomLPA = () => (Math.random() * (20 - 4) + 4).toFixed(1) + " LPA";
  const getRandomSkills = () => allSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3);
  const getRandomColor = () => randomColors[Math.floor(Math.random() * randomColors.length)];

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <h1 className="logo">KODJOBS</h1>

        {/* Profile Section */}
        <div className="profile-section" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          <span className="profile-text">Hello, {user?.username || "User"}!</span>
          <div className="profile-icon">
            {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
          </div>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button onClick={() => setShowAbout(true)}>👤 About</button>
              <button onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* User Info Modal */}
      {showAbout && user && (
        <div className="user-info-modal">
          <h3>User Info</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {calculateAge(user.dob)} years</p>
          <button className="close-btn" onClick={() => setShowAbout(false)}>Close</button>
        </div>
      )}

      {/* Search Bar & Dropdowns */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={fetchJobs}>🔍</button>

        {/* Job Role Dropdown */}
        <select className="job-role-dropdown" value={selectedJobRole} onChange={(e) => setSelectedJobRole(e.target.value)}>
          {jobRoles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>

        {/* Location Dropdown */}
        <select className="location-dropdown" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
        </select>
      </div>

      {/* Job Listings */}
      <div className="job-listings">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job, index) => (
            <div key={index} className="job-card" style={{ "--random-color": getRandomColor() }}>
              <div className="job-header">
                <div className="company-logo">
                  {job.company ? job.company.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h3>{job.company}</h3>
                  <p>📍 {job.location}</p>
                </div>
                <span className="salary">{job.salary || getRandomLPA()}</span>
              </div>

              <h4>{job.title}</h4>

              <div className="tags">
                {getRandomSkills().map((skill, i) => (
                  <span key={i} className="skill-tag" style={{ backgroundColor: getRandomSkillColor() }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="job-footer">
                <p>Status: ❌ Not Applied</p>
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="apply-btn">🚀 Apply Now</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
