import mongoose from 'mongoose';

const { Schema } = mongoose;

const problemSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },

    description: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['EASY', 'MEDIUM', 'HARD'],
        index: true
    },

    tags: {
        type: String,
        index: true
    },

    supportedLanguages: {
        type: String,
        required: true
    },

    version: {
        type: Number,
        default: 1
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    executionConfig: {
        timeLimitMs: {
            type: Number,
            default: 2000
        },
        memoryLimitKb: {
            type: Number,
            default: 256000
        }
    },

    testcases: [
        {
            input: {
                type: String,
                required: true
            },
            expectedOutput: {
                type: String,
                required: true
            },
            isHidden: {
                type: Boolean,
                default: true
            },
            score: {
                type: Number,
                default: 1
            }
        }
    ],

    samples: [
        {
            input: String,
            output: String,
            explanation: String
        }
    ]
},
    {
        timestamps: true,
        versionKey: false
    }
);

problemSchema.index(
  { createdBy: 1, slug: 1 },
  { unique: true }
);

// Search optimization
problemSchema.index({ title: "text", description: "text", tags: "text" });



problemSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("testcases")) {
    return next(
      new Error("Testcases cannot be modified after problem is published")
    );
  }
  next();
});

export const Problem = mongoose.model("Problem", problemSchema);