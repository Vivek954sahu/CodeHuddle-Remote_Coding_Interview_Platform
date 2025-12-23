import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;


//  Logging format

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Logger
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ?  "info" : "debug",
    format: combine(
        errors({stack : true }),
        timestamp({ format : "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: process.env.NODE_ENV === "production"
            ? combine(timestamp(), logFormat)
            : combine(colorize(), logFormat),
        }),
    ],
});

/*  Morgan stream support */
logger.http = (message) => {
    logger.info(message);
};