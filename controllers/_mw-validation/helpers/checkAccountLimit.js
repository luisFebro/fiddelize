const checkAccountLimit = (accounts, options = {}) => {
    const { currRole } = options;

    if (!accounts.length || currRole === "cliente") return false;
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
        return `Oops! No app admin, só é possível cadastrar ${MAX_ADMIN_APP} conta por CPF`;
    if (appFiddelize >= MAX_FIDDELIZE_APP)
        return `Oops! No app da Equipe Fiddelize, só é possível cadastrar ${MAX_FIDDELIZE_APP} conta por CPF`;

    return false;
};

module.exports = checkAccountLimit;
