import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

let isConnect = false;

// Connecting to MongoDb
export const connectToDB = async () => {

    if(isConnect){
        logger.warn("⚠️ MongoDb is already connected!");
        return;
    }

    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: process.env.NODE_ENV !== "production",
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,

            serverApi: {
                version: "1",
                strict: true,
                deprecationErrors: true,
            },
        });

        isConnect = true;

        logger.info(`MongoDB Atlas connected: ${conn.connection.host}`);

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected!");
            isConnect = false;
        });

        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB error", err);
        });

    } catch(error) {
        logger.error("MongoDB connection failed!", error);
        process.exit(1);
    }
};