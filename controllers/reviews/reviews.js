const User = require("../../models/user/User");
const getFinalGrade = require("./helpers.js");
const getFirstName = require("../../utils/string/getFirstName");
const { getChunksTotal, getSkip } = require("../../utils/array/getDataChunk");
const getPercentage = require("../../utils/number/perc/getPercentage");
const startOfWeek = require("date-fns/startOfWeek");
const addDays = require("date-fns/addDays");

exports.getReviewMainData = async (req, res) => {
    const { userId } = req.query;

    const mainQuery = { "clientUserData.bizId": userId };
    const countQuery = { $count: "total" };

    // NPS SEARCH PARAMS
    const detractorsQuery = {
        $match: { "clientUserData.review.nps": { $lte: 6 } },
    };
    const passivesQuery = {
        $match: { "clientUserData.review.nps": { $gte: 7, $lte: 8 } },
    };
    const promotorsQuery = {
        $match: { "clientUserData.review.nps": { $gte: 9, $lte: 10 } },
    };

    const xpQuery = {
        $match: { "clientUserData.review.xpScore": { $gte: 0 } },
    };
    const xpSumQuery = {
        $group: {
            _id: null,
            total: { $sum: "$clientUserData.review.xpScore" },
        },
    };

    const adminData = await User("cliente-admin")
        .findById(userId)
        .select("clientAdminData.reviewLastChecked");
    const lastDateChecked =
        adminData && adminData.clientAdminData.reviewLastChecked;

    const uncheckedReviewsQuery = {
        ...mainQuery,
        "clientUserData.review.reportUpdatedAt": {
            $gte: new Date(lastDateChecked),
        },
    };

    // LESSON: $facet accepts only arrays
    const docs = await User("cliente").aggregate([
        {
            $facet: {
                // "list": [
                //     { $match: mainQuery },
                //     { $project : { "_id": 0, "clientUserData.review.xpScore": 1, "clientUserData.review.nps": 1 } },
                // ],
                detractors: [detractorsQuery, countQuery],
                passives: [passivesQuery, countQuery],
                promoters: [promotorsQuery, countQuery],
                totalReviews: [{ $match: mainQuery }, countQuery],
                xpSum: [xpQuery, xpSumQuery],
                uncheckedReviews: [
                    { $match: uncheckedReviewsQuery },
                    countQuery,
                ],
            },
        },
        { $unwind: { path: "$detractors", preserveNullAndEmptyArrays: true } }, // n2
        { $unwind: { path: "$passives", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$promoters", preserveNullAndEmptyArrays: true } },
        {
            $unwind: {
                path: "$totalReviews",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $unwind: { path: "$xpSum", preserveNullAndEmptyArrays: true } },
        {
            $unwind: {
                path: "$uncheckedReviews",
                preserveNullAndEmptyArrays: true,
            },
        },
        // if none value found, the path is not included in the result.
    ]);

    let {
        detractors,
        passives,
        promoters,
        totalReviews,
        xpSum,
        uncheckedReviews,
    } = docs[0];

    uncheckedReviews = uncheckedReviews ? uncheckedReviews.total : 0;

    detractors = detractors ? detractors.total : 0;
    passives = passives ? passives.total : 0;
    promoters = promoters ? promoters.total : 0;
    totalReviews = totalReviews ? totalReviews.total : 0;

    xpSum = xpSum ? xpSum.total : 0;

    let xpScore = xpSum / totalReviews;
    xpScore = Number.isNaN(xpScore)
        ? 0
        : Number.isInteger(xpScore)
        ? xpScore
        : xpScore.toFixed(1);

    const percDetractors = getPercentage(totalReviews, detractors);
    const percPassives = getPercentage(totalReviews, passives);
    const percPromoters = getPercentage(totalReviews, promoters);

    const nps = Math.round(percPromoters - percDetractors);

    res.json({
        detractors: {
            perc: percDetractors,
            total: detractors,
        },
        passives: {
            perc: percPassives,
            total: passives,
        },
        promoters: {
            perc: percPromoters,
            total: promoters,
        },
        nps,
        xpScore: Number(xpScore),
        uncheckedReviews,
        lastDateChecked,
    });
};

// GET
exports.getBuyReviewsList = async (req, res) => {
    const { userId, skip = 0, limit = 10, filterBy = "all" } = req.query;

    const skipQuery = { $skip: Number(skip) };
    const limitQuery = { $limit: Number(limit) };
    const countQuery = { $count: "value" };
    const sortQuery = {
        $sort: { "clientUserData.review.reportUpdatedAt": -1 },
    };

    const mainQuery = { "clientUserData.bizId": userId };

    // $project value 1 returns the specific field, meanwhile 0 exclude it.
    const docs = await User("cliente").aggregate([
        {
            $facet: {
                list: [
                    { $match: mainQuery },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            "clientUserData.review": 1,
                        },
                    },
                    sortQuery,
                    skipQuery,
                    limitQuery,
                ],
                totalSize: [{ $match: mainQuery }, countQuery],
            },
        },
    ]);

    if (!docs) return res.json({ list: [] });
    const { list, totalSize } = docs[0];

    const listTotal = totalSize[0] === undefined ? 0 : totalSize[0].value;

    let treatedList = [];
    const needFilter = filterBy !== "all";
    list.forEach((re) => {
        const data = re.clientUserData.review;
        const { xpScore, nps, reportUpdatedAt, buyReport } = data;

        const finalGrade = getFinalGrade({ xp: xpScore, nps });

        const pushData = () => {
            treatedList.push({
                review: buyReport,
                reportUpdatedAt,
                clientName: getFirstName(re.name, { addSurname: true }),
                finalGrade,
            });
        };

        if (needFilter) {
            const isFilterLow = filterBy === "lowGrades" && finalGrade <= 6;
            const isFilterHigh = filterBy === "highGrades" && finalGrade > 6;
            if (isFilterLow) return pushData();
            if (isFilterHigh) return pushData();
        } else {
            pushData();
        }
    });

    return res.json({
        list: treatedList,
        chunksTotal: getChunksTotal(
            needFilter ? treatedList.length : listTotal,
            limit
        ),
        listTotal,
    });
};

exports.getNpsChartData = async (req, res) => {
    const { userId, lastTotalPromoters, lastTotalDetractors } = req.query;

    const mainQuery = {
        "clientUserData.bizId": userId,
    };

    const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const monD = new Date(startWeek).setUTCHours(0, 0, 0, 0);
    const tueD = addDays(new Date(startWeek), 1).setUTCHours(0, 0, 0, 0);
    const wedD = addDays(new Date(tueD), 1).setUTCHours(0, 0, 0, 0);
    const thuD = addDays(new Date(wedD), 1).setUTCHours(0, 0, 0, 0);
    const friD = addDays(new Date(thuD), 1).setUTCHours(0, 0, 0, 0);
    const satD = addDays(new Date(friD), 1).setUTCHours(0, 0, 0, 0);
    const sunD = addDays(new Date(satD), 1).setUTCHours(0, 0, 0, 0);

    const npsSumQuery = {
        $group: { _id: null, total: { $sum: "$clientUserData.review.nps" } },
    };
    const monQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(monD),
            $lt: new Date(tueD),
        },
    };
    const tueQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(tueD),
            $lt: new Date(wedD),
        },
    };
    const wedQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(wedD),
            $lt: new Date(thuD),
        },
    };
    const thuQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(thuD),
            $lt: new Date(friD),
        },
    };
    const friQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(friD),
            $lt: new Date(satD),
        },
    };
    const satQuery = {
        "clientUserData.review.npsUpdatedAt": {
            $gte: new Date(satD),
            $lt: new Date(sunD),
        },
    };
    const sunQuery = {
        "clientUserData.review.npsUpdatedAt": { $gte: new Date(sunD) },
    };

    // const countQuery = { $count: "total" };
    const docs = await User("cliente").aggregate([
        {
            $facet: {
                mon: [{ $match: { ...mainQuery, ...monQuery } }, npsSumQuery],
                tue: [{ $match: { ...mainQuery, ...tueQuery } }, npsSumQuery],
                wed: [{ $match: { ...mainQuery, ...wedQuery } }, npsSumQuery],
                thu: [{ $match: { ...mainQuery, ...thuQuery } }, npsSumQuery],
                fri: [{ $match: { ...mainQuery, ...friQuery } }, npsSumQuery],
                sat: [{ $match: { ...mainQuery, ...satQuery } }, npsSumQuery],
                sun: [{ $match: { ...mainQuery, ...sunQuery } }, npsSumQuery],
            },
        },
        { $unwind: { path: "$mon", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$tue", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$wed", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$thu", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fri", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$sat", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$sun", preserveNullAndEmptyArrays: true } },
    ]);

    let { mon, tue, wed, thu, fri, sat, sun } = docs[0];
    mon = mon ? mon.total : 0;
    tue = tue ? tue.total : 0;
    wed = wed ? wed.total : 0;
    thu = thu ? thu.total : 0;
    fri = fri ? fri.total : 0;
    sat = sat ? sat.total : 0;
    sun = sun ? sun.total : 0;

    res.json({
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
    });
};

/* COMMENTS
n1: $elemMatch

this would only work with array
const condPassives = { $elemMatch: { $gt: 6, $lte: 8 } }

{ _id: 1, results: [ 82, 85, 88 ] }
{ _id: 2, results: [ 75, 88, 89 ] }
The following query matches only those documents where the results array contains at least one element that is both greater than or equal to 80 and is less than 85:

db.scores.find(
   { results: { $elemMatch: { $gte: 80, $lt: 85 } } }
)
The query returns the following document since the element 82 is both greater than or equal to 80 and is less than 85:

{ "_id" : 1, "results" : [ 82, 85, 88 ] }

$unwind - desenrolar, desbobinar (undo or be undone after winding or being wound.
Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
this:
"passives": [
    {
        "total": 1
    }
],
becomes this:
"passives": {
    "total": 1
}

*/
