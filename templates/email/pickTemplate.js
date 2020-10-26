const { recoverPassword } = require("./types/recoverPassword");

const store = {
    recoverPassword,
};

function pickTemplate(name, options = {}) {
    const { payload } = options;

    const found = store[name];
    if (!found) return false;

    return found(payload);
}

module.exports = pickTemplate;
