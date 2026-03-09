import Axios from "./axios";

export const getUpcomingInterviews = (params) => Axios.get("/v1/interviews/upcoming-interviews", {params});