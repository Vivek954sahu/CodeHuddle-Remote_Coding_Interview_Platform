import { ApiError } from "../../utils/ApiError.js";
import { interviewService } from "./interview.service.js";
import { interviewSchema, queryInterviewSchema, urlInterviewSchema } from "./interview.validation.js";

/**
 * ================================================================
 *                   Schedule Interview
 * ================================================================
 */
export const scheduleInterview = async (req, res) => {
    const { error, value } = interviewSchema.validate(req.body);

    if (error) {
        throw ApiError.badRequest(`Missing or Incorrect required fields. ${error.message}`, error);
    };

    const createdBy = req.user.id;

    const result = await interviewService.scheduleInterview({
        value,
        createdBy
    });

    res.created(result, "Interview Created Succesfully.");
};

/**
 * ================================================================
 *                   Upcoming or Active Interviews
 * ================================================================
 */
export const getUpcomingInterviews = async (req, res) => {
    const { error, value } = queryInterviewSchema.validate(req.query);

    if (error) {
        throw ApiError.badRequest("Missing or Incorrect required fields", error);
    };

    const userId = req.user.id;

    const role = req.user.role;

    const options = {
        page: value.page ?? 1,
        limit: value.limit ?? 8,
    };

    const result = await interviewService.upcomingOrActiveInterviews(userId, role, options);

    res.ok(result, " Upcoming / Active Interviews Fetched Succesfully.");
};

/**
 * ================================================================
 *                   Past Interviews
 * ================================================================
 */
export const getPastInterviews = async (req, res) => {
    const { error, value } = queryInterviewSchema.validate(req.query);

    if (error) {
        throw ApiError.badRequest("Missing or Incorrect required fields", error);
    };

    const userId = req.user.id;

    const role = req.user.role;

    const options = {
        page: value.page ?? 1,
        limit: value.limit ?? 8,
    };

    const result = await interviewService.pastInterviews(userId, role, options);

    res.ok(result, "Past Interviews Fetched Succesfully.");
};

/**
 * ================================================================
 *                   Get Interview By ID
 * ================================================================
 */
export const getInterviewById = async (req, res) => {
    const { error, value } = urlInterviewSchema.validate(req.params);

    if (error) {
        throw ApiError.badRequest(`Missing required fields. ${error.message}`, error);
    };
    
    const interviewId = value.interviewId;

    const result = await interviewService.interviewById(interviewId);

    res.ok(result, "Interview details Fetched Succesfully.");
};

/**
 * ================================================================
 *                   Join Interview
 * ================================================================
 */
export const joinInterview = async (req, res) => {
    const { error, value } = urlInterviewSchema.validate(req.params);

    if (error) {
        throw ApiError.badRequest("Missing or Incorrect required fields", error);
    };

    const userId = req.user.id;

    const interviewId = value.interviewId;

    const result = await interviewService.joinInterview(userId, interviewId);

    res.ok(result, " Interview Joined Succesfully.");
};

/**
 * ================================================================
 *                   End Interview
 * ================================================================
 */
export const endInterview = async (req, res) => {
    const { error, value } = urlInterviewSchema.validate(req.params);

    if (error) {
        throw ApiError.badRequest("Missing or Incorrect required fields", error);
    };

    const userId = req.user.id;

    const interviewId = value.interviewId;

    const result = await interviewService.endInterview(userId, interviewId);

    res.ok(result, " Interview Ended Succesfully.");
};

/**
 * =================================================================
 *                  Get Stream Token
 * ================================================================
 */
export const getStreamToken =  async (req, res) => {
    const userId = req.user.id;

    const result = await interviewService.streamToken(userId);

    res.ok(result, " Stream Token fetched Succesfully.");

};