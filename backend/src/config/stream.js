import { StreamChat } from "stream-chat";
import { StreamClient } from  "@stream-io/node-sdk";
import { logger } from "../utils/logger";

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