const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiter: 5 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.", // Optional: Custom message
});

// Apply rate limiter to all routes
// app.use(limiter);

//apply rate limiter to specific routes, any routes after api/ will be limited
// app.use("/api", limiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login requests", // Optional: Custom message
});

app.get("/", (req, res) => {
  res.json("Hello World");
});

// we can use rate limit as a middleware also
app.get("/login", loginLimiter, (req, res) => {
  res.json("Imaginary login form");
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // Fixed console.log
});
