import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import cookieParser from "cookie-parser";
import { serve } from "inngest/express";

import { logger } from "./utils/logger.js";
import { globalErrHandler } from "./middlewares/error.middleware.js";
import { responseMiddleware } from "./utils/ApiResponse.js";
import { inngest, functions } from "./config/inngest.js";

import authRoutes from "./modules/auth/auth.routes.js";
import interviewRoutes from "./modules/interviews/interview.routes.js";
import problemRoutes from "./modules/problems/problem.routes.js";

const app = express();

const __dirname = path.resolve();

/* --------------------------------------------------------------------------------------------
    =====  Global Middlewares =====
----------------------------------------------------------------------------------------------*/

// security headers{}
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc : ["'self'"],

        connectSrc: ["'self'", "https:", "wss:"]
    },
}));

// enabling cors
app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    })
);

// JSON body parser
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

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

// cookie parser
app.use(cookieParser());

// initiate passport
app.use(passport.initialize());

// Response Middleware
app.use(responseMiddleware);

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
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/interviews", interviewRoutes);
app.use("/api/v1/problems", problemRoutes);

/**
 * ---------------------------------------------------------------------------------------------
 *                          Make ready for deployment
 * ---------------------------------------------------------------------------------------------
 */
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        console.log(__dirname)
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
};

/* --------------------------------------------------------------------------------------------
    =====  Route not found (404) =====
----------------------------------------------------------------------------------------------*/
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route not found",
    });
});

/* --------------------------------------------------------------------------------------------
    =====  Global Error Handler =====
----------------------------------------------------------------------------------------------*/
app.use(globalErrHandler);

export default app;

