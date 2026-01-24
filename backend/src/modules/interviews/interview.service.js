import { inngest } from "../../config/inngest.js";
import { Interview } from "../../models/interview.model.js";
import { ApiError } from "../../utils/ApiError.js";



export const interviewService = {
    /**
 * =======================================
 *        Create Interview Session
 * =======================================
 */
 async scheduleInterview (payload) {
    if(payload.candidateId.toString() === payload.interviewerId.toString()) {
        throw new ApiError(400, "Candidate and interviewer cannot be same");
    }

    const endAt = new Date(payload.scheduledAt.getTime() + (payload.duration * 60000));

    const interview = await Interview.create({
        candidate: payload.candidateId,
        interviewer: payload.interviewerId,
        interviewType: payload.type,
        evaluationTypes: payload.evaluationTypes,
        mode: payload.mode,
        scheduledAt: payload.scheduledAt,
        endAt,
        durationMinutes: payload.duration,
        createdBy: payload.createdBy
    });

    /**
     * Inngest Event Emitter for Mapping Problems to Interview
     */
    await inngest.send({
        name: "interview.created",
        data: {
            interviewId: interview._id,
            problemIds
        }
    });
 
    return interview._id;
 },

};