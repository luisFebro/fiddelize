const CliAdmin = require("./roles/CliAdmin");
const CliMember = require("./roles/CliMember");
const CliUser = require("./roles/CliUser");
const BizTeam = require("./roles/BizTeam");
const { roleTypes } = require("./schemes/data-by-role/main");

const store = {
    cliente: CliUser,
    "cliente-admin": CliAdmin,
    "cliente-membro": CliMember,
    equipe: BizTeam,
};

const User = (role) => {
    if (!roleTypes.includes(role))
        return console.log(
            "ERROR: This role does not exist. Only these set: " + roleTypes
        );

    return store[role];
};

module.exports = User;
