const User = require("../../models/user");
const BackupUser = require('../../models/backup/BackupUser');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { msgG } = require('../_msgs/globalMsgs');
const { msg } = require('../_msgs/user');
const validateEmail = require('../../utils/validation/validateEmail');

const { ObjectId } = mongoose.Types;

// fetching enum values exemple:
// console.log(User.schema.path("role").enumValues); [ 'admin', 'colaborador', 'cliente' ]

// MIDDLEWARES - mw
exports.mwUserId = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) return res.status(400).json(msg("error.notFound"));
        req.profile = user;
        next();
    });
};

exports.mwBackup = (req, res, next) => {
    const { name } = req.profile;
    const data = {
        subject: name,
        backup: req.profile
    }

    let backup = new BackupUser(data);

    backup.save((err => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        console.log(msgG("ok.backupSuccess", `do usuário ${name.toUpperCase()}`, 'onlyMsg'))
    }))

    next();
}
// END MIDDLEWARE

const assignToUndefined = (obj, keysArray) => {
    return keysArray.forEach(key => {
        obj[key] = undefined;
    })
}

exports.read = (req, res) => {
    const role = req.profile.role;
    const essencialData = req.query.onlyEssencialData;
    const clientAdminRequest = essencialData && role === "cliente-admin";
    if(clientAdminRequest) {
        assignToUndefined(req.profile, [
            "birthday", "password", "maritalStatus",
            "role", "name", "email", "cpf", "phone",
            "createdAt", "updatedAt", "__v"])
    } else {
        req.profile.password = undefined;
    }
    return res.json(req.profile);
};

exports.update = (req, res) => { // n2
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }) // real time updated! this send the most recently updated response/doc from database to app
    .exec((err, user) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(user);
    });
};

exports.remove = (req, res) => { //needs to put auth as middleware
    const user = req.profile;
    user.remove((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(msg('ok.userDeleted', data.name.toUpperCase()));
    });
}

exports.confirmUserAccount = (req, res) => {
    const { authUserId } = req.params
    User.findById(authUserId)
    .exec((err, user) => {
        if(!user) return res.status(404).json(msg('error.notFoundConfirmation'))
        if(err) return res.status(500).json(msgG('error.systemError', err));

        const { isUserConfirmed, name } = user;

        if(user && !isUserConfirmed) {
            User.findByIdAndUpdate(authUserId, { isUserConfirmed: true })
            .exec(err => {
                if(err) return res.status(500).json(msgG('error.systemError', err));
                res.json(msg('ok.userConfirmed', name));
            })
        }
        else {
            res.status(400).json(msg('error.userAlreadyConfirmed'))
        }
    })
}

exports.addElementArray = (req, res) => {
    const objToChange = req.body; // n2
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $push: objToChange }, { new: true })
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({
            user,
            msg: msgG('ok.added', 'onlyMsg')
        });
    });
}

exports.removeElementArray = (req, res) => {
    const objToChange = req.body;
    const _id = req.params.id;
    User.findByIdAndUpdate(_id, { $pull: objToChange }, { new: true })
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({
            user,
            msg: msgG('ok.removed', 'onlyMsg')
        });
    });
}

exports.removeField = (req, res) => { // n1
    let targetField = req.body.fieldToBeDeleted;
    User.findById(req.params.id)
    .exec((err, selectedUser) => {
        if(selectedUser[targetField] === "[]") return res.status(400).json(msgG("error.notRemovedField", targetField))

        selectedUser.set(targetField, undefined, {strict: false} );
        selectedUser.save(() => res.json(msgG("ok.removedField", targetField)))
    })
}

// LISTS
const getQuery = (role) => {
    let mainQuery;
    const me = {_id: { $ne: ObjectId("5e360888051f2617d0df2245")}};
    const adminStaffQuery = {"$or": [{role: "client-admin"}, {role: "admin"}, {role: "colaborador"}]};
    const withNonEmptyArray = { $exists: true, $ne: [] }; // staffBookingList: withNonEmptyArray}

    switch(role) {
        case 'cliente':
            mainQuery = { role: 'cliente' };
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
exports.getList = (req, res) => {
    const skip = parseInt(req.query.skip);
    const role = req.query.role;
    const search = req.query.search;

    const sortQuery = {$sort: { name: 1 }};
    const skipQuery = {$skip: skip};
    const limitQuery = {$limit: 5};
    const countQuery = {$count: 'value'};
    const searchQuery = {name: {$regex: `${search}`, $options: 'i'}};

    let { mainQuery } = getQuery(role);

    if(search) {
        mainQuery = Object.assign({}, mainQuery, searchQuery);
    }

    User.aggregate([
        {
            $facet: {
                list: [{$match: mainQuery}, sortQuery, skipQuery, limitQuery],
                chunkSize: [{$match: mainQuery}, skipQuery, limitQuery, countQuery],
                totalSize: [{$match: mainQuery}, countQuery],
            }
        }
    ])
    .then(docs => {
        const {
            list,
            chunkSize,
            totalSize
        } = docs[0];

        res.json({
            list,
            chunkSize: chunkSize[0] === undefined ? 0 : chunkSize[0].value,
            totalSize: totalSize[0] === undefined ? 0 : totalSize[0].value,
        })
    })
}

exports.getHighestScores = (req, res) => {
    User.find({})
    .select("name loyaltyScores")
    .sort({ 'loyaltyScores.currentScore': -1 })
    .limit(3)
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(data);
    });
}

exports.readBackup = (req, res) => {
    BackupUser.find({})
    .exec((err, data) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));
        res.json(data);
    });
}

// END LISTS

/* COMMENTS
n1: Only for objects with no default value. Need fix validation and it does not remove keys with default values.
n2: only update one specific key in the document, including objects like "key.prop".targetField. If you update an element of array, all the rest will be gone, updated.
In order to add/remove arrays use add/removeElementArray instead;
*/


/* ARCHIVES
exports.getStaffClientList = (req, res) => {
    const bookingArrayIds = req.profile.staffBookingList;
    const docsToSkip = parseInt(req.query.skip);

    let query;
    let limit;
    if(req.query.search) {
        query = {'clientName': { $regex: `${req.query.search}`, $options: "i" }}
        limit = 10;
    } else {
        query = {'_id': {$in: bookingArrayIds }}
        limit = 5;
    }

    StaffBooking.find(query)
    .exec((err, docs) => {
        const totalOfDocs = docs.length;

        StaffBooking.find(query)
        .sort({ 'status': -1, 'bookingDate': 1 })
        .skip(docsToSkip)
        .limit(limit)
        .exec((err, docs) => {
            if(err) return res.status(500).json(msgG('error.systemError', err));
            res.json({
                size: docs.length,
                totalSize: totalOfDocs,
                docs
            });
        });
    })
}
*/