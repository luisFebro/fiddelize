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
const { findAllUserAccounts } = require("../user/account/account");

// HELPERS
async function comparePswds(userId, options = {}) {
    const { pswd, role } = options;

    const userData = await User(role)
        .findById(userId)
        .select("pswd")
        .catch((error) => console.log(error));

    const hash = userData.pswd;

    const checkRes = await compareBcryptPswd(pswd, { hash }).catch((error) =>
        // This does not return a catch. it returns either false or true.
        console.log(error)
    );

    return checkRes;
}

const checkExpiryAttempts = (attemptN) => {
    if (attemptN === 2) return "30s";
    if (attemptN === 4) return "1m";
    if (attemptN === 6) return "2m";
    if (attemptN === 8) return "4m";
    if (attemptN === 10) return "8m";
    if (attemptN === 12) return "16m";
    if (attemptN >= 14) return "32m";

    return false;
};

const checkForExpiryToken = async (currToken) => {
    if (currToken) {
        const noBlocked = await checkJWT(currToken).catch((e) => {
            console.log(`${e}`);
        });

        if (noBlocked) {
            return true;
        } else {
            return false;
        }
    }

    return false;
};
// END HELPERS

// POST
exports.createPassword = async (req, res) => {
    const { newPswd, newPswd2, userId, role = "cliente-admin" } = req.body;

    if (newPswd && !newPswd2) return res.json({ msg: "ok pswd1" });

    if (newPswd2) {
        if (newPswd !== newPswd2) {
            return res.status(400).json({
                error: "As senhas informadas não batem. Tente novamente.",
            });
        }
    }

    const hash = await createBcryptPswd(newPswd);

    const userData = await User(role)
        .findById(userId)
        .catch((error) => {
            res.status(400).json({ error: "Id não encontrado" });
        });

    if (userData) {
        if (userData.pswd)
            return res
                .status(400)
                .json({ error: "Já foi criado uma senha para esta conta" });

        userData.pswd = hash;
        userData.markModified("pswd");

        await userData.save();
        const SUCCESSFUL_MSG = "pass created";
        res.json({ msg: SUCCESSFUL_MSG });
    }
};

