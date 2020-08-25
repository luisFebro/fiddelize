const User = require("../../../models/user");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { decryptSync, jsDecrypt } = require("../../../utils/security/xCipher");

const getQuery = (role) => {
    let mainQuery;
    const me = {_id: { $ne: ObjectId("5e360888051f2617d0df2245")}};
    const adminStaffQuery = {"$or": [{role: "client-admin"}, {role: "admin"}, {role: "colaborador"}]};
    const withNonEmptyArray = { $exists: true, $ne: [] }; // staffBookingList: withNonEmptyArray}

    switch(role) {
        case 'cliente':
            mainQuery = {$or: [{ role: 'cliente'}, {role: 'cliente-admin'}]}; // for test mode in the dashboard, it is requires to search both client and client-admin;
            break;
        case 'cliente-admin':
            mainQuery = { role: 'cliente-admin' };
            break;
        case 'colaborador':
             // This is not being used. Check getStaffWithBookings in admin
            mainQuery = { role: 'colaborador' };
            break;
        case 'colaborador-e-admin':
            mainQuery = {$and: [me, adminStaffQuery]}
            break;
        default:
            mainQuery = {};
    }
    return {
        mainQuery
    }
}

exports.getRecordedClientList = (req, res) => { // n3 - New way of fetching data with $facet aggreagtion
    const skip = parseInt(req.query.skip);
    const role = req.query.role;
    const search = req.query.search;
    const bizId = req.query.bizId;

    const defaultSort = { role: -1 }; // for always sort considering client-admin as priority as test mode to be easy to be detected at client history.
    const sortQuery = {$sort: { ...defaultSort, createdAt: -1 }};
    const skipQuery = {$skip: skip};
    const limitQuery = {$limit: 5};
    const countQuery = {$count: 'value'};
    const searchQuery = {name: {$regex: `${search}`, $options: 'i'}};
    const bizIdQuery = {"clientUserData.bizId": bizId};
    const totalUserGeneralScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalGeneralScore' }}}
    const totalActiveScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalActiveScore' }}}

    let { mainQuery } = getQuery(role);

    // For new bizId implementation
    mainQuery = Object.assign({}, mainQuery, bizIdQuery);

    if(search) {
        mainQuery = Object.assign({}, mainQuery, searchQuery);
    }

    User.aggregate([
        {
            $facet: {
                list: [{$match: mainQuery}, sortQuery, skipQuery, limitQuery],
                chunkSize: [{$match: mainQuery}, skipQuery, limitQuery, countQuery],
                totalSize: [{$match: mainQuery}, countQuery],
                totalCliUserScores: [{$match: mainQuery}, totalUserGeneralScoresQuery],
                totalActiveScores: [{$match: mainQuery}, totalActiveScoresQuery],
            }
        }
    ])
    .then(docs => {
        let {
            list,
            chunkSize,
            totalSize,
            totalCliUserScores,
            totalActiveScores,
        } = docs[0];

        // remove sensitive cli-admin data
        // note: check if notification will be include to be excluded too
        const isCliAdmin = list[0].role === "cliente-admin"; // always the first object if available
        if(isCliAdmin) { delete list[0].clientAdminData }

        const treatedList = list.map(profile => {
            return {
                ...profile,
                cpf: jsDecrypt(profile.cpf),
                email: decryptSync(profile.email),
                phone: decryptSync(profile.phone),
            }
        })

        totalCliUserScores = totalCliUserScores[0] === undefined ? 0 : totalCliUserScores[0].value,
        totalActiveScores = totalActiveScores[0] === undefined ? 0 : totalActiveScores[0].value,

        res.json({
            list: treatedList,
            chunksTotal: chunkSize[0] === undefined ? 0 : chunkSize[0].value,
            listTotal: totalSize[0] === undefined ? 0 : totalSize[0].value,
            content: `totalCliUserScores:${totalCliUserScores};totalActiveScores:${totalActiveScores};`,
        })
    })
}

exports.getHighestScores = (req, res) => {
    const bizId = req.query.bizId;

    User.find({ 'clientUserData.bizId': bizId })
    .select("name clientUserData.totalGeneralScore -_id")
    .sort({ 'clientUserData.totalGeneralScore': -1 })
    .limit(3)
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const name = data.name;
        const score = data.clientUserData.totalGeneralScore;
        res.json({ name, score });
    });
}


exports.getRecordedClientList = (req, res) => { // n1 - New way of fetching data with $facet aggreagtion
    const skip = parseInt(req.query.skip);
    const role = req.query.role;
    const search = req.query.search;
    const bizId = req.query.bizId;

    const defaultSort = { role: -1 }; // for always sort considering client-admin as priority as test mode to be easy to be detected at client history.
    const sortQuery = {$sort: { ...defaultSort, createdAt: -1 }};
    const skipQuery = {$skip: skip};
    const limitQuery = {$limit: 10};
    const countQuery = {$count: 'value'};
    const searchQuery = {name: {$regex: `${search}`, $options: 'i'}};
    const bizIdQuery = {"clientUserData.bizId": bizId};
    const totalUserGeneralScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalGeneralScore' }}}
    const totalActiveScoresQuery = {$group: { _id: null, value: { $sum: '$clientUserData.totalActiveScore' }}}

    let { mainQuery } = getQuery(role);

    // For new bizId implementation
    mainQuery = Object.assign({}, mainQuery, bizIdQuery);

    if(search) {
        mainQuery = Object.assign({}, mainQuery, searchQuery);
    }

    User.aggregate([
        {
            $facet: {
                list: [{$match: mainQuery}, sortQuery, skipQuery, limitQuery],
                chunkSize: [{$match: mainQuery}, skipQuery, limitQuery, countQuery],
                totalSize: [{$match: mainQuery}, countQuery],
                totalCliUserScores: [{$match: mainQuery}, totalUserGeneralScoresQuery],
                totalActiveScores: [{$match: mainQuery}, totalActiveScoresQuery],
            }
        }
    ])
    .then(docs => {
        let {
            list,
            chunkSize,
            totalSize,
            totalCliUserScores,
            totalActiveScores,
        } = docs[0];

        // remove sensitive cli-admin data
        // note: check if notification will be include to be excluded too
        const isCliAdmin = list.length && list[0].role === "cliente-admin"; // always the first object if available
        if(isCliAdmin) { delete list[0].clientAdminData }

        const treatedList = list.map(profile => {
            return {
                ...profile,
                cpf: jsDecrypt(profile.cpf),
                email: decryptSync(profile.email),
                phone: decryptSync(profile.phone),
            }
        })

        totalCliUserScores = totalCliUserScores[0] === undefined ? 0 : totalCliUserScores[0].value,
        totalActiveScores = totalActiveScores[0] === undefined ? 0 : totalActiveScores[0].value,

        res.json({
            list: treatedList,
            chunksTotal: chunkSize[0] === undefined ? 0 : chunkSize[0].value,
            listTotal: totalSize[0] === undefined ? 0 : totalSize[0].value,
            content: `totalCliUserScores:${totalCliUserScores};totalActiveScores:${totalActiveScores};`,
        })
    })
}

exports.getHighestScores = (req, res) => {
    const bizId = req.query.bizId;

    User.find({ 'clientUserData.bizId': bizId })
    .select("name clientUserData.totalGeneralScore -_id")
    .sort({ 'clientUserData.totalGeneralScore': -1 })
    .limit(3)
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        if(data.length) {
            const rankingList = data.map(client => {
                const name = client.name;
                const score = client.clientUserData.totalGeneralScore;
                return { name, score };
            })

            return res.json(rankingList)
        }
        res.json([]);
    });
}





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