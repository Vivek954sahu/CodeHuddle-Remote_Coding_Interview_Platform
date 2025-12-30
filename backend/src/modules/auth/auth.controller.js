import { ApiError } from "../../utils/ApiError.js";
import { COOKIE_NAMES } from "./auth.constants.js";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

/**
 * ====================================================================================
 * Register User
 * ====================================================================================
 */
export const register = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);

    if(error) {
        throw ApiError.badRequest("Missing reuired fields", error);
    }

    const result = await authService.register(value);

    // set refresh token in httpOnly cookie
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    res.created({
        user: result.user,
        accessToken: result.accessToken
    }, "User registered successfully");
};

/**
 * ====================================================================================
 * Login User
 * ====================================================================================
 */
export const login = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);

    if(error) {
        throw ApiError.badRequest("Email and password are required", error);
    }

    const result = await authService.login(value);

    // set refresh token in httpOnly cookie
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    return res.ok({
        user: result.user,
        accessToken: result.accessToken
    }, "Login successful", null);
};

/**
 * ====================================================================================
 * Refresh Access Token
 * ====================================================================================
 */
export const refreshToken = async (req, res) => {
    const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

    if(!token) {
        throw new ApiError(401, "Refresh token missing");
    }

    const result = await authService.refreshAccessToken(token);

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    return res.ok(
        { accessToken: result.accessToken},
        "Token is refreshed successfully.",
        null
    );
};

/**
 * ====================================================================================
 * Logout User
 * ====================================================================================
 */
export const logout = async (req, res) => {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

    if(token){
        await authService.logout(refreshToken);
    }

    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.ok(null, "Logged out successfully", null);
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

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    /**
     * In frontend redirect to there with access token
     */

    return res.ok(
        { user: result.user,
        accessToken: result.accessToken },
        " OAuth login successfully.",
        null
    );
};