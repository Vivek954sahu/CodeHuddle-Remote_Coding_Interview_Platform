import { ApiError } from "../../utils/ApiError.js";
import { authService } from "./auth.service.js";

/**
 * ====================================================================================
 * Register User
 * ====================================================================================
 */
export const register = async (req, res) => {
    const { email, password, name, role } = req.body;

    if(!email || !password || !name) {
        throw new ApiError(400, "Missing reuired fields");
    }

    const result = await authService.register({
        email,
        password,
        name,
        role
    });

    // set refresh token in httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    return res.created({
        user: result.user,
        accessToken: result.accessToken
    });
};

/**
 * ====================================================================================
 * Login User
 * ====================================================================================
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const result = await authService.login({ email, password });

    // set refresh token in httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    return res.ok({
        user: result.user,
        accessToken: result.accessToken
    });
};

/**
 * ====================================================================================
 * Refresh Access Token
 * ====================================================================================
 */
export const refreshToken = async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if(!token) {
        throw new ApiError(401, "Refresh token missing");
    }

    const result = await authService.refreshAccessToken(token);

    return res.ok({
        accessToken: result.accessToken
    });
};

/**
 * ====================================================================================
 * Logout User
 * ====================================================================================
 */
export const logout = async (req, res) => {
    const token = req.cookies?.refreshToken;

    if(token){
        await authService.logout(token);
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.ok({ message: "Logged out successfully" });
};

/**
 * ====================================================================================
 * OAuth Callback
 * ====================================================================================
 */
export const oauthCallback =  async (req, res) => {
    // req.user is injected by passport strategy
    if(!req.user) {
        throw new ApiError(401, "OAuth authentication failed");
    }

    const result = await authService.oauthLogin(req.user);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    /**
     * In frontend redirect to there with access token
     */

    return res.ok({
        user: req.user,
        accessToken: result.accessToken
    });
};