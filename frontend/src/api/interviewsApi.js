import Axios from "./axios";

export const getUpcomingInterviews = (params) => Axios.get("/v1/interviews/upcoming-interviews", {params});

export const scheduleInterview = (data) => Axios.post("/v1/interviews", data);

export const interviewById = (interviewId) => Axios.get(`/v1/interviews/${interviewId}/details`);

export const joinInterview = (interviewId) => Axios.patch(`/v1/interviews/${interviewId}/join`);

export const endInterview = (interviewId) => Axios.patch(`/v1/interviews/${interviewId}/end`);

export const getStreamToken = () => Axios.get("/v1/interviews/stream-token");