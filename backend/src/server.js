import { loadEnv } from "./config/env.js";
// Loading environment variables
loadEnv();

import{ initPassport } from  "./config/passport.js";
initPassport();

import http from "http";
import app from "./app.js";
import { connectToDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

 

// Create HTTP server
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// starting server
const startServer = async () => {
    try{
        await connectToDB();

        // if db connected
        server.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        // failed to connect db then
        logger.error("❌ Failed to start server!", error);

        process.exit(1);
    };
};

startServer();