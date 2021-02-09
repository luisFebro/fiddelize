const User = require("../../models/user");

exports.assignValueToObj = (arrayOfObjs, property, newValue) => {
    return (
        arrayOfObjs &&
        arrayOfObjs.map((notification) => {
            notification[property] = newValue;
            return notification;
        })
    );
};

exports.findIdAndAssign = (
    arrayOfObjs,
    id,
    property,
    newValue,
    options = {}
) => {
    const { alsoObj } = options;

    return (
        arrayOfObjs &&
        arrayOfObjs.map((notification) => {
            if (notification._id.toString() === id) {
                notification[property] = newValue;
                if (alsoObj) {
                    notification[alsoObj.prop] = alsoObj.value;
                }
            }
            return notification;
        })
    );
};

exports.pickDataByProfile = (profileData, options = {}) => {
    let { role } = profileData;
    const { forceCliUser, pickDataByProfile } = options;

    if (forceCliUser) role = "cliente";

    switch (role) {
        case "cliente":
            return profileData.clientUserData.notifications;
        case "cliente-admin":
            return profileData.clientAdminData.notifications;
        case "cliente-membro":
            return profileData.clientMemberData.notifications;
        default:
            console.log("smt wrong with pickDataByProfile");
    }
};

exports.pickObjByRole = (role, options = {}) => {
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
        case "cliente-membro":
            return { "clientMemberData.notifications": handledData };
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

exports.handleNotifRolePath = ({ role, forceCliUser }) => {
    if (role === "cliente-admin") return "clientAdminData";
    if (role === "cliente-membro") return "clientMemberData";
    if (role === "cliente" || forceCliUser) return "clientUserData";
};

exports.getTotalNotifDB = async ({ userId, role, rolePath, bizId }) => {
    const checkCliAdminDB = bizId;
    role = checkCliAdminDB ? "cliente-admin" : role;
    rolePath = checkCliAdminDB ? "clientAdminData" : rolePath;

    let query;
    if (checkCliAdminDB) {
        query = { _id: bizId, role: "cliente-admin" };
    } else {
        query = { _id: userId, role };
    }

    const data = await User(role)
        .find(query)
        .select(`${rolePath}.notifications -_id`);
    if (data && !data.length) return 0;

    const notifs = data[0][rolePath]["notifications"];
    const totalFilteredNotifs = notifs.filter((notif) => {
        const isNew = notif.clicked === false;
        if (checkCliAdminDB) {
            return notif.subtype === "clientWonChall" && isNew;
        }
        return isNew;
    });

    return totalFilteredNotifs.length;
};

exports.getAdminChallengesNotif = async ({ bizId }) => {
    const data = await User("cliente-admin")
        .find({ _id: bizId, role: "cliente-admin" })
        .select(`clientAdminData.notifications -_id`);
    if (data && !data.length) return 0;

    const notifs = data[0]["clientAdminData"]["notifications"];
    const totalFilteredNotifs = notifs.filter((notif) => {
        const isNew = notif.clicked === false;
        return notif.subtype === "clientWonChall" && isNew;
    });

    return totalFilteredNotifs;
};
