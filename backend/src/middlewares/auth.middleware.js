import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const authenticate = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer")) {
        throw ApiError.unauthorized("Authentication required!");
    }

    const token = header.split(" ")[1];

    if(!token) {
        throw ApiError.unauthorized("Missing access token");
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw Api.unauthorized("Invalid or expired token");
    }

    req.user = {
        id: payload.sub,
        role: payload.role
    };

    next();
});