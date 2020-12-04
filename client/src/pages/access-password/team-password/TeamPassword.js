import React, { useState } from "react";
import ToggleVisibilityPassword from "../../../components/forms/fields/ToggleVisibilityPassword";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleEnterPress } from "../../../utils/event/isKeyPressed";
import { checkVerificationPass } from "../../../redux/actions/adminActions";
import useData from "../../../hooks/useData";
import { useAppSystem } from "../../../hooks/useRoleData";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import getAPI, { getAuthTk } from "../../../utils/promises/getAPI";
import authenticate from "../../../components/auth/helpers/authenticate";

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

    const [bizId, role, userId, firstName] = useData([
        "lastRegisterBizId",
        "role",
        "userId",
        "firstName",
    ]);
    const { businessId } = useAppSystem();
    const dispatch = useStoreDispatch();

    const styles = getStyles();

    const checkAccess = async () => {
        if (userId === "...") return;

        const bodyToSend = {
            pass,
            bizId: bizId || businessId,
        };

        const res = await checkVerificationPass(dispatch, bodyToSend);

        if (!res || res.status === 500)
            return showSnackbar(
                dispatch,
                "Algo deu errado. Verifique sua conexão.",
                "error"
            );
        if (res.status === 401)
            return showSnackbar(dispatch, res.data.msg, "error");

        if (res.data.msg) {
            // authorize user first
            const body = {
                _id: userId,
                role,
            };

            const { data: token } = await getAPI({
                method: "post",
                url: getAuthTk(),
                body,
            });

            await authenticate(token, { history, role });
            showSnackbar(dispatch, `Olá de volta, ${firstName}!`, "success");
        }
    };

    return (
        <section>
            <h1 className="my-3 mx-3 text-subtitle text-white text-center">
                Insira senha de verificação
            </h1>
            <div>
                <ToggleVisibilityPassword
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
