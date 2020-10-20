const User = require("../../models/user");
const getTTLResult = require("../ttl");
const {
    createBcryptPswd,
    compareBcryptPswd,
} = require("../../utils/security/xCipher");

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

    User.findById(userId)
        .select("pswd")
        .then((userData) => {
            const hash = userData.pswd;

            compareBcryptPswd(pswd, { hash }).then((checkRes) => {
                res.json(checkRes);
            });
        })
        .catch((error) => res.json({ error }));
};

exports.changePassword = (req, res) => {};

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
        const userData = await User.findByIdAndUpdate(userId, { pswd: hash });
        res.json({ msg: "Senha alterada com sucesso!" });
    } else {
        res.status(401).json({ error: "Este link não é mais válido!" });
    }
};
