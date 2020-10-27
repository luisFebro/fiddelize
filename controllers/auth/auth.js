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
    }

    next();
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
    const userJwtId = (req.authObj && req.authObj.id) || " ";

    const user = await User.findById(userJwtId)
        .select("role -_id")
        .catch((err) => {
            res.status(500).json({ error: err });
        });
    if (!user) return;
    const role = user && user.role;

    const handleRole = (role) => {
        const cliUser =
            "-cpf -clientAdminData.verificationPass -clientAdminData.bizPlanCode -clientAdminData.notifications -clientAdminData.tasks -clientUserData.notifications -clientUserData.purchaseHistory";
        const cliAdmin =
            "-pswd -clientAdminData.smsBalance -clientAdminData.bizFreeCredits -clientAdminData.bizPlanList -clientAdminData.smsHistory -clientAdminData.smsAutomation -clientAdminData.orders -clientAdminData.notifications -clientAdminData.tasks";

        if (role === "cliente-admin") return cliAdmin;
        if (role === "cliente") return cliUser;
    };

    const select = handleRole(role);

    const profile = await User.findById(userJwtId)
        .select(select)
        .catch((err) => {
            res.status(500).json({ error: err });
        });
    if (profile) {
        profile.email = decryptSync(profile.email);
        profile.phone = decryptSync(profile.phone);

        res.json({ profile });
    }
};

exports.register = (req, res) => {
    let {
        role,
        name,
        email,
        cpf,
        birthday,
        phone,
        maritalStatus,
        clientAdminData,
        clientUserData,
        filter,
    } = req.body;

    if (maritalStatus === "selecione estado civil") {
        maritalStatus = "cliente não informou";
    }

    const newUser = new User({
        role,
        name,
        email: encryptSync(cpf),
        cpf: jsEncrypt(cpf),
        phone: encryptSync(phone),
        birthday,
        maritalStatus,
        clientAdminData,
        clientUserData,
        filter,
    });

    newUser.save().then((user) => {
        res.json({
            msg: msg("ok.successRegister", getFirstName(name), "onlyMsg"),
            authUserId: user._id,
            roleRegistered: role,
        });
    });
};

exports.login = async (req, res) => {
    const { _id, role } = req.profile;
    const { cpf } = req.body;

    let token = undefined;
    if (role !== "cliente-admin") {
        // for cli-admin, this is fetched on getToken now..
        token = await getJwtToken({ _id, role });
    }

    const authData = getRoleData(role, { data: req.profile, token, cpf });
    res.json(authData);
};

exports.getToken = async (req, res) => {
    const { _id } = req.body;

    const token = await getJwtToken({ _id, role: "cliente-admin" });
    const encrypted = encryptSync(token);

    res.json(encrypted);
};

// After password validation success, decrypt token.
exports.getDecryptedToken = (req, res) => {
    const { token } = req.body;

    const decrypted = decryptSync(token);
    if (!decrypted)
        return res
            .status(401)
            .json({ error: "Ocorreu um erro na validação..." });

    res.json(decrypted);
};

// HELPERS
function getTreatedToken(req) {
    let token = req.header("x-auth-token") || req.header("authorization"); // authrization for postman tests
    if (token && token.includes("Bearer ")) {
        token = token.slice(7);
    }

    return token;
}
// END HELPERS

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
