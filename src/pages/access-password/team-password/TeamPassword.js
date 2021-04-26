import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import ToggleVisibilityPassword from "../../../components/forms/fields/ToggleVisibilityPassword";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleEnterPress } from "../../../utils/event/isKeyPressed";
import { checkVerificationPass } from "../../../redux/actions/adminActions";
import useData from "../../../hooks/useData";
import { useAppSystem, useClientAdmin } from "../../../hooks/useRoleData";
import showToast from "../../../components/toasts";
import getAPI, { createTk } from "../../../utils/promises/getAPI";
import authenticate from "../../../components/auth/helpers/authenticate";
import useBackColor from "../../../hooks/useBackColor";

import RadiusBtn from "../../../components/buttons/RadiusBtn";
import { setVar, store } from "../../../hooks/storage/useVar";
import { disconnect } from "../../../hooks/useAuthUser";
import getId from "../../../utils/getId";

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

    const [role, userId, firstName, success] = useData([
        "lastRegisterBizId",
        "role",
        "userId",
        "firstName",
        "success",
    ]);
    const { businessId } = useAppSystem();
    const dispatch = useStoreDispatch();

    const { selfThemeBackColor: backColor } = useClientAdmin();
    useBackColor(`var(--themeBackground--${backColor})`);

    const styles = getStyles();

    const checkAccess = async () => {
        if (userId === "...") return;

        const bodyToSend = {
            pass,
            bizId: businessId,
        };

        const res = await checkVerificationPass(dispatch, bodyToSend);

        if (!res || res.status === 500)
            return showToast("Algo deu errado. Verifique sua conexão.", {
                type: "error",
            });
        if (res.status === 401)
            return showToast(res.data.msg, { type: "error" });

        if (res.data.msg) {
            // authorize user first
            const body = {
                _id: userId,
                bizId: businessId,
                role,
                nT: getId(),
            };

            const { data: token } = await getAPI({
                method: "post",
                url: createTk(),
                body,
            });

            await authenticate(token, { history, role });
        }
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
                setVar({ disconnectCliMember: true }, store.user),
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
