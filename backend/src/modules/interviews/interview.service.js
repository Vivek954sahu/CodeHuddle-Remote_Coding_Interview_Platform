import { chatClient, streamClient } from "../../config/stream.js";
import { Interview } from "../../models/interview.model.js";
import { ApiError } from "../../utils/ApiError.js";



export const interviewService = {
    /**
 * =======================================
 *        Create Interview Session
 * =======================================
 */
    async scheduleInterview(payload) {

        /** Fetching CandidateId for Interview Creation */
        const candidate = await Interview.findOne({ email: payload.candidateEmail }).select('_id').lean();

        if (!candidate) throw new ApiError(400, "Candidate does not exists!");

        const endAt = new Date(payload.scheduledAt.getTime() + (payload.duration * 60000));

        /**
         * Generate a unique call Id for stream video calls
         */
        const callId = `interview_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        /**
         * Creating problem-mapping array
         */
        const interviewProblems = payload.problemIds.map((p, idx) => ({
            problem: p,
            order: idx + 1
        }));

        /**
         * Creating  Interview
         */
        const interview = await Interview.create({
            title: payload.title,
            candidate: candidate._id,
            interviewer: payload.interviewerId,
            interviewType: payload.type,
            scheduledAt: payload.scheduledAt,
            endAt: endAt,
            durationMinutes: payload.duration,
            createdBy: payload.createdBy,
            callId: callId,
            problems: interviewProblems
        });

        /**
         * Creating a stream video call
         */
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: payload.createdBy,
                custom: { sessionId: interview._id.toString() },
                starts_at: payload.scheduledAt
            },
        });

        /**
         * Creating a chat message channel
         */
        const channel = chatClient.channel("messaging", callId, {
            name:`${payload.title}_session` ,
            created_by_id: payload.createdBy,
            members: [payload.interviewerId]
        });

        await channel.create();

        return {
            interviewId: interview._id,
            status: interview.status
        };

    },

    /**
     * =========================================
     *       Get Upcoming /Active Session
     * =========================================
     */
    

};