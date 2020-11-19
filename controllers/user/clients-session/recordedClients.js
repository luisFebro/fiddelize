const User = require("../../../models/user");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { decryptSync, jsDecrypt } = require("../../../utils/security/xCipher");
const {
    getChunksTotal,
    getSkip,
} = require("../../../utils/array/getDataChunk");

const getQuery = (role) => {
    let mainQuery;
    const me = { _id: { $ne: ObjectId("5e360888051f2617d0df2245") } };
    const adminStaffQuery = {
        $or: [
            { role: "client-admin" },
            { role: "admin" },
            { role: "colaborador" },
        ],
    };
    const withNonEmptyArray = { $exists: true, $ne: [] }; // staffBookingList: withNonEmptyArray}

    switch (role) {
        case "cliente":
            mainQuery = {
                $or: [{ role: "cliente" }, { role: "cliente-admin" }],
            }; // for test mode in the dashboard, it is requires to search both client and client-admin;
            break;
        case "cliente-admin":
            mainQuery = { role: "cliente-admin" };
            break;
        case "colaborador":
            // This is not being used. Check getStaffWithBookings in admin
            mainQuery = { role: "colaborador" };
            break;
        case "colaborador-e-admin":
            mainQuery = { $and: [me, adminStaffQuery] };
            break;
        default:
            mainQuery = {};
    }
    return {
        mainQuery,
    };
};

const handleFilter = (filter) => {
    const defaultSort = { role: -1 }; // for always sort considering client-admin as priority as test mode to be easy to be detected at client history.

    if (filter === "alphabeticOrder" || filter === "alphabeticOrderZA") {
        return {
            $sort: {
                ...defaultSort,
                name: filter === "alphabeticOrder" ? 1 : -1,
            },
        };
    }

    if (filter === "birthdayCustomers") {
        return {
            $sort: { ...defaultSort, "clientUserData.filterBirthday": 1 },
        };
    }

    if (filter === "buyMoreCustomers" || filter === "buyLessCustomers") {
        return {
            $sort: {
                ...defaultSort,
                "clientUserData.totalGeneralScore":
                    filter === "buyMoreCustomers" ? -1 : 1,
            },
        };
    }

    if (filter === "newCustomers" || filter === "veteranCustomers") {
        return {
            $sort: {
                ...defaultSort,
                createdAt: filter === "newCustomers" ? -1 : 1,
            },
        };
    }

    if (filter === "highestActiveScores" || filter === "lowestActiveScores") {
        return {
            $sort: {
                ...defaultSort,
                "clientUserData.currScore":
                    filter === "highestActiveScores" ? -1 : 1,
            },
        };
    }

    if (
        filter === "highestSinglePurchases" ||
        filter === "lowestSinglePurchases"
    ) {
        return {
            $sort: {
                ...defaultSort,
                "clientUserData.filterHighestPurchase":
                    filter === "highestSinglePurchases" ? -1 : 1,
            },
        };
    }

    if (filter === "lastPurchases" || filter === "firstPurchases") {
        return {
            $sort: {
                ...defaultSort,
                "clientUserData.filterLastPurchase":
                    filter === "lastPurchases" ? -1 : 1,
            },
        };
    }
};

const handlePeriod = (period, options = {}) => {
    const { day, week, month, year } = options;

    switch (period) {
        case "all":
            return;
        case "day":
            return { "filter.day": parseInt(day) }; // e.g 4
        case "week":
            return { "filter.week": week }; // e.g w:31_6.m:9.y:2020
        case "month":
            return { "filter.month": month }; // e.g m:9.y:2020
        case "year":
            return { "filter.year": parseInt(year) }; // e.g 2020
        default:
            return;
    }
};

const handleEmptyType = ({ search, sideTotalSize }) => {
    // choose the right illustration on frontend
    if (!sideTotalSize) return "virgin";
    if (search) return "search";
    return "filter";
};

