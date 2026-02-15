import { Problem } from "../../models/problems.model.js";

export const problemService = {
    /**
     * Add problems to solve in platform
     * @param {*} payload 
     */
    async addProblems (payload, userId) {

        const newProblem = await Problem.create({
            title: payload.title,
            slug: payload.slug,
            description: payload.description,
            difficulty: payload.difficulty,
            supportedLanguages: payload.supportedLanguages,
            isActive: payload.isActive,
            testcases: payload.testcases,
            samples: payload.samples,
            createdBy: userId
            });

        return {
            problem: newProblem._id
        }
    }
};