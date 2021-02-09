const User = require("../../models/user");
const { msgG } = require("../_msgs/globalMsgs");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../utils/array/getDataChunk");
const {
    assignValueToObj,
    findIdAndAssign,
    pickDataByProfile,
    pickObjByRole,
    handleNotifRolePath,
    getTotalNotifDB,
    getAdminChallengesNotif,
} = require("./helpers");

// Method: Get
//
exports.countPendingNotif = async (req, res) => {
    let { userId, role, forceCliUser, forceCliMember, bizId } = req.query;
    forceCliUser = forceCliUser === "true";
    forceCliMember = forceCliMember === "true";

    const rolePath = handleNotifRolePath({
        role,
        forceCliUser,
        forceCliMember,
    });

    const defaultProps = {
        userId,
        role,
        rolePath,
    };

    let totalNotifs;
    if (bizId) {
        // need check cli-admin db for all challenges related notifs to be sync with all cli-members too
        const [totalMember, totalAdmin] = await Promise.all([
            getTotalNotifDB(defaultProps),
            getTotalNotifDB({ ...defaultProps, bizId }),
        ]);

        totalNotifs = totalMember + totalAdmin;
    } else {
        totalNotifs = await getTotalNotifDB(defaultProps);
    }

    return res.json({
        total: totalNotifs,
    });
};

exports.readNotifications = async (req, res) => {
    let { forceCliUser, skip, limit = 5, bizId } = req.query;
    forceCliUser = forceCliUser === "true";

    let data;
    data = pickDataByProfile(req.profile, { forceCliUser });
    if (bizId) {
        const adminNotif = await getAdminChallengesNotif({ bizId });
        data = [...adminNotif, ...data];
    }

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

exports.sendBackendNotification = async ({ notifData }) => {
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

    return await User(role)
        .findOneAndUpdate({ _id: recipientId }, { $push: obj }, { new: false })
        .select("clientAdminData.notifications clientUserData.notifications");
};

// method: PUT
// LESSON: only need to compare like yourVar === true if it is a "true" as string, if you are using a body as for a put method, it does not need it.
exports.markOneClicked = async (req, res) => {
    let forceCliUser = req.body.forceCliUser;

    let _id = req.params.userId;
    let { cardId, updatedBy, thisRole: role, cliMemberId } = req.query;
    if (forceCliUser) role = "cliente";
    let notifications = pickDataByProfile(req.profile, { forceCliUser });
    let options;

    const isCliMember = updatedBy;
    if (isCliMember) {
        // for now, cli-member only receives one welcome notification, all the rests are sync with cli-admin won challenges
        const cliMemberNotifs = await User("cliente-membro")
            .findById(cliMemberId)
            .select("clientMemberData.notifications -_id");
        const welcomeNotif =
            cliMemberNotifs &&
            cliMemberNotifs.clientMemberData.notifications[0];
        if (!welcomeNotif.clicked) {
            _id = cliMemberId;
            role = "cliente-membro";
            notifications = cliMemberNotifs.clientMemberData.notifications;
        }

        options = {
            alsoObj: {
                prop: "updatedBy",
                value: {
                    name: updatedBy,
                    updatedAt: new Date(),
                },
            },
        };
    }

    const resAction = findIdAndAssign(
        notifications,
        cardId,
        "clicked",
        true,
        options
    );
    const objToSet = pickObjByRole(role, { data: resAction });

    User(role)
        .findByIdAndUpdate(_id, objToSet, { new: false })
        .select(
            "clientAdminData.notifications clientMemberData.notifications clientUserData.notifications"
        )
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
