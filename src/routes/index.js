/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Main API Routes
 * File: index.js
 *
 * Purpose:
 * Centralizes and mounts all API routes.
 *
 * Shared by all developers.
 */

import express from "express";
import mockRoutes from "../mock/mock-routes.js";

const router = express.Router();

/**
 * API Health Check
 * GET /api/health
 */
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Flatmate NG API is running successfully."
    });
});

// Mount temporary mock API routes.
router.use(mockRoutes);

export default router;