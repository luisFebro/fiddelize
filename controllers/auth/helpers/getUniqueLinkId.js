const User = require("../../../models/user");
const getFirstName = require("../../../utils/string/getFirstName");
const getOnlyConsonants = require("../../../utils/string/getOnlyConsonants");
// for bizTeam only (nucleo-equipe) to get an unique unique id for link advertizing

async function getUniqueLinkId(name) {
    if (!name) return;
    const firstUserName = getFirstName(name).toLowerCase();
    const secondUserName = getFirstName(name, { surname: true }).toLowerCase();

    let uniqueLinkId = firstUserName;

    const allNamesFound = await User("nucleo-equipe")
        .find({ name: { $regex: `${firstUserName}`, $options: "i" } })
        .select("name -_id");

    if (allNamesFound && allNamesFound.length) {
        const namesLeng = allNamesFound.length;
        const surnameTwoConsonants = getOnlyConsonants(secondUserName, 2);

        if (namesLeng >= 1) {
            uniqueLinkId += `_${surnameTwoConsonants}`;
        }

        if (namesLeng >= 2) {
            const countSameName = namesLeng + 1;
            uniqueLinkId += `${countSameName}`;
        }
    }

    return uniqueLinkId;
}

module.exports = getUniqueLinkId;

// example: (ana rita) ana, ana_rt, ana_rt3, ana_rt4, ana_rt5
