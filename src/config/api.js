const IS_PROD = process.env.NODE_ENV === "production";

exports.API = IS_PROD
        ? "https://fiddelize.herokuapp.com/api"
        : "http://localhost:5000/api";