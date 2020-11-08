const User = require("../../models/user");
const { msgG } = require("../_msgs/globalMsgs");
const { msg } = require("../_msgs/auth");
const getFirstName = require("../../utils/string/getFirstName");
const {
    encryptSync,
    decryptSync,
    jsEncrypt,
    checkJWT,
} = require("../../utils/security/xCipher");
const getJwtToken = require("./helpers/getJwtToken");
const getRoleData = require("./helpers/getRoleData");
const { getTreatedToken } = require("./token");
const { setNewAccount } = require("../user/account/account");
const {
    getRoleDataName,
} = require("../../models/user/schemes/data-by-role/main");
// MIDDLEWARES
// WARNING: if some error, probably it is _id which is not being read
// bacause not found. To avoid this, try write userId if in a parameter as default.
exports.mwIsAuth = async (req, res, next) => {
    //condition for testing without token
    if (
        req.query.isFebroBoss ||
        (req.query.nT && req.body.recipient) // nT === token
    ) {
        return next();
    }

    const profile = req.profile;
    const query = req.query;
    const body = req.body;

    const _id =
        (query && query.userId) ||
        (body && body.userId) ||
        (profile && profile._id) ||
        (query && query.bizId) ||
        (body && body.senderId); // add here all means to get id to compare against the JWT verification

    const token = getTreatedToken(req);
    const decoded = await checkJWT(token).catch((err) => {
        res.status(401).json({ error: "Sua sessão expirou" }); // jwt expired
    });

    if (decoded) {
        let isAuthUser = Boolean(_id && decoded.id === _id.toString());
        if (!isAuthUser)
            return res.status(403).json(msg("error.notAuthorized")); // n4 401 and 403 http code difference

        next();
    }
};

exports.mwIsAdmin = (req, res, next) => {
    if (req.profile.role !== "admin") {
        return res.status(403).json(msg("error.accessDenied")); // n4 401 and 403 http code difference
    }
    next();
};

exports.mwIsClientAdmin = (req, res, next) => {
    if (req.profile.role !== "cliente-admin") {
        return res.status(403).json(msg("error.accessDenied"));
    }
    next();
};

exports.mwSession = async (req, res, next) => {
    // n1
    const token = getTreatedToken(req);

    if (!token)
        return res.json({ error: "New user accessed without JWT Token!" });

    const decoded = await checkJWT(token).catch((err) => {
        console.log(`${err}`); // do not return res.status since it will the a long serverResponse obj, by stringify the err, avoid the tracing error paths to show up...
        res.status(401).json(msg("error.sessionEnded"));
    });

    if (decoded) {
        req.authObj = decoded; // eg { id: '5db4301ed39a4e12546277a8', iat: 1574210504, exp: 1574815304 } // iat refers to JWT_SECRET. This data is generated from jwt.sign
        next();
    }
};
// END MIDDLEWARES

// this will load the authorized user's data after and only if the token is valid in mwAuth
exports.loadAuthUser = async (req, res) => {
    const { role, id: userJwtId } = req.authObj;

    const handleRole = (role) => {
        const cliUser =
            "-cpf -clientUserData.notifications -clientUserData.purchaseHistory";
        const cliAdmin =
            "-expiryToken -pswd -clientAdminData.smsBalance -clientAdminData.bizFreeCredits -clientAdminData.bizPlanList -clientAdminData.smsHistory -clientAdminData.smsAutomation -clientAdminData.orders -clientAdminData.notifications -clientAdminData.tasks -clientUserData.notifications";

        if (role === "cliente-admin") return cliAdmin;
        if (role === "cliente") return cliUser;
    };

    const select = handleRole(role);

    const profile = await User(role).findById(userJwtId).select(select);

    if (!profile)
        return res.status(404).json({ error: "Usuário não encontrado!" });
    if (profile) {
        profile.email = decryptSync(profile.email);
        profile.phone = decryptSync(profile.phone);

        res.json({ profile });
    }
};

exports.register = async (req, res) => {
    let {
        role,
        name,
        email,
        cpf,
        birthday,
        phone,
        gender,
        clientAdminData,
        clientMemberData,
        clientUserData,
        bizTeamData,
        filter,
        bizImg,
        bizName,
    } = req.body;

    const ThisUser = User(role);
    const newUser = new ThisUser({
        role,
        name,
        email: encryptSync(cpf),
        cpf: jsEncrypt(cpf),
        phone: encryptSync(phone),
        birthday,
        gender,
        clientAdminData,
        clientUserData,
        clientMemberData,
        bizTeamData,
        filter,
    });

    const handleMsg = () => {
        const handleAppName = () => {
            if (role === "cliente") return "do cliente";
            if (role === "cliente-membro") return "de membros";
            if (role === "cliente-admin") return "do Admin";
            return "da Equipe Fiddelize";
        };

        return `${getFirstName(
            name
        )}, cadastro realizado com sucesso no App ${handleAppName()}.`;
    };

    const user = await newUser.save();
    const { _id } = user;

    const isAnotherAccount = req.accounts.length;

    if (isAnotherAccount) {
        await User(role).findByIdAndUpdate(_id, {
            [`${getRoleDataName(role)}.onceChecked.backend_accountPanel`]: true,
        });
    }

    await setNewAccount({
        userId: _id,
        cpf,
        role,
        bizImg,
        bizName: bizName || (clientAdminData && clientAdminData.bizName),
        bizId:
            (clientUserData && clientUserData.bizId) ||
            (clientMemberData && clientMemberData.bizId) ||
            _id,
    });

    res.json({
        msg: handleMsg(),
        authUserId: user._id,
        roleRegistered: role,
    });
};

exports.login = async (req, res) => {
    const { _id, role } = req.profile;
    const { cpf } = req.body;

    const roleData = req.profile[getRoleDataName(role)];
    const needPanel = roleData.onceChecked.backend_accountPanel;
    // const { accounts } = await req.getAccount(null, { cpf, accounts: true })
    if (needPanel) {
        await User(role).findByIdAndUpdate(_id, {
            [`${getRoleDataName(
                role
            )}.onceChecked.backend_accountPanel`]: false,
        });
    }

    let token = undefined;
    if (role === "cliente") {
        // only clients now have access to app only with CPF.
        // Other roles require a password. Only after a correct one, then a token is generated (with getToken routes)
        token = await getJwtToken({ _id: _id && _id.toString(), role });
    }

    const authData = getRoleData(role, {
        data: req.profile,
        token,
        cpf,
    });

    res.json({
        ...authData,
        needAccountPanel: needPanel ? true : false,
    });
};

/* COMMENTS
n1:
/*this middleware is created so that
we can have private routes that are only
accessed if we send along the token from routes/api/auth*/

/*The purpose of this function here is to get
the token that's sent from either react
or postman angular whatever front-end
you're using where it's gonna send along
a token

n3: Salted hashing — Generating random bytes (the salt) and combining it with the password before hashing creates unique hashes across each user’s password. If two users have the same password they will not have the same password hash.salt
e.g
salt - $2a$10$qggYRlcaPWU296DD7M3Ryu
hash - $2a$10$qggYRlcaPWU296DD7M3RyujYuDVnKKxo91rAHIKJKMXCmsnQVGn/2

n4:
a 401 Unauthorized response should be used for missing or bad authentication, and a 403 Forbidden response should be used afterwards, when the user is authenticated but isn’t authorized to perform the requested operation on the given resource.
*/
