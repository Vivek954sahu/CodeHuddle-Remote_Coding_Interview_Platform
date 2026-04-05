import { StreamVideoClient } from "@stream-io/video-react-sdk";

 const apiKey = import.meta.env.VITE_STREAM_API_KEY;


let client = null;

export const initializeStreamClient = async (user, token) => {

    if (!token) throw new Error("Stream token is missing.");

    if (!user?.id) throw new Error("User ID is required for Stream.");

    if (client && client.user?.id === user._id) return client;

    if (client) {
        await disconnectStreamClient();
    };

    if (!apiKey) throw new Error("Stream API key is not provided.");

    client = new StreamVideoClient({
        apiKey,
        user,
        token,
    });

    return client;
};

export const disconnectStreamClient = async (client) => {
    if (client) {
        try {
            await client.disconnectUser();
            client = null;
        } catch (error) {
            console.error("Error disconnecting Stream client:", error);
        }
    }
};