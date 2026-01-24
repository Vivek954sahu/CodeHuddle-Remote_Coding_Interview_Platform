import mongoose from "mongoose";
import { EVALUATION_TYPES, INTERVIEW_MODE, INTERVIEW_STATUS, INTERVIEW_TYPES } from "../modules/interviews/interview.constants.js";

const { Schema } = mongoose;

const interviewSchema = new Schema({
    candidate: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    interviewer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    interviewType: {
        type: String,
        enum: Object.values(INTERVIEW_TYPES),
        required: true
    },

    scheduledAt: {
        type: Date,
        required: true,
        index: true
    },
    
    durationMinutes: { type: Number, default: 60 },

    endAt: {
        type: Date,
        required: true,
        index: true
    },

    /**
     * Interview lifecycle
     */
    status: {
        type: String,
        enum: Object.values(INTERVIEW_STATUS),
        default: "SCHEDULED",
        index: true
    },

    /**
     * Stream session
     */
    streamSession: {
        callId: String,
        channelId: String
    },

    /**
     * Collaborative editor session (Yjs / Monaco)
     */
    editorSessionId: {
        type: String,
        index: true
    },

    /**
     * Audit
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }

);

/**
 * ===========================
 * Indexes (IMPORTANT)
 * ===========================
 */

// Prevent double booking
interviewSchema.index(
    { interviewer: 1, scheduledAt: 1 },
    { unique: true }
);

// Fast dashboard queries
interviewSchema.index({ candidate: 1, status: 1 });
interviewSchema.index({ interviewer: 1, status: 1 });

/**
 * ===========================
 * Lifecycle guards
 * ===========================
 */

interviewSchema.methods.canStart = function () {
    return this.status === "SCHEDULED";
};

interviewSchema.methods.canComplete = function () {
    return this.status === "IN_PROGRESS";
};

interviewSchema.methods.start = function () {
    if (!this.canStart()) {
        throw new Error("Interview cannot be started");
    }
    this.status = "IN_PROGRESS";
};

interviewSchema.methods.complete = function () {
    if (!this.canComplete()) {
        throw new Error("Interview cannot be completed");
    }
    this.status = "COMPLETED";
};

export const Interview = mongoose.model("Interview", interviewSchema);
