/**
 * Interview Constants for enums and configs
 */

/**
 * -------    Interview Life Cycle   -----------
 */
export const INTERVIEW_STATUS = Object.freeze({
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
