export default function isValidName(name) {
    const gotSurname = name.trim().split(" ").length >= 2;

    if(gotSurname) {
        return true;
    }

    return false;
}

