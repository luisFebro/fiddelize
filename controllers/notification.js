const User = require('../models/user');
const { msgG } = require('./_msgs/globalMsgs');

// UTILS
const assignValueToObj = (arrayOfObjs, property, newValue) => {
    return arrayOfObjs && arrayOfObjs.map(notification => { notification[property] = newValue; return notification; });
}

const findIdAndAssign = (arrayOfObjs, id, property, newValue) => {
    return arrayOfObjs && arrayOfObjs.map(notification =>
        {
            if(notification._id.toString() === id) {
                notification[property] = newValue;
            }
            return notification;
        });
}

const pickDataByProfile = profileData => {
    const { role } = profileData;

    switch(role) {
        case "cliente":
            return profileData.clientUserData.notifications;
        case "cliente-admin":
            return profileData.clientAdminData.notifications;
        default:
            console.log("smt wrong with pickDataByProfile")
    }
}

const pickObjByRole = (role, options = {}) => {
    const { data, needUnshift } = options;
    let handledData;
    needUnshift
    ? handledData = { $each: [data], $position: 0 } // $each needs $push asn precedent operator, otherwise it will fail
    : handledData = data

    // trimming data
    if(data.recipient) {
        delete data.recipient;
    }

    switch(role) {
        case "cliente-admin":
            return { "clientAdminData.notifications": handledData };
        case "cliente":
            return { "clientUserData.notifications": handledData };
        default:
            console.log("smt wrong with pickObjByRole")
    }
}
// END UTILS

// Method: Get
exports.countPendingNotif = (req, res) => {
    const notificationsArray = pickDataByProfile(req.profile);
    if(!notificationsArray.length) return 0;
    const pendingNotif = notificationsArray.filter(notif => notif.clicked === false);

    res.json({ total: pendingNotif.length });
}

exports.readNotifications = (req, res) => {
    const data = pickDataByProfile(req.profile);
    res.json(data);
}

// Method: Put
exports.sendNotification = (req, res) => {
    const dataToSend = req.body;
    const { recipient: { role, id: recipientId } } = dataToSend; // n1 - destructuring

    if(!recipientId) return res.status(400).json({msg: "Missing recipient's ID"})
    if(!role) return res.status(400).json({msg: "You have to specify the target role which the notification should be sent: cliAdmin, cliUser"})

    const obj = pickObjByRole(role, { data: dataToSend, needUnshift: true });
    User.findOneAndUpdate({ _id: recipientId }, { $push: obj }, { new: false })
    .select("clientAdminData.notifications clientUserData.notifications")
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({ msg: `the notification were sent to ${role}`});
    });
}

// method: PUT
exports.markOneClicked = (req, res) => {
    const { _id, role } = req.profile;
    const { cardId } = req.query;
    const notifications = pickDataByProfile(req.profile);
    const resAction = findIdAndAssign(notifications, cardId, 'clicked', true);
    const objToSet = pickObjByRole(role, {data: resAction })

    User.findByIdAndUpdate(_id, objToSet, { new: false })
    .select("clientAdminData.notifications clientUserData.notifications")
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({ msg: `notification with id ${cardId} marked as CLICKED`});
    });
}

// method: PUT
// desc: this will set all "clicked" variables to true.
// this functionality will only appears if there is more than 5 not read notifications.
// if isImportant is true, then ignore it.
exports.markAllAsClicked = (req, res) => {
    const { _id, role } = req.profile;
    const notifications = pickDataByProfile(req.profile);
    const resAction = assignValueToObj(notifications, 'clicked', true);
    const objToSet = pickObjByRole(role, {data: resAction })

    User.findByIdAndUpdate(_id, objToSet, { new: false })
    .select("clientAdminData.notifications clientUserData.notifications")
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({ msg: `all notifications were marked as CLICKED`});
    });
}

// method: PUT
// desc: this will set all isCardNew cards to false
exports.markAllAsSeen = (req, res) => {
    const { _id, role } = req.profile;
    const notifications = pickDataByProfile(req.profile);
    const resAction = assignValueToObj(notifications, 'isCardNew', false);
    const objToSet = pickObjByRole(role, {data: resAction })

    User.findByIdAndUpdate(_id, objToSet, { new: false })
    .select("clientAdminData.notifications clientUserData.notifications")
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err)) // NEED CREATE
        res.json({ msg: `all notifications was marked as SEEN`});
    });
}

/* COMMENTS
n1:
const { recipient: { role } } = dataToSend >>> This will destructure the role's property value.
const { recipient: role } = dataToSend >>> This will rename the property
*/