const { createJWT } = require("../../../utils/security/xCipher");

async function getJwtToken({ _id, role }) {
    const handleExpiryTime = (role) => {
        // (enum: 30s, 30m, 1h, 7d)
        if (role === "cliente-admin") return "1h"; // 1h
        if (role === "cliente-membro") return "8h"; // 8h
        if (role === "cliente") return "90d"; //90d
        if (role === "equipe") return "1h"; //1h
    };

    const payload = { id: _id, role };
    let token = await createJWT(payload, { expiry: handleExpiryTime(role) });

    return token;
}

module.exports = getJwtToken;
