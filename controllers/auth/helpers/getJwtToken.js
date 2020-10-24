const { createJWT } = require("../../../utils/security/xCipher");

async function getJwtToken({ _id, role }) {
    const handleExpiryTime = (role) => {
        // (enum: 30s, 30m, 1h, 7d)
        if (role === "cliente-admin") return "1h"; // 1h
        if (role === "cliente") return "90d"; //90d
    };

    let token = await createJWT(_id, { expiry: handleExpiryTime(role) });

    return token;
}

module.exports = getJwtToken;
