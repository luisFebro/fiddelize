const jwt = require("jsonwebtoken");

async function getJwtToken({ _id, role }) {
    const handleExpiryTime = (role) => {
        // (enum: 30s, 30m, 1h, 7d)
        if (role === "cliente-admin") return "24h";
        if (role === "cliente") return "90d";
    };

    let token = await jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: handleExpiryTime(role),
    });

    return token;
}

module.exports = getJwtToken;
