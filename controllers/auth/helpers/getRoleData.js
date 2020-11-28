const { msg } = require("../../_msgs/auth");
const getFirstName = require("../../../utils/string/getFirstName");

// ROLES
const handleBizTeamData = ({ data, cpf }) => {
    const { _id, name, role, gender, clientAdminData } = data;

    return {
        name,
        role,
        authUserId: _id,
        bizCodeName: clientAdminData && clientAdminData.bizCodeName,
        gender,
    };
};

const handleCliAdminData = ({ data, cpf }) => {
    const { _id, name, role, gender, clientAdminData } = data;

    // token only sent after password validation.
    return {
        name,
        role,
        gender,
        authUserId: _id,
        bizCodeName: clientAdminData && clientAdminData.bizCodeName,
        verificationPass: clientAdminData && clientAdminData.verificationPass,
        twoLastCpfDigits: cpf && cpf.slice(-2),
    };
};

const handleCliMemberData = ({ data, cpf }) => {
    const { _id, name, role, gender, clientAdminData } = data;

    return {
        name,
        role,
        gender,
        authUserId: _id,
        bizCodeName: clientAdminData && clientAdminData.bizCodeName,
    };
};

const handleCliUserData = ({ data, token }) => {
    const { _id, name, role, gender, clientUserData } = data;

    return {
        name,
        role,
        token,
        gender,
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
        case "equipe":
            return handleBizTeamData({ data, cpf });
        case "cliente-admin":
            return handleCliAdminData({ data, cpf });
        case "cliente-membro":
            return handleCliMemberData({ data, cpf });
        case "cliente":
            return handleCliUserData({ data, token });
        default:
            return console.log(`The role ${role} was not found!`);
    }
}

module.exports = getRoleData;
