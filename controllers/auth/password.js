const User = require("../../models/user");
const getTTLResult = require("../ttl");
const {
    createBcryptPswd,
    compareBcryptPswd,
} = require("../../utils/security/xCipher");

// HELPERS
async function comparePswds(userId, options = {}) {
    const { pswd } = options;

    const userData = await User.findById(userId)
        .select("pswd")
        .catch((error) => console.log(error));

    const hash = userData.pswd;

    const checkRes = await compareBcryptPswd(pswd, { hash }).catch((error) =>
        console.log(error)
    );

    return checkRes;
}
// END HELPERS

// POST
exports.createPassword = (req, res) => {
    const { pswd, userId } = req.body;

    createBcryptPswd(pswd).then((hash) => {
        User.findById(userId)
            .then((userData) => {
                if (userData.pswd)
                    return res
                        .status(400)
                        .json({ error: "Erro ao criar senha." });

                userData.pswd = hash;

                userData.markModified("pswd");
                userData.save(() => res.json({ msg: "senha criada" }));
            })
            .catch((error) => res.json({ error }));
    });
};

// POST
exports.checkPassword = (req, res) => {
    const { pswd, userId } = req.body;
    if (!pswd || !userId)
        return res.status(400).json({ error: "Senha ou Id faltando..." });

    comparePswds(userId, { pswd }).then((checkRes) => {
        res.json(checkRes);
    });
};

exports.changePassword = async (req, res) => {
    const { userId, priorPswd, newPswd } = req.body;

    if (!userId || !newPswd || !priorPswd)
        return res
            .status(400)
            .json({ error: "ID do usuário ou senhas faltando..." });

    const checkRes = await comparePswds(userId, { pswd: priorPswd });

    if (checkRes) {
        const hash = await createBcryptPswd(newPswd);
        await User.findByIdAndUpdate(userId, { pswd: hash });
        res.json({ msg: "Senha alterada com sucesso!" });
    } else {
        return res
            .status(400)
            .json({ error: "A senha anterior não bate com a informada." });
    }
};

// POST - Only for recover page when a 1 hour long time-out token will be verified
exports.recoverPassword = async (req, res) => {
    const { userId, pswd, requestId } = req.body;

    if (!requestId || !userId || !pswd)
        return res
            .status(400)
            .json({ error: "Erro ao recuperar senha de usuário" });

    const isValidYet = await getTTLResult(userId, {
        target: "emailToken",
        expireAt: 60, // 1 hora
        requestId,
    });

    if (isValidYet) {
        const hash = await createBcryptPswd(pswd);
        await User.findByIdAndUpdate(userId, { pswd: hash });
        res.json({ msg: "Senha alterada com sucesso!" });
    } else {
        res.status(401).json({ error: "Este link não é mais válido!" });
    }
};
