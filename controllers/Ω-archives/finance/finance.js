const Finance = require("../../models/finance");
const User = require("../../models/user");
const { msgG } = require('../_msgs/globalMsgs');

// FINANCES CRUD
exports.create = (req, res) => {
    const newFinanceData = req.body;

    Finance.findOne({ agentName: req.body.agentName }) // duplicated data will be handled with prevent Default after clicking on submit.
    .exec((err, finance) => {
        // if(agentName) return res.status(400).json(msgG("error.alreadyAdded", "operação financeira"))
        const newFinanceOps = new Finance(newFinanceData);

        newFinanceOps.save((err, itemCreated) => {
            if (err) return res.status(500).json(msgG("error.systemError", err));
            res.json(msgG("ok.created", "Operação Financeira"));
        })
    })
}


// getCashOpsList
const getAutoCompleteList = (docs, search, limit) => {
    const searchData = [];

    const checkIfObjHasKeyAndPush = (docKey, mongoDoc) => {
        for(modelProperty in Finance.schema.paths) {
            if(modelProperty === docKey) {
                const value = mongoDoc[docKey];

                if(searchData.includes(value) || typeof value === "undefined") {
                    continue;
                }

                searchData.push(value);
            }
        }
    }

    docs.forEach(mongoDoc => {
        for(var docKey in mongoDoc) {
            checkIfObjHasKeyAndPush(docKey, mongoDoc)
        }
    })

    let matches = searchData.filter(substr => substr.toLowerCase().includes(search.toLowerCase()));
    matches = matches.slice(0, limit);

    return matches;
}

function handleSearch(search) {
    let cashInSearch;
    let cashOutSearch;

    // var user_input = new RegExp("le", 'i');
    let queries = [];
    let property;
    for (property in Finance.schema.paths) {
        const regEx = { $regex: `${search}`, $options: 'i'}

        if([
            "installmentsIfCredit",
            "cashOutValue",
            "cashInValue",
            "_id",
            "createdAt",
            "updatedAt",
            "__v"].includes(property)) {
            continue;
        }

        queries.push({ [property]: regEx });
    }

    cashInSearch = {$and: [{ cashInValue: { $gt: 0}}, { $or: queries }]};
    cashOutSearch = {$and: [{ cashOutValue: { $gt: 0}}, { $or: queries }]};

    return {
        cashInSearch,
        cashOutSearch,
    }
}


function getQuery(period, date, month, search) {
    let queryCashOut;
    let queryCashIn;
    switch(period) {
        case 'day':
            queryCashOut = { cashOutValue: { $gt: 0}, formattedDate: { $regex: `${date}`, $options: 'i'}};
            queryCashIn = { cashInValue: { $gt: 0}, formattedDate: { $regex: `${date}`, $options: 'i'}};
            break;
        case 'month':
            queryCashOut = { cashOutValue: { $gt: 0}, formattedDate: { $regex: `${month}`, $options: 'i'}};
            queryCashIn = { cashInValue: { $gt: 0}, formattedDate: { $regex: `${month}`, $options: 'i'}};
            break;
        case 'all':
            if(search) {
                const { cashOutSearch, cashInSearch } = handleSearch(search);
                queryCashOut = cashOutSearch;
                queryCashIn = cashInSearch;
                break;
            }
            queryCashOut = { cashOutValue: { $gt: 0}};
            queryCashIn = { cashInValue: { $gt: 0}};
            break;
        default:
            console.log("Something did not work in the query switch in getCashOpsList")
    }
    return {
        queryCashOut,
        queryCashIn,
    }
}

