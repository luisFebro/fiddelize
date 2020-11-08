const User = require("../../../models/user");
const { jsEncrypt } = require("../../../utils/security/xCipher");

exports.checkAccountLimit = (accounts, options = {}) => {
    const { currRole } = options;

    const isUnlimitedUser = currRole === "cliente";
    if (!accounts.length || isUnlimitedUser) return false;

    const MAX_ADMIN_APP = 3;
    const MAX_FIDDELIZE_APP = 1;
    const MAX_MEMBER_APP = 1;

    let appAdmin = 0;
    let appMember = 0;
    let appFiddelize = 0;
    // appClient unlimited

    const addCount = (role) => {
        switch (role) {
            case "cliente-admin":
                ++appAdmin;
                break;
            case "cliente-membro":
                ++appMember;
                break;
            case "equipe":
                ++appFiddelize;
                break;
        }
    };

    accounts.forEach((acc) => {
        if (currRole === acc.role) {
            addCount(acc.role);
        }
    });

    if (appMember >= MAX_MEMBER_APP)
        return `Oops! No app membros, só é possível cadastrar ${MAX_MEMBER_APP} conta por CPF`;
    if (appAdmin >= MAX_ADMIN_APP)
        return `Oops! No app admin, só é possível cadastrar até ${MAX_ADMIN_APP} conta por CPF`;
    if (appFiddelize >= MAX_FIDDELIZE_APP)
        return `Oops! No app da Equipe Fiddelize, só é possível cadastrar ${MAX_FIDDELIZE_APP} conta por CPF`;

    return false;
};

const handleRoleQuery = ({ role, body }) => {
    const { cpf, clientAdminData, clientUserData } = body;

    const cpfQuery = { cpf: jsEncrypt(cpf) };

    switch (role) {
        case "cliente":
            const bizIdQuery = { "clientUserData.bizId": clientUserData.bizId };
            const queryCliUser = { $and: [cpfQuery, bizIdQuery] };
            return queryCliUser;
        case "cliente-admin":
            const bizNameQuery = {
                "clientAdminData.bizName": clientAdminData.bizName,
            };
            const queryCliAdmin = { $and: [cpfQuery, bizNameQuery] };
            return queryCliAdmin;
        default:
            console.log("smt went wrong with handleRoleQuery");
    }
};

exports.checkIfAlreadyHasUser = async (body) => {
    const { role } = body;

    const query = handleRoleQuery({ role, body });

    const select =
        role === "cliente"
            ? "clientUserData.bizId -_id"
            : "clientAdminData.bizName -_id";

    const user = await User(role)
        .findOne(query)
        .select(select)
        .catch((err) => {
            msgG("error.systemError", err);
        });

    if (user) return true;
    return false;
};
