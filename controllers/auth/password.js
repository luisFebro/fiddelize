const User = require("../../models/user");
const {
    createBcryptPswd,
    compareBcryptPswd,
    decryptSync,
    jsEncrypt,
    createJWT,
    checkJWT,
} = require("../../utils/security/xCipher");
const { sendEmailBack } = require("../../controllers/email");

// HELPERS
async function comparePswds(userId, options = {}) {
    const { pswd } = options;

    const userData = await User.findById(userId)
        .select("pswd")
        .catch((error) => console.log(error));

    const hash = userData.pswd;

    const checkRes = await compareBcryptPswd(pswd, { hash }).catch((error) =>
        // This does not return a catch. it returns either false or true.
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
    const { userId, newPswd, newPswd2 } = req.body;

    // adapt from recoverPassword's variables
    const priorPswd = newPswd;
    const realNewPswd = newPswd2;

    if (!userId)
        return res
            .status(400)
            .json({ error: "ID do usuário ou senhas faltando..." });

    const checkRes = await comparePswds(userId, { pswd: priorPswd }).catch(
        (err) => {
            console.log(err);
        }
    );

    if (checkRes) {
        if (priorPswd && !realNewPswd) return res.json({ msg: "ok pswd1" }); // the first pswd is ok. Passed validation.

        const SUCCESSFUL_MSG = "pass changed";

        const hash = await createBcryptPswd(realNewPswd);
        await User.findByIdAndUpdate(userId, { pswd: hash });
        res.json({ msg: SUCCESSFUL_MSG });
    } else {
        return res
            .status(400)
            .json({ error: "A senha atual não bate com a informada." });
    }
};

exports.forgotPasswordRequest = async (req, res) => {
    const { userId, cpf, email } = req.body;

    const encryptedCPF = jsEncrypt(cpf);

    const user = await User.findOne({ cpf: encryptedCPF }).select(
        "name email _id"
    );
    if (!user || (user && user._id.toString()) !== userId)
        return res
            .status(400)
            .json({ error: "As informações não batem. Confira seus dados." });

    const { email: encryptedEmail, name } = user;

    const decryptedEmail = decryptSync(encryptedEmail);
    if (decryptedEmail !== email)
        return res
            .status(400)
            .json({ error: "As informações não batem. Confira seus dados." });

    const token = await createJWT(userId, { expiry: "1h" });

    const update = {
        "expiryToken.current": token,
        $push: { "expiryToken.history": "recoverPassword" },
    };
    await User.findByIdAndUpdate(userId, update).catch((err) => {
        res.status(500).json({ error: err });
    });

    const payload = {
        name,
        toEmail: decryptedEmail,
        token,
    };

    // return res.json(token);

    const finalRes = await sendEmailBack({ type: "recoverPassword", payload });
    if (finalRes) {
        return res.json({ msg: "recovery email sent" });
    }
};

// POST - Only for recover page when a 1 hour long time-out token will be verified
exports.recoverPassword = async (req, res) => {
    const { newPswd, newPswd2, token, checkToken = false } = req.body;

    // Check if token is still valid to redirect the page in case of expired token
    if (token && checkToken) {
        const tokenRes = await checkJWT(token).catch((e) => {
            res.json(false);
        });

        if (tokenRes) {
            // check if user already applied the change. If so, invalidate access.
            const isTokenAvailable = await User.findById(tokenRes.id).select(
                "expiryToken.current -_id"
            );

            const currToken =
                isTokenAvailable && isTokenAvailable.expiryToken.current;
            if (!currToken) return res.json(false);
            return res.json(true);
        }
        return;
    }

    // confirmation of password for a second time
    if (newPswd && !newPswd2) return res.json({ msg: "ok pswd1" }); // the first pswd is ok. Passed validation.
    if (newPswd2) {
        if (newPswd !== newPswd2) {
            return res.status(400).json({
                error: "As senhas informadas não batem. Tente novamente.",
            });
        }
    }

    if (!token || !newPswd)
        return res
            .status(400)
            .json({ error: "Erro ao recuperar senha de usuário" });

    const validPayload = await checkJWT(token).catch((e) => {
        res.status(401).json({ error: "Este link já expirou." });
    });

    const SUCCESSFUL_MSG = "pass changed";
    if (validPayload) {
        const hash = await createBcryptPswd(newPswd);
        const userId = validPayload.id;

        await User.findByIdAndUpdate(userId, {
            pswd: hash,
            "expiryToken.current": null,
        });
        res.json({ msg: SUCCESSFUL_MSG });
    }
};
