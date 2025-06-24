import React from "react";
import "./Profile.css";

const Profile = ({ user }) => {
  if (!user) return <p>User not found.</p>;

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "N/A"; // Handle missing DOB case
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust if birthday hasn't occurred yet this year
    }

    return age;
  };

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {calculateAge(user.dob)}</p>
    </div>
  );
};

export default Profile;
