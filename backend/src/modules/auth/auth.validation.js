import Joi from "joi";
import { USER_ROLES } from "./auth.constants.js";

/**
 * common validators
 */
const email = Joi.string().email().lowercase().trim();
const password = Joi.string().min(8).max(128);
const name = Joi.string().min(3).max(50).trim();

/**
 * Register
 */
export const registerSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    password: password.required(),
    role: Joi.string().valid(USER_ROLES.CANDIDATE, USER_ROLES.INTERVIEWER).optional()
});

/**
 * Login
 */
export const loginSchema = Joi.object({
    emmail: email.required(),
    password: password.required()
});
