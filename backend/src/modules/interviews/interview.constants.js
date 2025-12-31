/**
 * Interview Constants for enums and configs
 */

/**
 * -------    Interview Life Cycle   -----------
 */
export const INTERVIEW_STATUS = Object.freeze({
    DRAFT: "DRAFT",                                             // CREATED BUT NOT SCHEDULED
    SCHEDULED: "SCHEDULED",                                     // SCHEDULED
    IN_PROGRESS: "IN_PROGRESS",                                 // CANDIDATE JOINED
    COMPLETED: "COMPLETED",                                     // SUCCESSFULLY COMPLETED
    CANCELLED: "CANCELLED",                                     // CANCELLED BY INTERVIEWER OR SYSTEM
    NO_SHOW: "NO_SHOW",                                         // CANDIDATE DIDN'T JOINED
    EXPIRED: "EXPIRED"                                          // TIME PASSED
});

/**
 * ------   Interview roles -----------
 */
export const INTERVIEW_ROLES = Object.freeze({
    ADMIN: "ADMIN",
    INTERVIEWER: "INTERVIEWER",
    CANDIDATE: "CANDIDATE"
});

/**
 *  -----   Interview types ---------
*/
export const INTERVIEW_TYPES = Object.freeze({
    TECHNICAL: "TECHNICAL",
    HR: "HR"
});

/**
 * -------   Evaluation types --------
 */
export const EVALUATION_TYPES = Object.freeze({
    CODING: "CODING",
    SYSTEM_DESIGN: "SYSTEM_DESIGN",
    DSA: "DSA",
    CS_FUNDAMENTALS: "CS_FUNDAMENTALS",
    BEHAVIORAL: "BEHAVIORAL"
});

/**
 * -------    Interview permissions ------
 */
export const INTERVIEW_PERMISSIONS = Object.freeze({
    CREATE_INTERVIEW: "CREATE_INTERVIEW",
    UPDATE_INTERVIEW: "UPDATE_INTERVIEW",
    CANCEL_INTERVIEW: "CANCEL_INTERVIEW",
    JOIN_INTERVIEW: "JOIN_INTERVIEW",
    SUBMIT_FEEDBACK: "SUBMIT_FEEDBACK",
    VIEW_FEEDBACK: "VIEW_FEEDBACK"
});

/**
 * System events ( for web sockets, etc.)
 */
export const INTERVIEW_EVENTS = Object.freeze({
    INTERVIEW_CREATED: "INTERVIEW_CREATED",
    INTERVIEW_UPDATED: "INTERVIEW_UPDATED",
    INTERVIEW_STARTED: "INTERVIEW_STARTED",
    INTERVIEW_COMPLETED: "INTERVIEW_COMPLETED",
    INTERVIEW_CANCELLED: "INTERVIEW_CANCELLED",
    FEEDBACK_SUBMITTED: "FEEDBACK_SUBMITTED"
});

/**
 * Time & system limits
 */
export const INTERVIEW_LIMITS = Object.freeze({
    MAX_DURATION_MINUTES: 180,
    MIN_DURATION_MINUTES: 15,
    JOIN_BUFFER_MINUTES: 10,      // candidate can join early
    FEEDBACK_EDIT_WINDOW_HOURS: 24
});