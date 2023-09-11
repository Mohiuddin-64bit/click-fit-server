const mysql = require("mysql");
const express = require("express");
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();
// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Define your routes and API endpoints here
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "click_fit",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    throw err;
  }
  console.log("Connected to the database");
});

// Define your routes and API endpoints here
app.get("/", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.sendStatus(500);
    }
    res.send(result);
  });
});

// Import necessary modules and establish database connection as previously shown

// Define a route for user registration
app.post("/register", (req, res) => {
  console.log("Received registration request:", req.body);

  // Extract user details from the request body
  const { email, password, type } = req.body;

  // Check if email, password, and type are provided
  if (!email || !password || !type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Insert user data into the "users" table
  const addUserQuery = `
      INSERT INTO users (email, password, type)
      VALUES (?, ?, ?)
  `;

  db.query(addUserQuery, [email, password, type], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("User registered successfully", result);
    return res.status(200).json({ message: "User registered successfully" });
  });
});

// Rest of your server setup and routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
