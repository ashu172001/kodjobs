const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios"); // ✅ Import Axios


const app = express();
app.use(cors());
app.use(bodyParser.json());

let lastRequestTime = 0; // Declare globally to track last API call time


const path = require("path");

const USERS_FILE = path.join(__dirname, "user.json");

// Function to load users from file
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return data ? JSON.parse(data) : [];
};

// Function to save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Function to calculate age from DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--; // Adjust if birthday hasn't occurred this year yet
  }

  return age;
};

app.post("/register", (req, res) => {
  const { username, email, password, dob } = req.body;

  if (!username || !email || !password || !dob) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let users = loadUsers();

  // Ensure the last user has a valid ID before incrementing
  const lastUser = users.length > 0 ? users[users.length - 1] : null;
  const newId = lastUser && lastUser.id ? lastUser.id + 1 : 1;

  const age = calculateAge(dob);
  const newUser = { id: newId, username, email, password, dob, age };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User registered successfully", user: newUser });
});



// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

const JOOBLE_API_KEY = "b9f9299b-e9b4-4a08-82ca-13009912eee0"; // Your Jooble API key


app.post("/jobs", async (req, res) => {
    const { keywords, location } = req.body; // Get search keywords & location from frontend

    try {
        const response = await axios.post(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
            keywords: keywords || "developer", // Default to "developer" if empty
            location: location || "India", // Default to India
        });

        res.json(response.data.jobs); // Send jobs to frontend
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ error: "Failed to fetch job listings" });
    }
});
  
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  

