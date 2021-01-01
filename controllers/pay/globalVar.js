const { IS_PROD } = require("../../config");

// IMPORTANT! On production for boleto, sandbox request will return "Not found" because the host address will be production's, not dev.
// In order to work, we have to set sandboxMode to TRUE and deploy both here and PayArea Component.
// if sandboxMode is on, then production status transaction change will return with error 404 or 500

// Disable it when testing is no longer made.
const forceSandboxOnProduction = false; // if not activated, then requests will return (Request failed with status code 404) because is not from production.

const handleMode = () => {
    if (forceSandboxOnProduction) return true;
    return IS_PROD ? false : true;
};

module.exports = {
    sandboxMode: false, //handleMode(),
    get payUrl() {
        return this.sandboxMode
            ? "https://ws.sandbox.pagseguro.uol.com.br"
            : "https://ws.pagseguro.uol.com.br";
    },
    email: process.env.EMAIL_DEV,
    get token() {
        return this.sandboxMode
            ? process.env.TOKEN_PAGSEGURO
            : process.env.TOKEN_PAGSEGURO_PROD;
    },
};
