import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getDifficultyBadgeClass } from "../../lib/utils";
import { Group, Panel, Separator } from "react-resizable-panels";
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

  const isCandidate = interview?.interviewer?._id;
  const isInterviewer = interview?.candidate?._id;

  const { streamClient, call, chatClient, channel, isInitializingCall } =
    useStreamClient(interview, loading, isCandidate, isInterviewer);

  const problemData = interview?.problems?.map((p) => p.problem)?.filter(Boolean) || [];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  /* ---------------- AUTO JOIN ---------------- */
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!interview || loading || hasJoinedRef.current || !user) return;

    hasJoinedRef.current = true;

    joinSession(id);
  }, [interview, loading, id, user, isCandidate, isInterviewer]);

  /* ---------------- REDIRECT ON END ---------------- */
  useEffect(() => {
    if (interview?.status === "COMPLETED") {
      navigate(
        user.role === "candidate"
          ? "/candidate/dashboard"
          : "/interviewer/dashboard",
      );
    }
  }, [interview, loading, navigate]);

  /** To do update code when problem loads or changes */

  /* ---------------- CODE RUN ---------------- */
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);

    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified.",
      )
    ) {
      endSession(id);
      navigate("/interviewer/dashboard");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen flex flex-col bg-purple-100">
      {/* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        <Group orientation="horizontal">
          {/* LEFT SIDE - Code Editor and Problem Details */}
          <Panel defaultSize={50} minSize={30}>
            <Group orientation="vertical">
              {/* Problem Desc Panel */}
              <Panel defaultSize={50} minSize={20}>
                <div className="flex-1 overflow-y-auto p-6 bg-purple-200">
                  {/* HEADER */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                      {problemData[0]?.title || "Loading..."}
                    </h1>

                    <div className="flex items-center gap-3 mt-2">
                      {/* <span
                  className={`badge ${getDifficultyBadgeClass(session?.difficulty)}`}
                >
                  {?.difficulty}
                </span> */}

                      {isInterviewer && interview?.status === "COMPLETED" && (
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
                    <p>{problemData[0]?.description}</p>
                  </div>

                  {/* EXAMPLES */}
                  <div className="bg-base-100 p-4 rounded-lg mb-4">
                    <h2 className="font-bold mb-2">Examples</h2>

                    {problemData[0]?.samples?.map((ex, i) => (
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

                    {problemData[0]?.testcases
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
              </Panel>

              <Separator className="h-2 bg-purple-300 hover:bg-purple-500 transition-colors cursor-col-resize" />

              {/* Code Editor & Output */}
              <Panel defaultSize={50} minSize={20}>
                <Group orientation="vertical">
                  {/* Code Editor */}
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditor
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={(e) =>
                        setSelectedLanguage(e.target.value)
                      }
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <Separator className="h-2 bg-purple-200 hover:bg-purple-500 transition-colors cursor-col-resize" />

                  {/* Output Panel */}
                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </Group>
              </Panel>
            </Group>
          </Panel>

          <Separator className="w-2 bg-purple-200 hover:bg-purple-500 transition-colors cursor-col-resize" />

          {/* Right Side - Video Call and Chat */}
          <Panel defaultSize={30} minSize={30}>
            <div className="h-full bg-purple-200 p-4 overflow-auto rounded-md">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <LuLoaderCircle className="w-12 h-12 mx-auto animate-spin text-purple-800 mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-purple-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <LuPhoneOff className="w-12 h-12 text-red-500" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-purple-600/80">
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
                        <VideoCallUI
                          chatClient={chatClient}
                          channel={channel}
                        />
                      </StreamCall>
                    </StreamVideo>
                  </StreamTheme>
                </div>
              )}
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  );
};

export default InterviewRoom;
