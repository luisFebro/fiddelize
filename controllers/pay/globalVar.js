const { IS_PROD } = require("../../config");

exports.globalVar = {
    sandboxMode: IS_PROD ? false : true,
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
