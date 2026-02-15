import Joi from "joi";

export const problemSchema = Joi.object({
    title: Joi.string().required().min(5).max(200),
    slug: Joi.string().required().min(6).max(205),
    description: Joi.string().required().min(30).max(1000),
    difficulty: Joi.string().required().valid("EASY", "MEDIUM", "HARD"),
    supportedLanguages: Joi.string().required().min(1),
    testcases: Joi.array().items(
         Joi.object({
            input: Joi.string().required(),
            expectedOutput: Joi.string().required(),
            score: Joi.number().integer().min(1).required()
         }).required()
        ).min(1).required(),
    samples: Joi.array().items(
         Joi.object({
            input: Joi.string().required(),
            output: Joi.string().required(),
            explanation: Joi.string().required()
         }).required()
        ).min(1).required()
});