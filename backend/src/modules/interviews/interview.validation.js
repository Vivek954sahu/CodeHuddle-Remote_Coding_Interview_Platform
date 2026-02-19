import Joi from "joi";
import { INTERVIEW_TYPES } from "./interview.constants.js";


export const interviewSchema = Joi.object({
    title: Joi.string().required().trim(),
    candidateEmail: Joi.string().required().email().lowercase().trim(),
    scheduledAt: Joi.date().iso().required().greater('now'),
    duration: Joi.number().integer().min(30).max(120).default(60).required(),
    type: Joi.string().valid(INTERVIEW_TYPES.TECHNICAL, INTERVIEW_TYPES.HR),
    problemIds: Joi.array().items( Joi.string().guid().required() ).min(1).max(4).required()
});

export const urlInterviewSchema = Joi.object({
    interviewId: Joi.string().guid().required()
});

export const queryInterviewSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(3).max(10).default(8)
});