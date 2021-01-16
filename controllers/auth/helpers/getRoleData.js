const { msg } = require("../../_msgs/auth");
const getFirstName = require("../../../utils/string/getFirstName");
const Account = require("../../../models/user/Account");

// ROLES
const handleBizTeamData = ({ data, appId }) => {
    const { _id, name, role, gender, pswd, bizTeamData } = data;

    return {
        name,
        role,
        gender,
        pswd,
        authUserId: _id,
        primaryAgent: bizTeamData && bizTeamData.primaryAgent,
        agentJob: bizTeamData && bizTeamData.job,
        uniqueLinkId: bizTeamData && bizTeamData.uniqueLinkId,
        publicKey: bizTeamData && bizTeamData.publicKey, // pagseguro's id for split
        redirectPayGatewayLink: `https://pagseguro.uol.com.br/v2/authorization/request.jhtml?code=${
            bizTeamData && bizTeamData.redirectAuthCode
        }`,
        appId,
    };
};

const handleCliAdminData = ({ data, cpf, appId }) => {
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
        appId,
    };
};

const handleCliMemberData = ({ data, appId }) => {
    const { _id, name, role, gender, clientMemberData } = data;

    return {
        name,
        role,
        gender,
        authUserId: _id,
        linkId: clientMemberData && clientMemberData.linkId,
        memberJob: clientMemberData && clientMemberData.job,
        bizId: clientMemberData && clientMemberData.bizId,
        appId,
    };
};

const handleCliUserData = ({ data, token, appId }) => {
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
        appId,
    };
};
// END ROLES

async function getRoleData(role, options = {}) {
    const { data, token, cpf } = options;

    const appData = await Account.findOne({ checkId: cpf }).select(
        "-_id defaultAppId"
    );

    const appId = appData.defaultAppId;

    switch (role) {
        case "nucleo-equipe":
            return handleBizTeamData({ data, appId });
        case "cliente-admin":
            return handleCliAdminData({ data, cpf, appId });
        case "cliente-membro":
            return handleCliMemberData({ data, appId });
        case "cliente":
            return handleCliUserData({ data, token, appId });
        default:
            return console.log(`The role ${role} was not found!`);
    }
}

module.exports = getRoleData;
