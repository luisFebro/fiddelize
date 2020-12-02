const User = require("../../../models/user");
const generateAlphaNumeric = require("../../../utils/string/generateAlphaNumeric");
const { jsEncrypt, jsDecrypt } = require("../../../utils/security/xCipher");

// temp score is all scores which were added wirelessly by staff either by new and regular clients.
// the link score is how all scores are safely encrypted and sent through a link.

// POST
// token example: d%40.50
// first 2 characters will be randomly generated
// and followed by the user's score.
exports.encryptLinkScore = async (req, res) => {
    const { score } = req.body;

    const salt = generateAlphaNumeric(2, "aA#!@");
    const token = jsEncrypt(`${salt}${score}`);

    res.json(token);
};

// GET - for security reasons, this method will be passed and handled to the server
// it will be used in the backend register auth
exports.decryptLinkScore = (encryptedScore) => {
    const tokenRevealed = jsDecrypt(encryptedScore);

    return Number(tokenRevealed.slice(2));
};

exports.readTempScoreList = async (req, res) => {
    const { userId, onlyLastAvailable = false, isAdmin = false } = req.query;

    const data = await User(isAdmin ? "cliente-admin" : "cliente")
        .findById(userId)
        .select("clientUserData.tempScoreList");

    const tempList = data && data.clientUserData.tempScoreList;
    if (!tempList) return res.json([]);

    if (onlyLastAvailable) {
        const lastOne = tempList.find((s) => {
            return s.used === false;
        });

        if (lastOne) return res.json(lastOne);
        return res.json(false);
    }

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
