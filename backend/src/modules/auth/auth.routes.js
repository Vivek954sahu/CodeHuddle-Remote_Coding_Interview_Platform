import express from "express";
import passport from "passport";

import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    login,
    register,
    refreshToken,
    logout,
    oauthCallback
} from "./auth.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { USER_ROLES } from "./auth.constants.js";

const router = express.Router();

/**
 * =======================================================================
 * Public Auth Routes
 * =======================================================================
 */

/**
 * @route  POST /api/auth/register
 * @desc   Register user (email / password)
 * @access Public
 */
router.post("/register", asyncHandler(register));

/**
 * @route  POST /api/auth/login
 * @desc   Login user and issue JWTs
 * @access Public
 */
router.post("/login", asyncHandler(login));

/**
 * @route  POST /api/auth/refresh
 * @desc   Refresh access token
 * @access Public
 */
router.post("/refresh", asyncHandler(refreshToken));

/**
 * ==============================================================
 * OAuth Routes (Google)
 * ==============================================================
 */

/**
 * @route  GET /api/auth/google
 * @desc   Redirect to google OAuth
 * @access Public
 */
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

/**
 * @route  GET /api/auth/google/callback
 * @desc   OAuth Callback handler
 * @access Public
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login"
    }),
    asyncHandler(oauthCallback)
);

/**
 * ==============================================================
 * Protected Routes
 * ==============================================================
 */

/**
 * @route  POST /api/auth/logout
 * @desc   Logout user (invalidate refresh token)
 * @access Private
 */
router.post("/logout", authenticate, asyncHandler(logout));

/**
 * ==============================================================
 * RBAC
 * ==============================================================
 */

/**
 * @route  POST /api/auth/admin-check
 * @desc   Example admin only route
 * @access Admin
 */
router.post(
    "/admin-check",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    (req, res) => {
        res.ok({ user: req.user },
            "Admin access granted",
        null);
    }
);

export default router;