import { step } from "inngest";
import { inngest } from "../../config/inngest.js";
import { Problem } from "../../models/problems.model.js";
import { InterviewProblem } from "../../models/interviewProblem.model.js";


export const mapInterviewProblems = inngest.createFunction(
    { id: "map-interview-problems", retries: 3 },
    { event: "interview.created" },

    async ({ event, step }) => {
        const { interviewId, problemIds } = event.data;

        /**  Fetch Problems to Map */
        const problems = await step.run("fetch-problems", async () => {
            return await Problem.find({ _id: { $in: problemIds } });
        });

        /** Map Problems */
        await step.run("map-problems", async () => {
            const mappings = problems.map((problem, idx) => ({
                interview: interviewId,
                problem: problem._id,
                order: idx + 1
            }));
            
            await InterviewProblem.insertMany(mappings);
        });

        return { success: true };
    }
);