function getFirstName(name) {
    if(!name || typeof name !== "string") throw new Error("Ther argument should be a string or not empty")

    const firstSpaceInd = name.indexOf(" ");
    if(firstSpaceInd === -1) return name;

    return name.slice(0, firstSpaceInd);
}

module.exports = getFirstName;