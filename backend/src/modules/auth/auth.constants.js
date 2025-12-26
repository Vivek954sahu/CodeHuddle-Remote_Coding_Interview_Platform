//  Roles
export const USER_ROLES = {
    ADMIN: "admin",
    INTERVIEWER: "interviewer",
    CANDIDATE: "candidate"
};

// TOKENS
export const TOKEN_TYPES = {
    ACCESS: "access",
    REFRESH: "refresh"
};

// ---- JWT Expiry --------
export const JWT_EXPIRY = {
     ACCESS: "15m",
    REFRESH: "7d"
};

// ------COOKIE NAMES -----
export const COOKIE_NAMES = {
    REFRESH_TOKEN: "refreshToken"
};

// ----- oAUTH PROVIDERS ----
export const OAUTH_PROVIDERS = {
    GOOGLE: "google"
};

// ---------- AUTH STRATEGIES -----
export const AUTH_STRATEGIES = {
    LOCAL: "local",
    OAUTH: "oauth"
};