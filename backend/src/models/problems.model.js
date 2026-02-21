import mongoose from 'mongoose';

const { Schema } = mongoose;

const problemSchema = new Schema({
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

    supportedLanguages: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
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
    ],

     createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
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
problemSchema.index({ title: "text", description: "text" });



problemSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("testcases")) {
    return next(
      new Error("Testcases cannot be modified after problem is published")
    );
  }
  next();
});

export const Problem = mongoose.model("Problem", problemSchema);