exports.getRecordedClientList = (req, res) => {
    // n3 - New way of fetching data with $facet aggreagtion
    const {
        role,
        filter,
        search,
        period,
        day,
        week,
        month,
        year,
        bizId,
    } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const skip = getSkip(parseInt(req.query.skip), limit);

    const periodQuery = handlePeriod(period, { day, week, month, year });
    const sortQuery = handleFilter(filter);
    const skipQuery = { $skip: skip };
    const limitQuery = { $limit: limit };
    const countQuery = { $count: "value" };
    const searchQuery = { name: { $regex: `${search}`, $options: "i" } };
    const bizIdQuery = { "clientUserData.bizId": bizId };
    const totalUserGeneralScoresQuery = {
        $group: {
            _id: null,
            value: { $sum: "$clientUserData.totalGeneralScore" },
        },
    };
    const totalActiveScoresQuery = {
        $group: {
            _id: null,
            value: { $sum: "$clientUserData.totalActiveScore" },
        },
    };

    let { mainQuery } = getQuery(role);

    mainQuery = Object.assign({}, mainQuery, bizIdQuery, periodQuery);
    const sideQuery = Object.assign({}, mainQuery, bizIdQuery); // track total of items to set period illustration when empty

    if (search) {
        mainQuery = Object.assign({}, mainQuery, searchQuery);
    }

    User(role)
        .aggregate([
            {
                $facet: {
                    sideTotalSize: [{ $match: sideQuery }, countQuery],
                    list: [
                        { $match: mainQuery },
                        sortQuery,
                        skipQuery,
                        limitQuery,
                    ],
                    totalSize: [{ $match: mainQuery }, countQuery],
                    totalCliUserScores: [
                        { $match: mainQuery },
                        totalUserGeneralScoresQuery,
                    ],
                    totalActiveScores: [
                        { $match: mainQuery },
                        totalActiveScoresQuery,
                    ],
                },
            },
        ])
        .then((docs) => {
            let {
                sideTotalSize,
                list,
                totalSize,
                totalCliUserScores,
                totalActiveScores,
            } = docs[0];

            const emptyType = handleEmptyType({ search, sideTotalSize });

            // remove sensitive cli-admin data
            // note: check if notification will be include to be excluded too
            const isCliAdmin = list.length && list[0].role === "cliente-admin"; // always the first object if available
            if (isCliAdmin) {
                delete list[0].clientAdminData;
            }

            const treatedList = list.map((profile) => {
                return {
                    ...profile,
                    cpf: jsDecrypt(profile.cpf),
                    email: decryptSync(profile.email),
                    phone: decryptSync(profile.phone),
                };
            });

            totalCliUserScores =
                totalCliUserScores[0] === undefined
                    ? 0
                    : totalCliUserScores[0].value;
            totalActiveScores =
                totalActiveScores[0] === undefined
                    ? 0
                    : totalActiveScores[0].value;

            const listTotal =
                totalSize[0] === undefined ? 0 : totalSize[0].value;

            res.json({
                list: treatedList,
                chunksTotal: getChunksTotal(listTotal, limit),
                listTotal,
                content: `totalCliUserScores:${totalCliUserScores};totalActiveScores:${totalActiveScores};emptyType:${emptyType};`,
            });
        });
};

exports.getHighestScores = (req, res) => {
    const bizId = req.query.bizId;

    // ATENTION: need to insert the name or code of biz since now the user can have multi accounts;

    User("cliente")
        .find({ "clientUserData.bizId": bizId })
        .select("name clientUserData.totalGeneralScore -_id")
        .sort({ "clientUserData.totalGeneralScore": -1 })
        .limit(3)
        .exec((err, data) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            if (data.length) {
                const rankingList = data.map((client) => {
                    const name = client.name;
                    const score = client.clientUserData.totalGeneralScore;
                    return { name, score };
                });

                return res.json(rankingList);
            }
            res.json([]);
        });
};

/* COMMENTS
n1:
Need test this in future implementation in the effort to cut down more the boilerplate
in the current working implementation:
db.collection.aggregate([

     //{$sort: {...}}

     //{$match:{...}}

     {$facet:{

       "stage1" : [ $group:{_id:null, count:{$sum:1}} ],

       "stage2" : [ { "$skip": 0}, {"$limit": 2} ]

     }},


    {$unwind: "$stage1"},

     //output projection
    {$project:{
       count: "$stage1.count",
       data: "$stage2"
    }}

]);
*/
