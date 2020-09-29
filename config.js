exports.CLIENT_URL =
    process.env.NODE_ENV === "production"
        ? "https://fiddelize.com.br"
        : "http://localhost:3000";

const ENVIRONMENT = process.env.NODE_ENV || "development";
exports.IS_PROD = ENVIRONMENT === "production";
