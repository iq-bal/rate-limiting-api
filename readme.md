# **Rate Limiting with Express and `express-rate-limit`**

This documentation covers the **concept of rate limiting**, explains how to implement it with Express using the `express-rate-limit` package, and provides practical examples based on the provided code.

---

## **What is Rate Limiting?**

Rate limiting is a technique used to control the number of requests a client (user or IP) can make to a server in a specific time window. This helps:

- **Prevent abuse or spam** (e.g., brute-force attacks).
- **Optimize server performance** by limiting the load.
- **Enhance security** by preventing excessive login attempts.

### **How Rate Limiting Works**

1. **Window-based**: Limits requests in a defined time period (e.g., 5 requests every 15 minutes).
2. **IP-based limits**: Tracks and enforces limits based on the user's IP address.
3. **Status code**: Once a user exceeds the limit, they receive a `429 Too Many Requests` response.

---

## **Setup for Express with `express-rate-limit`**

The `express-rate-limit` middleware allows you to easily set rate limits for all routes or specific routes.

### **Installation**

```bash
npm install express express-rate-limit
```

---

## **Basic Example Code**

Below is an example of how to **limit requests globally** or **for specific routes**, like the login endpoint.

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiter: 5 requests per 15 minutes for all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.", // Optional: Custom message
});

// Apply rate limiter to all routes (commented out for demonstration)
// app.use(limiter);

// Apply rate limiter to a specific route group (e.g., /api)
app.use("/api", limiter); // All routes under /api will be limited

// Login route with its own rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit login attempts to 5
  message: "Too many login requests", // Custom message for login
});

// Example routes
app.get("/", (req, res) => {
  res.json("Hello World");
});

// Login route using the custom login rate limiter
app.get("/login", loginLimiter, (req, res) => {
  res.json("Imaginary login form");
});

// Server listening on port 3004
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
```

---

## **Key Concepts of Rate Limiting**

1. **`windowMs`**

   - Defines the **time window** for counting requests (in milliseconds).
   - Example: `15 * 60 * 1000` = 15 minutes.

2. **`max`**

   - Sets the **maximum number of requests** allowed from a single IP within the `windowMs` period.
   - Example: `max: 5` limits each user to 5 requests.

3. **`message`** (Optional)

   - Custom message returned when the limit is exceeded.
   - Default: `"Too many requests, please try again later."`

4. **Middleware Usage**

   - You can apply rate limiting to:
     - **All routes**: `app.use(limiter)`
     - **Specific routes/groups**: `app.use("/api", limiter)`
     - **Individual routes**: `app.get("/login", loginLimiter, ...)`

5. **`express-rate-limit` Return Behavior**
   - When a user exceeds the allowed requests, they receive:
     - **Status code**: `429 Too Many Requests`
     - **JSON response**: `{ "message": "Too many requests, please try again later." }`

---

## **Use Cases of Rate Limiting**

1. **Global Limiting**

   - Use case: Prevent overloading the server from any user or bot.
   - Example: Apply `app.use(limiter)` to all routes.

2. **API Rate Limiting**

   - Use case: Control access to sensitive API routes.
   - Example: `app.use("/api", limiter)`

3. **Login Route Limiting**
   - Use case: Prevent brute-force login attacks.
   - Example: `app.get("/login", loginLimiter, ...)`

---

## **How to Test the Rate Limiter?**

1. Start the server:

   ```bash
   node index.js
   ```

2. Access the routes:

   - Visit `http://localhost:3004/` – Allowed 5 times within 15 minutes.
   - Visit `http://localhost:3004/login` – Allowed 5 times with its custom limiter.

3. After exceeding the limit, you’ll see a response like:
   ```json
   {
     "message": "Too many requests, please try again later."
   }
   ```

---

## **Tips for Using Rate Limiting Effectively**

- **Separate rate limits for critical routes** (e.g., login).
- Use **global limits** to prevent denial-of-service (DoS) attacks.
- Adjust the `windowMs` and `max` values based on expected traffic.
- Add **custom error messages** to improve user experience.

---

## **Conclusion**

Using `express-rate-limit` helps protect your Express application by limiting the number of requests users can make. You can apply it globally, to specific groups of routes, or to individual endpoints, such as a login form, to enhance security and prevent abuse.
