/**
 * Environment Configuration
 *
 * Purpose:
 * Centralizes environment variables used throughout
 * the Flatmate NG backend.
 */

import "dotenv/config";

export const env = {
    port: Number(process.env.PORT) || 3000,

    nodeEnv: process.env.NODE_ENV || "development",

    isProduction: process.env.NODE_ENV === "production",

    database: {
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        name: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
};