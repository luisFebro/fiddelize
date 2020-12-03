const User = require("../../../models/user");
const generateAlphaNumeric = require("../../../utils/string/generateAlphaNumeric");
const { jsEncrypt, jsDecrypt } = require("../../../utils/security/xCipher");

// temp score is all scores which were added wirelessly by staff either by new and regular clients.
// the link score is how all scores are safely encrypted and sent through a link.

// POST
// token example: d%40.50 - first 2 characters will be randomly generated and followed by the user's score.
exports.encryptLinkScore = async (req, res) => {
    const { score, cliFirstName, bizCode, userId: bizId } = req.body;
    const salt = generateAlphaNumeric(2, "aA#!@");
    const scoreToken = jsEncrypt(`${salt}${score}`);

    //e.g app/alan_yvs493z0:5d700207
    const invitationLinkCode = `${cliFirstName}_${bizCode}:${scoreToken}`;

    await addInvitaLink(invitationLinkCode, bizId);

    res.json(scoreToken);
};

// GET - for security reasons, this method will be passed and handled to the server
// it will be used in the backend register auth
exports.decryptLinkScore = (encryptedScore) => {
    const tokenRevealed = jsDecrypt(encryptedScore);

    return Number(tokenRevealed.slice(2));
};

exports.readTempScoreList = async (req, res) => {
    let { userId, onlyLastAvailable = false, isAdmin = false } = req.query;
    onlyLastAvailable = onlyLastAvailable === "true";
    isAdmin = isAdmin === "true";

    const data = await User(isAdmin ? "cliente-admin" : "cliente")
        .findById(userId)
        .select("clientUserData.tempScoreList");

    const tempList = data && data.clientUserData.tempScoreList;

    if (onlyLastAvailable) {
        const lastOne = tempList.find((s) => {
            return s.used === false;
        });

        if (lastOne) return res.json(lastOne);
        return res.json(false);
    }

    if (!tempList) return res.json([]);
    res.json(tempList);
};

exports.setLastScoreAsDone = async (req, res) => {
    const { userId } = req.query;

    const data = await User("cliente")
        .findById(userId)
        .select("clientUserData.tempScoreList");

    const tempList = data.clientUserData.tempScoreList;
    if (!tempList) return res.json(false);

    let alreadyFoundLast = false;
    const newList = tempList.map((item) => {
        if (!alreadyFoundLast && item.used === false) {
            item.used = true;
            alreadyFoundLast = true;
            return item;
        }

        return item;
    });

    if (!alreadyFoundLast)
        return res
            .status(400)
            .json({ error: "all temp scores set for this user" });

    data.clientUserData.tempScoreList = newList;
    data.markModified("clientUserData.tempScoreList");
    await data.save();

    res.json({ msg: "the last score was set" });
};

// INVITATION LINK VALIDATION
async function addInvitaLink(linkCode, bizId) {
    const pushObj = {
        "clientAdminData.allowedTempLinks": linkCode,
    };
    return await User("cliente-admin").findByIdAndUpdate(bizId, {
        $push: pushObj,
    });
}

exports.removeAllowedLinkBack = async (linkCode, bizId) => {
    const pullObj = {
        "clientAdminData.allowedTempLinks": linkCode,
    };
    return await User("cliente-admin").findByIdAndUpdate(bizId, {
        $pull: pullObj,
    });
};

// GET
exports.isLinkAllowed = async (req, res) => {
    const { linkCode, bizId } = req.query;

    const bizData = await User("cliente-admin")
        .findById(bizId)
        .select("-_id clientAdminData.allowedTempLinks");

    const allowedList = bizData.clientAdminData.allowedTempLinks;

    if (!allowedList || !allowedList.length) return res.json(false);

    const decision = allowedList.includes(linkCode);
    return res.json(decision);
};
// END INVITATION LINK VALIDATION
