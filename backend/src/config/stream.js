import dotenv from "dotenv";
import path from "path";
import { StreamChat } from "stream-chat";
import { StreamClient } from  "@stream-io/node-sdk";
import { logger } from "../utils/logger.js";
import { asyncHandler } from "../utils/asyncHandler.js";
dotenv.config({ path: path.resolve(".env"), quiet: true });

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

if(!apiKey || !apiSecret) {
    logger.error("Stream api key or secret is missing!");
};

/**
 * Instance for Chat messaging
 */
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

/**
 * Instance for video calls
 */
export const streamClient = new StreamClient(apiKey, apiSecret);

/**
 * Create Stream User
 */
export const upsertStreamUser = asyncHandler( async (userData) => {
    await chatClient.upsertUser(userData);
    logger.info("Stream User added Successfully" + userData.id);
});

/**
 * Delete Stream User
 */
export const deleteStreamUser = asyncHandler( async(userId) => {
    await chatClient.deleteUser(userId);
    logger.info("Stream User deleted Successfully" + userId);
});