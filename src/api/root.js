const IS_PROD = process.env.NODE_ENV === "production";
// ROOT DOMAIN

// set staging in api/root.js (frontend) when required to test in staging production when devoloping a new feature.
// IMPORTANT: this should be set to false when merging to master.
const IS_STAGING = false;

const prodLink = IS_STAGING
    ? "https://fiddelize-test.herokuapp.com/api"
    : "https://fiddelize.herokuapp.com/api";

exports.ROOT = IS_PROD ? prodLink : "http://localhost:5000/api";
