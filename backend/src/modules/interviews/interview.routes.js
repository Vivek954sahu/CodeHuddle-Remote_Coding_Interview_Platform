import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { USER_ROLES } from "../auth/auth.constants.js";
import { 
    endInterview,
    getPastInterviews,
    getUpcomingInterviews,
    joinInterview,
    scheduleInterview } from "./interview.controller.js";

const router = express.Router();

/**
 * @route  POST /api/interviews/schedule-interview
 * @desc   Schedule the interview
 * @access Interviewer
 */
router.post("/schedule-interview", authenticate, authorize(USER_ROLES.INTERVIEWER), asyncHandler(scheduleInterview));

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
 * @route  PATCH /api/interviews/join
 * @desc   join the interview
 * @access Interviewer, Candidate
 */
router.patch("/join", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE), asyncHandler(joinInterview));

/**
 * @route  PATCH /api/interviews/end
 * @desc   end the interview
 * @access Interviewer
 */
router.patch("/end", authenticate, authorize(USER_ROLES.INTERVIEWER), asyncHandler(endInterview));

export default router;