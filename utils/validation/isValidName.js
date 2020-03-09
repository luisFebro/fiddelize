function isValidName(name) {
    const gotSurname = name.trim().split(" ").length >= 2;

    if(gotSurname) {
        return true;
    }

    return false;
}

module.exports = isValidName;