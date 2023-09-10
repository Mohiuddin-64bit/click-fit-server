const mysql = require("mysql");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

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
      console.error('Database query error:', err);
      return res.sendStatus(500);
    }
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