// POST
exports.checkPassword = async (req, res) => {
    const {
        pswd,
        userId,
        checkIfLocked = false,
        role = "cliente-admin",
    } = req.body;

    if (checkIfLocked) {
        const data = await User(role)
            .findById(userId)
            .select("expiryToken.current expiryToken.loginAttempts")
            .catch((err) => {
                res.status(500).json({ error: err });
            });

        if (data) {
            const loginAttempts = data && data.expiryToken.loginAttempts;
            const currToken = data && data.expiryToken.current;

            if (!loginAttempts) return res.json(false);

            const currExpiryTime = checkExpiryAttempts(loginAttempts + 1);
            const verif = await checkForExpiryToken(currToken);
            return res.json({
                blocked: verif,
                lockMin: currExpiryTime,
            });
        }
    }

    if (!pswd || !userId)
        return res.status(400).json({ error: "Senha ou Id faltando..." });

    const checkRes = await comparePswds(userId, { pswd, role });

    if (!checkRes) {
        const data = await User(role)
            .findById(userId)
            .select("expiryToken.current expiryToken.loginAttempts")
            .catch((err) => {
                res.status(500).json({ error: err });
            });

        const loginAttempts = data && data.expiryToken.loginAttempts + 1;
        const currToken = data && data.expiryToken.current;
        const currExpiryTime = checkExpiryAttempts(loginAttempts);

        let timeoutHash = null;
        let isBlocked = false;

        if (currExpiryTime) {
            timeoutHash = await createJWT(userId, { expiry: currExpiryTime });
            let update = {
                "expiryToken.current": timeoutHash,
                "expiryToken.loginAttempts": loginAttempts, // This considers user will not be redirect to a blocked page and not be able to try again during this time.
            };

            // register attempt failure once in the history
            if (loginAttempts === 2) {
                update = {
                    ...update,
                    $push: { "expiryToken.history": "loginAttempts" },
                };
            }

            await User(role)
                .findByIdAndUpdate(userId, update)
                .catch((err) => {
                    console.log(err);
                });
        }

        isBlocked = await checkForExpiryToken(currToken);

        if (currExpiryTime) {
            isBlocked = true;
        }

        if (!isBlocked) {
            await User(role)
                .findByIdAndUpdate(userId, {
                    "expiryToken.loginAttempts": loginAttempts,
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (currExpiryTime && isBlocked) {
            const onlyMin =
                currExpiryTime === "30s"
                    ? 0.5
                    : Number(currExpiryTime.replace(/m/gi, ""));
            // setting to 400 instead of 401 since it is disconnecting user while is blocked on access page
            return res.status(400).json({ blocked: true, minutes: onlyMin });
        }
        return res.status(400).json(false);
    } else {
        await User(role)
            .findByIdAndUpdate(userId, {
                "expiryToken.current": null,
                "expiryToken.loginAttempts": 0,
            })
            .catch((err) => {
                console.log(err);
            });

        res.json(true);
    }
};

exports.changePassword = async (req, res) => {
    const { userId, newPswd, newPswd2, role = "cliente-admin" } = req.body;

    // adapt from recoverPassword's variables
    const priorPswd = newPswd;
    const realNewPswd = newPswd2;

    if (!userId)
        return res
            .status(400)
            .json({ error: "ID do usuário ou senhas faltando..." });

    const checkRes = await comparePswds(userId, {
        pswd: priorPswd,
        role,
    }).catch((err) => {
        console.log(err);
    });

    if (checkRes) {
        if (priorPswd && !realNewPswd) return res.json({ msg: "ok pswd1" }); // the first pswd is ok. Passed validation.

        const SUCCESSFUL_MSG = "pass changed";

        const hash = await createBcryptPswd(realNewPswd);

        // Check if user has both a cli-admin or a biz-team account.
        // If so, the password change will be both of them
        const dataAcc = await findAllUserAccounts({ userId, role }).catch(
            (err) => {
                res.status(400).json({ error: err });
            }
        );
        if (!dataAcc) return;
        const needDoubleStore =
            dataAcc.includes("nucleo-equipe") &&
            dataAcc.includes("cliente-admin");

        if (needDoubleStore) {
            await Promise.all([
                User("nucleo-equipe").findByIdAndUpdate(userId, { pswd: hash }),
                User("cliente-admin").findByIdAndUpdate(userId, { pswd: hash }),
            ]);
            return res.json({
                msg: `${SUCCESSFUL_MSG} by double storage nucleo and cli-admin`,
            });
        }
        await User(role).findByIdAndUpdate(userId, { pswd: hash });
        res.json({ msg: SUCCESSFUL_MSG });
    } else {
        return res
            .status(400)
            .json({ error: "A senha atual não bate com a informada." });
    }
};

exports.forgotPasswordRequest = async (req, res) => {
    const { userId, cpf, email, role = "cliente-admin" } = req.body;

    const encryptedCPF = jsEncrypt(cpf);

    const user = await User(role)
        .findOne({ cpf: encryptedCPF })
        .select("name email _id");
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
    await User(role)
        .findByIdAndUpdate(userId, update)
        .catch((err) => {
            res.status(500).json({ error: err });
        });

    const payload = {
        name,
        toEmail: decryptedEmail,
        token,
        role,
    };

    // return res.json(token);

    const finalRes = await sendEmailBack({
        type: "recoverPassword",
        payload,
    }).catch((err) => {
        res.status(400).json({ error: err });
    });
    if (!finalRes) return;

    res.json({ msg: "recovery email sent" });
};

// POST - Only for recover page when a 1 hour long time-out token will be verified
exports.recoverPassword = async (req, res) => {
    const {
        newPswd,
        newPswd2,
        token,
        checkToken = false,
        role = "cliente-admin",
    } = req.body;

    // Check if token is still valid to redirect the page in case of expired token
    if (token && checkToken) {
        const tokenOk = await checkJWT(token).catch((e) => {
            res.json(false);
        });

        if (tokenOk) {
            // check if user already applied the change. If so, invalidate access.
            const isTokenAvailable = await User(role)
                .findById(tokenOk.id)
                .select("expiryToken.current -_id");

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

        const dataAcc = await findAllUserAccounts({ userId, role }).catch(
            (err) => {
                res.status(400).json({ error: err });
            }
        );
        if (!dataAcc) return;
        const needDoubleStore =
            dataAcc.includes("nucleo-equipe") &&
            dataAcc.includes("cliente-admin");

        if (needDoubleStore) {
            await Promise.all([
                User("nucleo-equipe").findByIdAndUpdate(userId, {
                    pswd: hash,
                    "expiryToken.current": null,
                    "expiryToken.loginAttempts": 0,
                }),
                User("cliente-admin").findByIdAndUpdate(userId, {
                    pswd: hash,
                    "expiryToken.current": null,
                    "expiryToken.loginAttempts": 0,
                }),
            ]);
            return res.json({
                msg: `${SUCCESSFUL_MSG} by double storage nucleo and cli-admin`,
            });
        }

        await User(role).findByIdAndUpdate(userId, {
            pswd: hash,
            "expiryToken.current": null,
            "expiryToken.loginAttempts": 0,
        });
        res.json({ msg: SUCCESSFUL_MSG });
    }
};
