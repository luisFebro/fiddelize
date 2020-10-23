const User = require("../../models/user");
const { OAuth2Client } = require("google-auth-library");
const getJwtToken = require("./helpers/getJwtToken");

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_ID);

exports.makeGoogleLogin = async (req, res) => {
    const {
        userId,
        tokenId: idToken,
        n, // e.g n=1 new activation for creating google access from dashboard
    } = req.body;

    const response = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_ID,
    });

    //name not being used in this project
    const { email_verified, email, jti, picture } = response.payload;

    if (email_verified) {
        if (n === 1) {
            const googleObj = {
                email,
                pswd: jti,
                pic: picture,
            };

            await User.findByIdAndUpdate(userId, { pswdGoogle: googleObj });
            return res.json({ msg: "google access ok" });
        } else {
            const cond = [{ _id: userId }, { "pswdGoogle.email": email }];
            const resSearch = await User.findOne({ $and: cond }).select(
                "pswdGoogle -_id"
            );

            const isAuth = resSearch && resSearch.pswdGoogle.pswd;

            if (isAuth) {
                const token = await getJwtToken({
                    _id: userId,
                    role: "cliente-admin",
                });
                return res.json(token);
            } else {
                return res.status(400).json({
                    error: "Email ou senha inválidos",
                });
            }
        }
    } else {
        return res.status(400).json({
            error: "Falha ao acessar com o Google",
        });
    }
    res.json(response);
};

/* ARCHIVES
from seoblog course for both register or login authentification
if (email_verified) {
        const user = await User.findById({ _id });

        if (user) {
            const token = getJwtToken({ _id: userId, role: "cliente-admin" });
            const { _id, email, name, role, username } = user;
            return res.json({ token, user: { _id, email, name, role, username } });
        } else {
            let username = shortid.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti // set to pswdGoogle
            user = new User({ name, email, profile, username, password });
            user.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                const token = getJwtToken({ _id: userId, role: "cliente-admin" });
                const { _id, email, name, role, username } = data;
                return res.json({ token, user: { _id, email, name, role, username } });
            });
            }
        });
    } else {
        return res.status(400).json({
            error: 'Google login failed. Try again.'
        });
    }

 */
