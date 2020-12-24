const { IS_PROD } = require("../../../config");

module.exports = {
    sandboxMode: IS_PROD ? false : true,
    get appId() {
        return this.sandboxMode
            ? process.env.SPLIT_APP_ID_PAGSEGURO_DEV
            : process.env.SPLIT_APP_ID_PAGSEGURO_PROD;
    },
    email: process.env.EMAIL_DEV,
    get appKey() {
        return this.sandboxMode
            ? process.env.SPLIT_APP_KEY_PAGSEGURO_DEV
            : process.env.SPLIT_APP_KEY_PAGSEGURO_PROD;
    },
};
