import React, { useEffect, useState } from 'react'
import { disconnectStreamClient, initializeStreamClient } from '../lib/stream';
import { getStreamToken } from '../api/interviewsApi';
import { StreamChat } from "stream-chat";
import { useAuth } from '../context/AuthContext';

const useStreamClient = (interview, loadingInterview) => {

    const { user } = useAuth();
    const [streamClient, setStreamClient] = useState(null);
    const [call, setCall] = useState(null);
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isInitializingCall, setIsInitializingCall] = useState(true);

    useEffect(() => {
      let videoCall = null;
      let chatClientInstance = null;

      const initCall = async () => {
        if(!interview?.callId) return;
        if(["COMPLETED","EXPIRED", "CANCELLED"].includes(interview.status)) return;

        try {
            // Fetch Stream token from backend
            const tokenRes = await getStreamToken();
            const token = tokenRes.data.data;

            // Initialize video client
            const client = await initializeStreamClient({id : user.id}, token);
            setStreamClient(client);

            // Joining video call
            videoCall = client.call("default", interview.callId);
            await videoCall.join({ create: true });
            setCall(videoCall);

            // Chat instance
            const apiKey = import.meta.env.VITE_STREAM_API_KEY;
            chatClientInstance = StreamChat.getInstance(apiKey);

            await chatClientInstance.connectUser({ id: user.id }, token);
            setChatClient(chatClientInstance);

            const chatChannel = chatClientInstance.channel("messaging", interview.callId);
            await chatChannel.watch();
            setChannel(chatChannel);

        } catch (error) {
            console.error("failed to init call", error);
        } finally {
            setIsInitializingCall(false);
        };
    };

        if(interview && !loadingInterview) initCall();

        return () => {
            (async () => {
                try {
                    if(videoCall) await videoCall.leave();
                if(chatClientInstance) await chatClientInstance.disconnectUser();

                await disconnectStreamClient();
                } catch (error) {
                    console.log("cleanUp error: ", error);
                }
            })();
        };
    }, [interview, loadingInterview]);
    

  return { streamClient, chatClient, call, channel, isInitializingCall };
}

export default useStreamClient
