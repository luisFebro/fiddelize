const CliAdmin = require("./roles/CliAdmin");
const CliMember = require("./roles/CliMember");
const CliUser = require("./roles/CliUser");
const BizTeam = require("./roles/BizTeam");
const { roleTypes } = require("./schemes/roles/main");

const store = {
    cliente: CliUser,
    "cliente-admin": CliAdmin,
    "cliente-membro": CliMember,
    equipe: BizTeam,
};

const User = (role, options = {}) => {
    const { newObj } = options;
    if (!roleTypes.includes(role))
        return console.log(
            "ERROR: This role does not exist. Only these set: " + roleTypes
        );

    if (newObj) return new store[role]();
    return store[role];
};

module.exports = User;
