function validateContact(contact) {
    const regEx = /(\({0,1}\d{0,2}\){0,1} {0,1})(\d{4,5}) {0,1}-{0,1}(\d{4})/
    return regEx.test(contact);
}

module.exports = validateContact;
