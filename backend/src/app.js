import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { logger } from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* --------------------------------------------------------------------------------------------
    =====  Global Middlewares =====
----------------------------------------------------------------------------------------------*/

// security headers
app.use(helmet());

// enabling cors
app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5173"],
        credentials: true,
    })
);

// HTTP request logging
app.use(
    morgan("dev", {
        stream: {
            write: (message) => {
                logger.http(message.trim())
            },
        },
    })
);

/* --------------------------------------------------------------------------------------------
    =====  Health check =====
----------------------------------------------------------------------------------------------*/

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

/* --------------------------------------------------------------------------------------------
    =====  Routes =====
----------------------------------------------------------------------------------------------*/
/*  
app.use("/api/auth",authRoutes);
*/

/* --------------------------------------------------------------------------------------------
    =====  Route not found (404) =====
----------------------------------------------------------------------------------------------*/
app.use((req, res) => {
    res.status(200).json({
        success: true,
        message: "Resource Not Found",
    });
});

/* --------------------------------------------------------------------------------------------
    =====  Global Error Handler =====
----------------------------------------------------------------------------------------------*/
app.use(errorHandler);

export default app;

