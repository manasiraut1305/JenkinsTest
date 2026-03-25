const rateLimit = require('express-rate-limit');

// General limiter for public GET requests
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." }
});

// Stricter limiter for POST/PUT (Creation/Updates)
export const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 creations per hour
    message: { error: "Submission limit reached. Please wait an hour." }
});