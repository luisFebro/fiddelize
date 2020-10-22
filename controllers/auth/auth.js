const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { msgG } = require("../_msgs/globalMsgs");
const { msg } = require("../_msgs/auth");
const selectObjKeys = require("../../utils/objects/selectObjKeys");
const getFirstName = require("../../utils/string/getFirstName");
const {
    encryptSync,
    decryptSync,
    jsEncrypt,
} = require("../../utils/security/xCipher");

// MIDDLEWARES
// WARNING: if some error, probably it is _id which is not being read
// bacause not found. To avoid this, try write userId if in a parameter as default.
exports.mwIsAuth = (req, res, next) => {
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
    let token = req.header("x-auth-token") || req.header("authorization"); // authrization for postman tests
    if (token && token.includes("Bearer ")) {
        token = token.slice(7);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        let isAuthUser = Boolean(
            _id && decoded && decoded.id === _id.toString()
        );

        if (err) {
            if (err && err.message.includes("expired"))
                return res.status(403).json({ error: "jwt expired" });
            console.log(`JWT ERROR: ${err.message}`);
        }
        if (err || !isAuthUser)
            return res.status(403).json(msg("error.notAuthorized")); // n4 401 and 403 http code difference
        next();
    });
};

exports.mwIsAdmin = (req, res, next) => {
    if (req.profile.role !== "admin") {
        return res.status(403).json(msg("error.accessDenied")); // n4 401 and 403 http code difference
    }
    next();
};

exports.mwIsCliAdmin = (req, res, next) => {
    if (req.profile.role !== "cliente-admin") {
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

exports.mwSession = (req, res, next) => {
    // n1
    const token = req.header("x-auth-token"); // this does not work with authorization header // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYjQzMDFlZDM5YTRlMTI1NDYyNzdhOCIsImlhdCI6MTU3NDIxMDUwNCwiZXhwIjoxNTc0ODE1MzA0fQ.HAUlZ6lCHxRuieN5nizug_ZMTEuAmJ2Ck22uCcBkmeY"

    if (!token) return console.log("New user accessed without JWT Token!");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.authObj = decoded; // eg { id: '5db4301ed39a4e12546277a8', iat: 1574210504, exp: 1574815304 } // iat refers to JWT_SECRET. This data is generated from jwt.sign
        next();
    } catch (err) {
        console.log("This user has an Invalid or Expired JWT Token! " + err);
        return res.status(401).json(msg("error.sessionEnded"));
    }
};
// END MIDDLEWARES

// this will load the authorized user's data after and only if the token is valid in mwAuth
exports.loadAuthUser = (req, res) => {
    const userIdInsideJwt = req.authObj && req.authObj.id;
    const select =
        "-cpf -clientAdminData.verificationPass -clientAdminData.bizPlanCode -clientAdminData.notifications -clientAdminData.tasks -clientUserData.notifications -clientUserData.purchaseHistory";

    if (!userIdInsideJwt) {
        console.log("Warning: user loaded without ID");
    } else {
        User.findById(userIdInsideJwt)
            .select(select)
            .exec((err, profile) => {
                profile.email = decryptSync(profile.email);
                profile.phone = decryptSync(profile.phone);

                if (err)
                    return res.status(500).json(msgG("error.systemError", err));
                res.json({ profile });
            });
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
    // const { password, needKeepLoggedIn } = req.body;
    const { _id, name, role, clientAdminData, clientUserData } = req.profile;
    const { cpf } = req.body;
    // encrypted token to be store in IndexDB before checking password validation.
    let twoLastCpfDigits;

    let token = await getJwtToken({ _id, role });

    if (role === "cliente-admin") {
        token = undefined; // this is fetched on getToken now..
        twoLastCpfDigits = cpf && cpf.slice(-2);
    }

    let keysStore = {
        role,
        name,
        bizId: (clientUserData && clientUserData.bizId) || "0",
        bizCodeName: clientAdminData && clientAdminData.bizCodeName,
        verificationPass: clientAdminData && clientAdminData.verificationPass,
        selfBizLogoImg: clientAdminData && clientAdminData.selfBizLogoImg,
        authUserId: _id,
        msg: msg("ok.welcomeBack", getFirstName(name), "onlyMsg"),
        needCliUserWelcomeNotif:
            clientUserData && !clientUserData.notifications.length,
        twoLastCpfDigits,
    };

    res.json(handleRolesData(role, { ...keysStore, token }));
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
function handleRolesData(role, ...allKeys) {
    let objToSend;
    const allKeysStore = Object.assign({}, ...allKeys);
    // console.log(Object.keys(allKeysStore))

    switch (role) {
        case "cliente-admin":
            const array1 = [
                "token",
                "role",
                "name",
                "bizCodeName",
                "verificationPass",
                "authUserId",
                "msg",
                "selfBizLogoImg",
                "twoLastCpfDigits",
            ];
            objToSend = selectObjKeys(allKeysStore, array1);
            break;
        case "cliente":
            const array2 = [
                "bizId",
                "token",
                "role",
                "name",
                "authUserId",
                "msg",
                "needCliUserWelcomeNotif",
            ];
            objToSend = selectObjKeys(allKeysStore, array2);
            break;
        default:
            objToSend = allKeysStore;
            console.log(
                "All keys are included in handleRolesData function at auth"
            );
    }

    return objToSend;
}

async function getJwtToken({ _id, role }) {
    let expiringTime;
    role !== "cliente" ? (expiringTime = "24h") : (expiringTime = "90d"); // default: 30m (enum: 30s, 30m, 1h, 7d)

    let token = await jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: expiringTime,
    });

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
