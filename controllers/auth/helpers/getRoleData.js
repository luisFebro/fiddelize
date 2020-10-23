const { msg } = require("../../_msgs/auth");
const getFirstName = require("../../../utils/string/getFirstName");

// ROLES
const handleCliAdminData = ({ data, cpf }) => {
    const { _id, name, role, clientAdminData } = data;

    // token only sent after password validation.
    return {
        name,
        role,
        authUserId: _id,
        bizCodeName: clientAdminData && clientAdminData.bizCodeName,
        verificationPass: clientAdminData && clientAdminData.verificationPass,
        twoLastCpfDigits: cpf && cpf.slice(-2),
    };
};

const handleCliUserData = ({ data, token }) => {
    const { _id, name, role, clientUserData } = data;

    return {
        name,
        role,
        token,
        authUserId: _id,
        bizId: (clientUserData && clientUserData.bizId) || "0",
        msg: msg("ok.welcomeBack", getFirstName(name), "onlyMsg"),
        needCliUserWelcomeNotif:
            clientUserData && !clientUserData.notifications.length,
    };
};
// END ROLES

function getRoleData(role, options = {}) {
    const { data, token, cpf } = options;

    switch (role) {
        case "cliente-admin":
            return handleCliAdminData({ data, cpf });
        case "cliente":
            return handleCliUserData({ data, token });
        default:
            console.log(
                "All keys are included in handleRolesData function at auth"
            );
            return allKeysStore;
    }
}

module.exports = getRoleData;
