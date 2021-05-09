import { useState } from "react";
import authenticate from "auth/authenticate";
import ToggleVisibilityPassword from "components/forms/fields/ToggleVisibilityPassword";
import handleChange from "utils/form/use-state/handleChange";
import { handleEnterPress } from "utils/event/isKeyPressed";
import useData, { useBizData } from "init";
import { setVar } from "init/var";
import showToast from "components/toasts";
import getAPI, { createTk, checkVerificationPass } from "api";
import useBackColor from "hooks/useBackColor";
import RadiusBtn from "components/buttons/RadiusBtn";
import disconnect from "auth/disconnect";
import getId from "utils/getId";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "26px",
        fontFamily: "var(--mainFont)",
        padding: "10px 14px",
        zIndex: 2000,
    },
});

export default function TeamPassword({ history }) {
    const [data, setData] = useState({
        pass: "",
    });
    const { pass } = data;

    const [role, userId, firstName] = useData(["role", "userId", "firstName"]);

    const { bizId, themeBackColor: backColor } = useBizData();
    useBackColor(`var(--themeBackground--${backColor})`);

    const styles = getStyles();

    const checkAccess = async () => {
        if (userId === "...") return null;

        const body = {
            pass,
            bizId,
        };
        const dataAPI = await getAPI({
            method: "post",
            url: checkVerificationPass(),
            body,
            needAuth: false,
            fullCatch: true,
            loader: true,
        }).catch((err) => {
            if (err.status !== 200)
                return showToast(
                    "Algo deu errado ao verificar nova senha. Tente novamente",
                    { type: "error" }
                );

            return null;
        });
        if (!dataAPI) return null;

        // authorize user first
        const bodyForToken = {
            _id: userId,
            bizId,
            role,
            nT: getId(),
        };

        const token = await getAPI({
            method: "post",
            url: createTk(),
            body: bodyForToken,
        });

        await authenticate(token, { history, role });
    };

    const handleLogout = () => {
        // device verification temp disable for cli members
        /*
            await getAPI({
                // await is displayed here cuz getAPI is a function. As a demand, all these elements should be a Promise instead. All the others are promises, they do not need it.
                method: "put",
                url(userId),
                body: { "clientMemberData.isLoggedIn": false },
                params: { thisRole: "cliente-membro" },
            }),
         */
        (async () => {
            showToast("Saindo da conta...");
            await Promise.all([
                setVar({ disconnectCliMember: true }, "user"),
                disconnect(),
            ]);
        })();
    };

    const showLogoutBtn = () => (
        <RadiusBtn
            position="absolute"
            backgroundColor="var(--mainRed)"
            title="sair conta"
            top={0}
            right={20}
            size="extra-small"
            fontSize="15px"
            onClick={handleLogout}
        />
    );

    return (
        <section>
            {showLogoutBtn()}
            <h1
                className="mx-3 text-subtitle text-white text-center"
                style={{
                    marginTop: "2rem",
                    marginBottom: "3rem",
                    lineHeight: "30px",
                }}
            >
                {firstName}, insira senha de verificação
            </h1>
            <div className="container-center">
                <ToggleVisibilityPassword
                    maxWidth={400}
                    style={styles.fieldFormValue}
                    onChange={handleChange(setData, data)}
                    label=" "
                    onKeyPress={(e) => handleEnterPress(e, checkAccess)}
                    name="pass"
                    value={pass}
                    autoFocus
                    autoComplete="off"
                />
            </div>
        </section>
    );
}

/* ARCHIVES
if (role === "cliente-membro") {
    showToast(
        dispatch,
        `Olá de volta, ${firstName}!`,
        "success"
    );

    // call fundamental admin data
}
 */
