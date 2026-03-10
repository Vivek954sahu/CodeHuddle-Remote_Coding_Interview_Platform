import { chatClient, streamClient } from "../../config/stream.js";
import { Interview } from "../../models/interview.model.js";
import { ApiError } from "../../utils/ApiError.js";



export const interviewService = {

    /**
     * =======================================
     *        Create Interview Session
     * =======================================
     * @param { object } payload 
     * @returns { interviewId, status }
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
            name: `${payload.title}_session`,
            created_by_id: payload.createdBy,
            members: [{ user_id: payload.interviewerId, role: "interviewer" }]
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
     * @param { uuid } userId 
     * @param { String } role 
     * @param { page, limit } options 
     * @returns { interviews , total, limit, skip, hsMore }
     */
    async upcomingOrActiveInterviews(userId, role, options = {}) {
        const { page = 1, limit = 8 } = options;

        const searchQuery = {
            status: {
                $in: ['SCHEDULED', 'IN_PROGRESS']
            }
        };

        if (role === 'candidate') {
            searchQuery.candidate = userId;
        } else if (role === 'interviewer') {
            searchQuery.interviewer = userId;
        }

        const projection =
            role === 'interviewer'
             ? {
                _id:1, title:1, status:1, interviewType:1, candidate:1, scheduledAt:1, durationMinutes:1, problems:1, callId:1, interviewer:0
            } : {
                _id:1, title:1, status:1, interviewType:1, interviewer:1, scheduledAt:1, durationMinutes:1, problems:0, candidate:0, callId:1
            };
        const skip = (page - 1) * limit;

        const [interviews, total] = await Promise.all([
            Interview.find(searchQuery, projection)
                .populate("candidate", "name email")
                .populate("interviewer", "name email")
                .populate({
                    path: "problems.problem",
                    select: "title"
                })
                .sort({ scheduledAt: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Interview.countDocuments(searchQuery)
        ]);

        return {
            result: interviews,
            total,
            limit,
            skip,
            hasMore: skip + limit < total
        };
    },

    /**
     * =========================================
     *           Get Past Session
     * =========================================
     * @param { uuid } userId
     * @param { String } role 
     * @param { page, limit } options 
     * @returns { interviews, total, limit, skip, hasMore }
     */
    async pastInterviews(userId, role, options = {}) {
        const { page = 1, limit = 8 } = options;

        const searchQuery = {
            status: {
                $in: ["COMPLETED", "CANCELLED", "NO_SHOW", "EXPIRED"]
            },
            $or: [{ interviewer: userId }, { candidate: userId }]
        }

        const skip = (page - 1) * limit;

        const [interviews, total] = await Promise.all([
            Interview.find(searchQuery, { title: 1, candidate: 1, interviewer: 1, scheduledAt: 1, endAt: 1, status: 1, evaluation: 1 })
                .populate("candidate", "name")
                .populate("interviewer", "name")
                .sort({ scheduledAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Interview.countDocuments(searchQuery)
        ]);

        const result = null;

        if (role === "candidate") {
            result = interviews.map(interview => {
                delete interview.candidate
            });
        } else {
            result = interviews.map(interview => {
                delete interview.interviewer
            });
        };

        return {
            result,
            total,
            limit,
            skip,
            hasMore: skip + limit < total
        };
    },

    /**
     * ==========================================
     *           Join Interview Session
     * ==========================================
     * @param { uuid } userId 
     * @param { uuid } interviewId 
     * @returns { interviewId, callId, status}
     */
    async joinInterview(userId, interviewId) {

        // Fetch interview 
        const interview = await Interview.findById(interviewId);

        if (!interview) throw new ApiError(404, "Interview not found");

        // Check user is part of the interview
        const isCandidate = interview.candidate && interview.candidate.toString() === userId.toString();
        const isInterviewer = interview.interviewer && interview.interviewer.toString() === userId.toString();

        if (!isCandidate && !isInterviewer) {
            throw new ApiError(403, "User is not a participant of this interview");
        }

        // If interview is scheduled and candidate joins, mark it as IN_PROGRESS
        if (isCandidate && interview.canStart()) {
            try {
                interview.start();
                await interview.save();
            } catch (err) {
                throw new ApiError(400, err.message || "Unable to start interview");
            }
        }

        if (isCandidate) {
            // Ensure chat channel has the participant as member.
            try {
                const channel = chatClient.channel("messaging", interview.callId);

                // Add member to channel
                await channel.addMembers([{ userId: userId, role: "candidate" }])
            } catch (err) {
                console.log(err.message);
            }
        }

        return {
            interviewId: interview._id,
            callId: interview.callId,
            status: interview.status
        };

    },

    /**
     * ==========================================
     *           End Interview Session
     * ==========================================
     * @param { uuid } userId 
     * @param { uuid } interviewId 
     * @returns { interviewId, callId, status}
     */
    async endInterview(userId, interviewId) {
        // Fetch interview
        const interview = await Interview.findById(interviewId);

        if (!interview) throw new ApiError(404, "Interview not found");

        // Check user is part of the interview
        const isCandidate = interview.candidate && interview.candidate.toString() === userId.toString();
        const isInterviewer = interview.interviewer && interview.interviewer.toString() === userId.toString();

        if (!isCandidate && !isInterviewer) {
            throw new ApiError(403, "User is not a participant of this interview");
        };

        if (isCandidate) throw new ApiError(403, "Only interviewer can end session.");

        // If interview is IN_PROGRESS and interviewer ends session, mark it as COMPLETED
        if (isInterviewer && interview.canComplete()) {
            try {
                // Delete Video call
                const call = streamClient.video.call("default", interview.callId);
                await call.delete({ hard: true });

                // Delete Chat channel
                const channel = chatClient.channel("messaging", interview.callId);
                await channel.delete();

                // Complete the Interview
                interview.complete();
                await interview.save();
            } catch (err) {
                throw new ApiError(400, err.message || "Unable to end the interview");
            }
        };

        return {
            interviewId: interview._id,
            callId: interview.callId,
            status: interview.status
        };
    }
};