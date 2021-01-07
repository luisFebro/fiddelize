function getFirstName(name, options = {}) {
    const { surname = false } = options;

    if (surname) {
        const lastSpaceInd = name.lastIndexOf(" ");
        return name.slice(lastSpaceInd + 1);
    }

    if (!name) return "";
    if (typeof name !== "string")
        return console.log("The argument should be a string or not empty");

    const firstSpaceInd = name.indexOf(" ");
    if (firstSpaceInd === -1) return name;

    const firstName = name.slice(0, firstSpaceInd);

    return firstName;
}

module.exports = getFirstName;
