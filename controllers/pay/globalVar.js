const { IS_PROD } = require("../../config");

// On production, sandbox request will return "Not found" because the host address will be production's, not dev.
// In order to work, we have to set sandboxMode to TRUE and deploy both here and PayArea Compenent.
exports.globalVar = {
    sandboxMode: true, //IS_PROD ? false : true,
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
