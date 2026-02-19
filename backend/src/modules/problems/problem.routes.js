import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../auth/auth.constants.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { addProblem } from "./problem.controller.js";

const router = express.Router();

/**
 * @route  POST /api/problems/add-problem
 * @desc   Add problem for the interview
 * @access Interviewer, Admin
 */
router.post("/add-problem", authenticate, authorize(USER_ROLES.INTERVIEWER, USER_ROLES.ADMIN), asyncHandler(addProblem));

export default router;
