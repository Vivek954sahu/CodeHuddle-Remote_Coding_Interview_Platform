import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },

        name: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 50
        },

        password: {
            type: String,
            minlength: 8,
            select: false
        },

        oauthProviders: {
            google: {
                id: { type: String },
                email: { type: String }
            }
        },

        role: {
            type: String,
            enum: ["admin", "interviewer", "candidate"],
            default: "candidate",
            index: true
        },

        refreshToken: {
            type: String,
            select: false
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        lastLoginAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/**
 * hash password before save
 */
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);

    next();
});

/**
 * Compare passsword for login
 */
userSchema.methods.comparePassword = async function (userPassword) {
    if(!this.password) return false;

    return bcrypt.compare(userPassword, this.password);
};

/**
 * Remove sensitive data from output
 */
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
}

export const User = mongoose.model("User", userSchema);