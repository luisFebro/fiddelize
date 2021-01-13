const { nanoid } = require("nanoid");

function getId() {
    return nanoid(10);
}

module.exports = getId;
