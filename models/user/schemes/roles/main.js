const ClientMemberSchema = require("./clientMember");
const BizTeamSchema = require("./bizTeam");
const ClientUserSchema = require("./clientUser");
const ClientAdminSchema = require("./clientAdmin");

const roleTypes = [
    "cliente", // cliente-usuario
    "cliente-admin",
    "cliente-membro",
    "dev",
    "rep-vendas",
    "afiliado",
];

module.exports = {
    BizTeamSchema,
    ClientAdminSchema,
    ClientMemberSchema,
    ClientUserSchema,
    roleTypes,
};
