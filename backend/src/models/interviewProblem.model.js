import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * ===========================
 * InterviewProblem Schema
 * ===========================
 */
const interviewProblemSchema = new Schema(
  {
    interview: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true
    },

    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true
    },

    /**
     * Ordering inside interview
     */
    order: {
      type: Number,
      default: 1
    },

    /**
     * Language chosen by candidate
     */
    selectedLanguage: {
      type: String
    },

    /**
     *  submissions
     */
    submissions: [
      {
        submissionId: {
          type: String,
          required: true
        },
        language: String,
        status: String, // ACCEPTED, WA, TLE, RUNTIME_ERROR
        score: Number,
        submittedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    /**
     * Final evaluation
     */
    evaluation: {
      obtainedScore: {
        type: Number,
        default: 0
      }
    },

    /**
     * Audit
     */
    assignedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

/**
 * ===========================
 * Indexes
 * ===========================
 */

// One problem only once per interview
interviewProblemSchema.index(
  { interview: 1, problem: 1 },
  { unique: true }
);

// Fast interview fetch
interviewProblemSchema.index({ interview: 1, order: 1 });

/**
 * ===========================
 * Helpers
 * ===========================
 */

interviewProblemSchema.methods.addSubmission = function (submission) {
  this.submissions.push(submission);
};

export const InterviewProblem = mongoose.model(
  "InterviewProblem",
  interviewProblemSchema
);
