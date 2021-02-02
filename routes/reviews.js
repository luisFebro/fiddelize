const express = require("express");
const router = express.Router();

const {
    getBuyReviewsList,
    getReviewMainData,
    getNpsChartData,
} = require("../controllers/reviews/reviews");

const { mwIsAuth } = require("../controllers/auth");
// const { mwUserId } = require("../controllers/user");

// @ routes api/reviews/...
router.get("/list/buy-reviews", mwIsAuth, getBuyReviewsList);
router.get("/main-data", getReviewMainData);
router.get("/nps-chart", getNpsChartData);
// router.param("userId", mwUserId);

module.exports = router;
