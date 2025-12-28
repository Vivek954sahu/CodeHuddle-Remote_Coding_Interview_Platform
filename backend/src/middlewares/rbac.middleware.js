import { ApiError } from "../utils/ApiError.js";

/**
 * Role Based Access Control
 * @param {...string} allowedRoles
 */

export const authorize = (...allowedRoles) => {
    if(!allowedRoles || allowedRoles.length === 0){
        throw new Error("RBAC require at least one role");
    }

    return (req, res, next) => {
        if(!req.user || !req.user.role) {
            throw new ApiError(401, "Authentication required");
        }

        if(!allowedRoles.includes(req.user.role)){
            throw ApiError.forbidden("Permissions or Access denied!");
        }

        next();
    };
};