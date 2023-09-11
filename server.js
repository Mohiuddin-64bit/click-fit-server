const mysql = require("mysql");
const express = require("express");
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(bodyParser.json());

app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "password",
  database: "click_fit"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    throw err;
  }
  console.log("Connected to the database");
});

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

app.post("/register", (req, res) => {
  console.log("Received registration request:", req.body);

  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return res.status(400).json({ error: "All fields are required." });
  }

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

app.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = path.join(__dirname, req.file.path);
  res.json({ imageUrl });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
