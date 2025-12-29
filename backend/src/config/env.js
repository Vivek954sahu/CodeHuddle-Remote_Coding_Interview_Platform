import dotenv from "dotenv";

export const loadEnv = () => {
    dotenv.config();

    const requiredEnv = [
        "NODE_ENV",
        "PORT",
        "MONGODB_URI",
        "JWT_SECRET",
        "CLIENT_URL",

        // GOOGLE OAUTH LOGIN
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",

        // STREAM VIDEO/AUDIO CALL
        "STREAM_API_KEY",
        "STREAM_SECRET_KEY",

        // JUDGE0 CODE EXECUTER
        // "JUDGE0_API_URL",
        // "JUDGE0_API_KEY",

        // INNGEST 
        "INNGEST_EVENT_KEY",
    ];

    const missingEnv = requiredEnv.filter(
        (key) => !process.env[key]
    );

    if(missingEnv.length > 0){
        console.error("Missing required env variables:", missingEnv.join(", "));

        process.exit(1);
    }
}