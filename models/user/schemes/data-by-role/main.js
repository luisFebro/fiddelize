const ClientMemberSchema = require("./clientMember");
const BizTeamSchema = require("./bizTeam");
const ClientUserSchema = require("./clientUser");
const ClientAdminSchema = require("./clientAdmin");

const roleTypes = [
    "cliente", // cliente-usuario
    "cliente-admin",
    "cliente-membro",
    "nucleo-equipe",
];

const getRoleDataName = (role) => {
    if (role === "cliente") return "clientUserData";
    if (role === "cliente-admin") return "clientAdminData";
    if (role === "cliente-membro") return "clientMemberData";
    if (role === "nucleo-equipe") return "bizTeamData";
};

module.exports = {
    BizTeamSchema,
    ClientAdminSchema,
    ClientMemberSchema,
    ClientUserSchema,
    roleTypes,
    getRoleDataName,
};
