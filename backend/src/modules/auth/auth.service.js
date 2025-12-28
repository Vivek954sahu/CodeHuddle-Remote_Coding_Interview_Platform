import jwt from "jsonwebtoken";

import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { JWT_EXPIRY, USER_ROLES } from "./auth.constants.js";

/**
 * =============================================================
 * Helper functions
 * =============================================================
 */

const generateAccessToken = (payload, expiresIn) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn }
    );
};

const generateRefreshToken = (payload, expiresIn) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn }
    );
};

/**
 * =============================================
 * Auth Service
 * =============================================
 */
export const authService = {
    /**
     * Register User
     */
    async register({ email, password, name, role }) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(409, "User already exists!");
        }

        const user = await User.create({
            email,
            password,
            name,
            role: role || USER_ROLES.CANDIDATE
        });

        const accessToken = generateAccessToken({ sub: user._id, role: user.role }, JWT_EXPIRY.ACCESS);

        const refreshToken = generateRefreshToken({ sub: user._id }, JWT_EXPIRY.REFRESH);

        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();

        await user.save();

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    },

    /** ------------------------------------------------------
     *  ----------------- Login User -------------------------
     * -------------------------------------------------------
     */
    async login({ email, password }) {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.isActive) {
            throw new ApiError(401, 'Invalid Credentials');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid Credentials");
        }

        const accessToken = generateAccessToken({ sub: user._id, role: user.role }, JWT_EXPIRY.ACCESS);

        const refreshToken = generateRefreshToken({ sub: user._id }, JWT_EXPIRY.REFRESH);

        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();

        await user.save();

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    },

    /** ------------------------------------------------------
     *  -------------- Refresh Access Token ------------------
     * ------------------------------------------------------
     */
    async refreshAccessToken (refreshToken) {
        let payload;

        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const user = await User.findById(payload.sub).select("+refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Refresh token revoked");
        }

        const accessToken = generateAccessToken({ sub: user._id, role: user.role }, JWT_EXPIRY.ACCESS);

        const refreshToken = generateRefreshToken({ sub: user._id }, JWT_EXPIRY.REFRESH);

        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();

        await user.save();

        return {
            accessToken,
            refreshToken
        };

    },

    /** ------------------------------------------------------
     * ------------------ Logout User ------------------------
     * -------------------------------------------------------
     */
    async logout (refreshToken) {
        if(!refreshToken) return;
        
        await User.updateOne(
            { refreshToken: refreshToken },
            { $set: { refreshToken: null } }
        );
    },

    /** ---------------------------------------------------------
     * ---------- OAuth Login by Google -------------------------
     * ----------------------------------------------------------
     */
    async oauthLogin ({ providerId, email, name }) {
        let user = await User.findOne({ email });

        if(!user) {
            user = await User.create({
                name,
                email,
                isEmailVerified: true,
                oauthProviders: {
                    google: { id: providerId, email }
                }
            });
        }

        const accessToken = generateAccessToken({ sub: user._id, role: user.role }, JWT_EXPIRY.ACCESS);

        const refreshToken = generateRefreshToken({ sub: user._id }, JWT_EXPIRY.REFRESH);

        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();

        await user.save();

        return {
            user: user.toJSON(),
            accessToken,
            refreshToken
        };
    }
    
}