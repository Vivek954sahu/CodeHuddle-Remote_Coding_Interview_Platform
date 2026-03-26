import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { USER_ROLES } from "../auth/auth.constants.js";
import { 
    endInterview,
    getInterviewById,
    getPastInterviews,
    getStreamToken,
    getUpcomingInterviews,
    joinInterview,
    scheduleInterview } from "./interview.controller.js";

const router = express.Router();

/**
 * @route  POST /api/interviews/schedule-interview
 * @desc   Schedule the interview
 * @access Interviewer
 */
router.post("/", authenticate, authorize(USER_ROLES.INTERVIEWER), asyncHandler(scheduleInterview));

/**
 * @route  GET /api/interviews/upcoming-interviews
 * @desc   fetch upcoming interviews
 * @access Interviewer, Candidate
 */
router.get("/upcoming-interviews", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(getUpcomingInterviews));

/**
 * @route  GET /api/interviews/past-interviews
 * @desc   fetch past interviews
 * @access Interviewer, Candidate
 */
router.get("/past-interviews", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(getPastInterviews));

/**
 * 
 */
router.get("/:interviewId/details", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(getInterviewById));

/**
 * @route  PATCH /api/interviews/join
 * @desc   join the interview
 * @access Interviewer, Candidate
 */
router.patch("/:interviewId/join", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(joinInterview));

/**
 * @route  PATCH /api/interviews/end
 * @desc   end the interview
 * @access Interviewer
 */
router.patch("/:interviewId/end", authenticate, authorize(USER_ROLES.INTERVIEWER), asyncHandler(endInterview));

/**
 * @route  GET /api/interviews/stream-token
 * @desc   fetch stream token 
 * @access Interviewer, Candidate 
 */
router.get("/stream-token", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(getStreamToken));

export default router;