const User = require("../models/user");
const { msgG } = require("./_msgs/globalMsgs");
const { getDataChunk, getChunksTotal } = require("../utils/array/getDataChunk");

// UTILS
const assignValueToObj = (arrayOfObjs, property, newValue) => {
    return (
        arrayOfObjs &&
        arrayOfObjs.map((notification) => {
            notification[property] = newValue;
            return notification;
        })
    );
};

const findIdAndAssign = (arrayOfObjs, id, property, newValue) => {
    return (
        arrayOfObjs &&
        arrayOfObjs.map((notification) => {
            if (notification._id.toString() === id) {
                notification[property] = newValue;
            }
            return notification;
        })
    );
};

const pickDataByProfile = (profileData, options = {}) => {
    let { role } = profileData;
    const { forceCliUser } = options;

    if (forceCliUser) role = "cliente";

    switch (role) {
        case "cliente":
            return profileData.clientUserData.notifications;
        case "cliente-admin":
            return profileData.clientAdminData.notifications;
        default:
            console.log("smt wrong with pickDataByProfile");
    }
};

const pickObjByRole = (role, options = {}) => {
    const { data, needUnshift } = options;
    let handledData;
    needUnshift
        ? (handledData = { $each: [data], $position: 0 }) // $each needs $push asn precedent operator, otherwise it will fail
        : (handledData = data);

    // trimming data
    if (data.recipient) {
        delete data.recipient;
    }

    switch (role) {
        case "cliente-admin":
            return { "clientAdminData.notifications": handledData };
        case "cliente":
            return { "clientUserData.notifications": handledData };
        case "ambos-clientes":
            return {
                "clientAdminData.notifications": handledData,
                "clientUserData.notifications": handledData,
            };
        default:
            console.log("smt wrong with pickObjByRole");
    }
};
// END UTILS

// Method: Get
exports.countPendingNotif = async (req, res) => {
    let { userId, role, forceCliUser } = req.query;
    forceCliUser = forceCliUser === "true";

    let rolePath;
    role === "cliente-admin"
        ? (rolePath = "clientAdminData")
        : (rolePath = "clientUserData");

    if (forceCliUser) rolePath = "clientUserData";

    User(role)
        .find({ _id: userId, role })
        .select(`${rolePath}.notifications -_id`)
        .exec((err, data) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err));
            if (!data[0]) return res.json({ total: 0 });
            if (!data[0][rolePath]) return res.json({ total: 0 });
            const notifs = data[0][rolePath]["notifications"];
            const totalFilteredNotifs = notifs.filter(
                (notif) => notif.clicked === false
            );
            res.json({ total: totalFilteredNotifs.length });
        });
};

exports.readNotifications = (req, res) => {
    let { forceCliUser, skip, limit = 5 } = req.query;
    forceCliUser = forceCliUser === "true";

    const data = pickDataByProfile(req.profile, { forceCliUser });

    const dataSize = data.length;
    const dataRes = {
        list: getDataChunk(data, { skip, limit }),
        chunksTotal: getChunksTotal(dataSize, limit),
        listTotal: dataSize,
        content: undefined,
    };

    res.json(dataRes);
};

// Method: Put
exports.sendNotification = (req, res) => {
    const dataToSend = req.body;

    const {
        recipient: { role, id: recipientId },
    } = dataToSend; // n1 - destructuring

    if (!recipientId)
        return res.status(400).json({ msg: "Missing recipient's ID" });
    if (!role)
        return res.status(400).json({
            msg:
                "You have to specify the target role which the notification should be sent: cliAdmin, cliUser",
        });

    const obj = pickObjByRole(role, { data: dataToSend, needUnshift: true });
    User(role)
        .findOneAndUpdate({ _id: recipientId }, { $push: obj }, { new: false })
        .select(
            "clientAdminData.notifications clientUserData.notifications clientMembersData.notifications"
        )
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({ msg: `the notification was sent to ${role}` });
        });
};

exports.sendBackendNotification = ({ notifData }) => {
    // required props: cardType, (subtype if any), recipient: { role, id, }}
    const {
        recipient: { role, id: recipientId },
    } = notifData;

    if (!recipientId)
        return res.status(400).json({ msg: "Missing recipient's ID" });
    if (!role)
        return res.status(400).json({
            msg:
                "You have to specify the target role which the notification should be sent: cliAdmin, cliUser",
        });

    const obj = pickObjByRole(role, { data: notifData, needUnshift: true });

    return User(role)
        .findOneAndUpdate({ _id: recipientId }, { $push: obj }, { new: false })
        .select("clientAdminData.notifications clientUserData.notifications");
};

// method: PUT
// LESSON: only need to compare like yourVar === true if it is a "true" as string, if you are using a body as for a put method, it does not need it.
exports.markOneClicked = (req, res) => {
    let forceCliUser = req.body.forceCliUser;

    let { _id, role } = req.profile;
    if (forceCliUser) role = "cliente";

    const { cardId } = req.query;

    const notifications = pickDataByProfile(req.profile, { forceCliUser });
    const resAction = findIdAndAssign(notifications, cardId, "clicked", true);
    const objToSet = pickObjByRole(role, { data: resAction });

    User(role)
        .findByIdAndUpdate(_id, objToSet, { new: false })
        .select("clientAdminData.notifications clientUserData.notifications")
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({
                msg: `notification with id ${cardId} marked as CLICKED`,
            });
        });
};

// method: PUT
// desc: this will set all "clicked" variables to true.
// this functionality will only appears if there is more than 5 not read notifications.
// if isImportant is true, then ignore it.
exports.markAllAsClicked = (req, res) => {
    let forceCliUser = req.body.forceCliUser;

    let { _id, role } = req.profile;
    if (forceCliUser) role = "cliente";

    const notifications = pickDataByProfile(req.profile, { forceCliUser });
    const resAction = assignValueToObj(notifications, "clicked", true);
    const objToSet = pickObjByRole(role, { data: resAction });

    User(role)
        .findByIdAndUpdate(_id, objToSet, { new: false })
        .select("clientAdminData.notifications clientUserData.notifications")
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({ msg: `all notifications were marked as CLICKED` });
        });
};

// method: PUT
// desc: this will set all isCardNew cards to false
exports.markAllAsSeen = (req, res) => {
    let forceCliUser = req.body.forceCliUser;

    let { _id, role } = req.profile;
    if (forceCliUser) role = "cliente";

    const notifications = pickDataByProfile(req.profile, { forceCliUser });
    const resAction = assignValueToObj(notifications, "isCardNew", false);
    const objToSet = pickObjByRole(role, { data: resAction });

    User(role)
        .findByIdAndUpdate(_id, objToSet, { new: false })
        .select("clientAdminData.notifications clientUserData.notifications")
        .exec((err, user) => {
            if (err)
                return res.status(500).json(msgG("error.systemError", err)); // NEED CREATE
            res.json({ msg: `all notifications was marked as SEEN` });
        });
};

/* COMMENTS
n1:
const { recipient: { role } } = dataToSend >>> This will destructure the role's property value.
const { recipient: role } = dataToSend >>> This will rename the property
*/
