import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import apiRoutes from "./routes/index.js";

const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * Cross-Origin Resource Sharing
 */
app.use(cors());

/**
 * Request body parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * General API rate limiter
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", limiter);

/**
 * Central API routes
 */
app.use("/api", apiRoutes);

export default app;