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
     * Locked problem version
     */
    problemVersion: {
      type: Number,
      required: true
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
     * Judge0 submissions
     */
    submissions: [
      {
        submissionId: {
          type: String,
          required: true
        },
        language: String,
        status: String, // ACCEPTED, WA, TLE, RUNTIME_ERROR
        runtimeMs: Number,
        memoryKb: Number,
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
      maxScore: {
        type: Number,
        default: 100
      },
      obtainedScore: {
        type: Number,
        default: 0
      },
      verdict: {
        type: String,
        enum: ["PASS", "FAIL", "PARTIAL"]
      }
    },

    /**
     * Interviewer notes for THIS problem
     */
    interviewerNotes: {
      type: String,
      maxlength: 3000
    },

    /**
     * Timeline
     */
    codeTimelineUrl: {
      type: String
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
    versionKey: false
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
