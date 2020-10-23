const User = require("../../models/user");
const { OAuth2Client } = require("google-auth-library");
const getJwtToken = require("./helpers/getJwtToken");

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_ID);

exports.makeGoogleLogin = async (req, res) => {
    const { userId, tokenId: idToken } = req.body;

    const response = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_ID,
    });
    const { email_verified, jti, picture, name, email } = response.payload;

    if (email_verified) {
        const token = await getJwtToken({ _id: userId, role: "cliente-admin" });
        return res.json(token);
        // const gotObj = await User.find({ "pswdGoogle.email": email }).select("pswdGoogle -_id");
        // const isAuth = gotObj;

        // if(isAuth) {
        //     // send success token and user data
        // }

        const googleObj = {
            pswd: jti,
            pic: picture,
        };
        const yay = await User.findByIdAndUpdate(
            userId,
            { pswdGoogle: googleObj },
            { new: true }
        );
        res.json(yay);
    } else {
        return res.status(400).json({
            error: "Google login failed. Try again.",
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
