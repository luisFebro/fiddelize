const { encryptSync, decryptSync } = require("../../utils/security/xCipher");
const getJwtToken = require("./helpers/getJwtToken");

// HELPERS
exports.getTreatedToken = (req) => {
    let token = req.header("x-auth-token") || req.header("authorization"); // authrization for postman tests
    if (token && token.includes("Bearer ")) {
        token = token.slice(7);
    }

    return token;
};
// END HELPERS

// Warning: getToken even encrypted can not be a good idea
// since the attacker can descrypt in a JWT debugger and if
// he finds the right place to put the token, then he gets the access
// In future update, only send token when pass is correct and deprecate getToken
exports.getToken = async (req, res) => {
    const { _id, role } = req.body;

    const token = await getJwtToken({
        _id: _id && _id.toString(),
        role: role || "cliente-admin",
    });
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

// POST
exports.getAuthTk = async (req, res) => {
    const { _id, role } = req.body;

    if (!_id || !role) return res.status(400).json({ error: "missing params" });

    const token = await getJwtToken({
        _id: _id && _id.toString(),
        role: role || "cliente-admin",
    });

    res.json(token);
};
