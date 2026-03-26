import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getDifficultyBadgeClass } from "../../lib/utils";
import { useJoinInterview } from "../../hooks/useJoinInterview";
import { useEndInterview } from "../../hooks/useEndInterview";
import useInterviewById from "../../hooks/useInterviewById";
import { LuLoaderCircle, LuLogOut, LuPhoneOff } from "react-icons/lu";
import {
  StreamCall,
  StreamTheme,
  StreamVideo,
} from "@stream-io/video-react-sdk";
import VideoCallUI from "../../components/interviewRoom/VideoCallUI";
import CodeEditor from "../../components/interviewRoom/CodeEditor";
import OutputPanel from "../../components/interviewRoom/OutputPanel";
import { useAuth } from "../../context/AuthContext";
import useStreamClient from "../../hooks/useStreamClient";

const InterviewRoom = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { interview, loading, refetch } = useInterviewById(id);

  const { joinSession, loading: joining } = useJoinInterview();
  const { endSession, loading: ending } = useEndInterview();

  const { streamClient, call, chatClient, channel, isInitializingCall } =
    useStreamClient(interview, loading);

  // host participant

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  /* ---------------- AUTO JOIN ---------------- */
  useEffect(() => {
    if (!interview || loading) return;
    // if (isHost || isParticipant) return;

    joinSession(id);
  }, [interview, loading]);

  /* ---------------- REDIRECT ON END ---------------- */
  useEffect(() => {
    if (interview?.status === "COMPLETED") {
      navigate(
        user.role === "candidate"
          ? "/candidate/dashboard"
          : "/interviewer/dashboard",
      );
    }
  }, [interview]);

  /* ---------------- CODE RUN ---------------- */
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);

    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("End session?")) {
      endSession(id);
      navigate("/interviewer/dashboard");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen flex flex-col bg-base-100">
      {/* <Navbar /> */}

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col border-r">
          {/* PROBLEM SECTION */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-200">
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {interview?.problem?.title || "Loading..."}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                {/* <span
                  className={`badge ${getDifficultyBadgeClass(session?.difficulty)}`}
                >
                  {?.difficulty}
                </span> */}

                {user.role === "interviewer" && (
                  <button
                    onClick={handleEndSession}
                    className="btn btn-error btn-sm gap-2"
                  >
                    {ending ? (
                      <LuLoaderCircle className="animate-spin w-4 h-4" />
                    ) : (
                      <LuLogOut className="w-4 h-4" />
                    )}
                    End
                  </button>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-base-100 p-4 rounded-lg mb-4">
              <h2 className="font-bold mb-2">Description</h2>
              <p>{interview?.problem?.description}</p>
            </div>

            {/* EXAMPLES */}
            <div className="bg-base-100 p-4 rounded-lg mb-4">
              <h2 className="font-bold mb-2">Examples</h2>

              {interview?.problem?.samples?.map((ex, i) => (
                <div key={i} className="mb-3 bg-base-200 p-3 rounded">
                  <div>
                    <b>Input:</b> {ex.input}
                  </div>
                  <div>
                    <b>Output:</b> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="text-sm text-gray-500">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* TEST CASES */}
            <div className="bg-base-100 p-4 rounded-lg">
              <h2 className="font-bold mb-2">Test Cases</h2>

              {interview?.problem?.testcases
                ?.filter((tc) => !tc.isHidden)
                .map((tc, i) => (
                  <div key={i} className="mb-2 text-sm">
                    <div>
                      <b>Input:</b> {tc.input}
                    </div>
                    <div>
                      <b>Expected:</b> {tc.expectedOutput}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="h-[50%] flex flex-col border-t">
            <CodeEditor
              selectedLanguage={selectedLanguage}
              code={code}
              isRunning={isRunning}
              onLanguageChange={(e) => setSelectedLanguage(e.target.value)}
              onCodeChange={setCode}
              onRunCode={handleRunCode}
            />

            <OutputPanel output={output} />
          </div>
        </div>

        {/* RIGHT SIDE (VIDEO / CHAT) */}
        <div className="w-1/2 flex items-center justify-center bg-base-200">
          <div className="w-1/2 h-full bg-base-200 p-4 overflow-auto">
            {isInitializingCall ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <LuLoaderCircle className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-lg">Connecting to video call...</p>
                </div>
              </div>
            ) : !streamClient || !call ? (
              <div className="h-full flex items-center justify-center">
                <div className="card bg-base-100 shadow-xl max-w-md">
                  <div className="card-body items-center text-center">
                    <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                      <LuPhoneOff className="w-12 h-12 text-error" />
                    </div>
                    <h2 className="card-title text-2xl">Connection Failed</h2>
                    <p className="text-base-content/70">
                      Unable to connect to the video call
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <StreamTheme>
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </StreamTheme>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
