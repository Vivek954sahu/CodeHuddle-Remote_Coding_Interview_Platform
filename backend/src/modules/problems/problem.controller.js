import { problemService } from "./problem.service.js";
import { problemSchema } from "./problem.validation.js";

/**
 * ===========================================================
 *                  Add Problems
 * ===========================================================
 */
export const addProblem = async (req, res) => {
    const { error, value } = problemSchema.validate(req.body);

    if (error) {
            throw ApiError.badRequest("Missing or Incorrect required fields", error);
        };
    
    const userId = req.user.id;
    
    const result = await problemService.addProblems(value, userId);
    
    res.created(result, "Problems Added Succesfully.");
};