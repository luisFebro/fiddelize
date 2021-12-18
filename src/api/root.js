const IS_PROD = process.env.NODE_ENV === "production";
// ROOT DOMAIN

// In a branch feature, set staging in api/root.js (frontend) when required to test in staging production when devoloping a new feature.
// IMPORTANT: this should be set to false when merging to master.
// it is recommended to set to false right after making a deploy
const IS_STAGING = false;

const prodLink = IS_STAGING
    ? "https://fiddelize-test.herokuapp.com/api"
    : "https://fiddelize.herokuapp.com/api";

exports.IS_STAGING = IS_STAGING;
exports.ROOT = IS_PROD ? prodLink : "http://localhost:5000/api";

const getRootDomain = () =>
    IS_PROD ? prodLink.replace("/api", "") : "http://localhost:5000";

exports.ROOT_DOMAIN = getRootDomain();