exports.getCashOpsList = (req, res) => {
    const period = req.params.period || "day";
    const search = req.query.search;
    const autocomplete = req.query.autocomplete || false;
    const date = req.query.thisDayMonth;
    const month = req.query.thisMonthYear;
    const skip = parseInt(req.query.skip);
    const limit = 5;

    const { queryCashOut, queryCashIn } = getQuery(period, date, month, search);

    if(search && autocomplete) {
        Finance.find({$or: [queryCashOut, queryCashIn]})
        .select("-installmentsIfCredit -cashOutValue -cashInValue -_id -createdAt -updatedAt -__v")
        .limit(7)
        .exec((err, docs) => {
            if (err) return res.status(500).json(msgG("error.systemError", err));
            const limit = 7;
            const finalSearch = getAutoCompleteList(docs, search, limit)
            res.json(finalSearch);
        })

        return;
    }

    const sortQuery = {$sort: {createdAt: -1, name: 1}};
    const skipQuery = {$skip: skip};
    const limitQuery = {$limit: limit};
    const countQuery = {$count: 'value'};
    const cashInSumAllQuery = {$group: { _id: null, value: { $sum: '$cashInValue' }}};
    const cashOutSumAllQuery = {$group: { _id: null, value: { $sum: '$cashOutValue' }}};
    const mergedPedingSum = Object.assign({}, queryCashIn, { statusCheck: 'pendente' });

    Finance.aggregate([
        {
            $facet: {
                cashInDocs: [{$match: queryCashIn}, sortQuery, skipQuery, limitQuery],
                cashInChunkSize: [{$match: queryCashIn}, skipQuery, limitQuery, countQuery],
                cashInTotalSize: [{$match: queryCashIn}, countQuery],
                cashInSumAll: [{$match: queryCashIn}, cashInSumAllQuery],
                pendingSum: [{$match: mergedPedingSum}, cashInSumAllQuery],
                //
                cashOutDocs: [{$match: queryCashOut}, sortQuery, skipQuery, limitQuery],
                cashOutChunkSize: [{$match: queryCashOut}, skipQuery, limitQuery, countQuery],
                cashOutTotalSize: [{$match: queryCashOut}, countQuery],
                cashOutSumAll: [{$match: queryCashOut}, cashOutSumAllQuery],
            }
        }
    ])
    .then(docs => {
        const {
            cashInDocs,
            cashInChunkSize,
            cashInTotalSize,
            cashInSumAll,
            pendingSum,
            cashOutDocs,
            cashOutChunkSize,
            cashOutTotalSize,
            cashOutSumAll,
        } = docs[0];

        res.json({
            cashInOps: {
                list: cashInDocs,
                chunkSize: cashInChunkSize[0] === undefined ? 0 : cashInChunkSize[0].value, // n1
                totalSize: cashInTotalSize[0] === undefined ? 0 : cashInTotalSize[0].value,
                sumAll: cashInSumAll[0] === undefined ? 0 : cashInSumAll[0].value,
                pendingSum: pendingSum[0] === undefined ? 0 : pendingSum[0].value,
            },
            cashOutOps: {
                list: cashOutDocs,
                chunkSize: cashOutChunkSize[0] === undefined ? 0 : cashOutChunkSize[0].value,
                totalSize: cashOutTotalSize[0] === undefined ? 0 : cashOutTotalSize[0].value,
                sumAll: cashOutSumAll[0] === undefined ? 0 : cashOutSumAll[0].value,
            },
        });
    })
    .catch(err => console.log("this error occured: ", err))
}
// end getCashOpsList

exports.update = (req, res) => {
    const itemId = req.params.itemId;

    Finance.findOneAndUpdate(
    { _id: itemId },
    { $set: req.body },
    { new: true })
    .exec((err, service) => {
        if (err) return res.status(500).json(msgG("error.systemError", err));
        res.json({
            service,
            msg: msgG("ok.updated", "Operação Financeira", "onlyMsg")
        });
    })
}

exports.remove = (req, res) => {
    const itemId = req.params.itemId;

    Finance.findByIdAndRemove(itemId)
    .exec((err, item) => {
        if(err || !item) return res.status(404).json(msgG("error.notFound", "Item"));
        res.json(msgG("ok.removedDoc", "Item"));
    });
}
// END FINANCES CRUD

// LISTS
// desc: for form select field
exports.getAllAvailableNames = (req, res) => {
    const roleQuery = req.query.role || "colaborador";

    let role = { role: roleQuery}
    if(roleQuery === "admin") {
        role = { $and: [{_id: { $ne: "5e360888051f2617d0df2245"}}, role] }
    }
    User.find(role)
    .select("name")
    .sort({ name: 1 })
    .exec((err, names) => {
        if (err) return res.status(400).json(msgG("error.systemError", err));
        const resArray = names.map(person => person.name)
        res.json(resArray);
    })
}
// END LISTS

/* COMMENTS
n1: here I set this condition because these document set are running skip and limit together.
If one document set got any more data to load, then I set it undefined to avoid error.
*/