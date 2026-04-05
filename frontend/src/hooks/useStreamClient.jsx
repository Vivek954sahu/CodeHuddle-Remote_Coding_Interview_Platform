import React, { useEffect, useRef, useState } from 'react'
import { disconnectStreamClient, initializeStreamClient } from '../lib/stream';
import { getStreamToken } from '../api/interviewsApi';
import { StreamChat } from "stream-chat";
import { useAuth } from '../context/AuthContext';

const useStreamClient = (interview, loadingInterview, isCandidate, isInterviewer) => {

    const { user } = useAuth();

    const [streamClient, setStreamClient] = useState(null);
    const [call, setCall] = useState(null);
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isInitializingCall, setIsInitializingCall] = useState(true);

    const videoCallRef = useRef(null);
    const chatClientRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
    //   let videoCall = null;
    //   let chatClientInstance = null;

      const initCall = async () => {
        if(!interview?.callId || !user?._id) {
          console.log('Missing interview.callId or user._id');
          return;
        }
        if(["COMPLETED","EXPIRED", "CANCELLED"].includes(interview.status)) {
          console.log('Interview status prevents initialization');
          return;
        }

        if(!isCandidate && !isInterviewer) return;
        
        if(initializedRef.current) {
          return;
        }

        try {

            // Fetch Stream token from backend
            const tokenRes = await getStreamToken();
            const token = tokenRes?.data?.data;

            if (!token) throw new Error("Invalid or Missing Stream token");

            // Initialize video client
            const client = await initializeStreamClient({id : user._id, name: user.name}, token);
            setStreamClient(client);

            // Joining video call
            const videoCall = client.call("default", interview.callId);
            await videoCall.join({ create: true });

            videoCallRef.current = videoCall;
            setCall(videoCallRef.current);

            // Chat instance
            const apiKey = import.meta.env.VITE_STREAM_API_KEY;
            // const apiKey = '';

            const chatClientInstance = StreamChat.getInstance(apiKey);

            await chatClientInstance.connectUser({ id: user._id, name: user.name }, token);

            chatClientRef.current = chatClientInstance;
            setChatClient(chatClientRef.current);

            const chatChannel = chatClientInstance.channel("messaging", interview.callId);
            await chatChannel.watch();

            setChannel(chatChannel);
            initializedRef.current = true;

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
                    if(videoCallRef.current) {
                         await videoCallRef.current.leave();
                         videoCallRef.current = null;
                    }
                    if(chatClientRef.current) {
                        await chatClientRef.current.disconnectUser();
                        chatClientRef.current = null;
                    }

                await disconnectStreamClient();
                initializedRef.current = false; // Reset initialization flag

                } catch (error) {
                    console.log("cleanUp error: ", error);
                }
            })();
        };
    }, [interview, loadingInterview, user]);
    

  return { streamClient, chatClient, call, channel, isInitializingCall };
}

export default useStreamClient
