import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CLIENT_URL } from "config/clientUrl";
import ToggleVisibilityPassword from "components/forms/fields/ToggleVisibilityPassword";
import handleChange from "utils/form/use-state/handleChange";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import showToast from "components/toasts";
import { updateUser } from "api/frequent";
import getAPI, { readVerificationPass } from "api";
import setValObjWithStr from "utils/objects/setValObjWithStr";
import { useBizData } from "init";
import useAnimateElem from "hooks/scroll/useAnimateElem";
import { setVar } from "init/var";

const isSmall = window.Helper.isSmallScreen();

const styles = {
    form: {
        maxWidth: "350px",
        width: "100%",
        background: "var(--themeSDark)",
        borderRadius: "10px",
        padding: "25px",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "26px",
        fontFamily: "var(--mainFont)",
        // textAlign: 'center', it does not works
        padding: "10px 14px",
        zIndex: 2000,
    },
    lockIcon: {
        top: 0,
        left: "-70px",
        zIndex: 3000,
    },
};

export default function ShowPasswordForm({
    isFromCliAdminDash = false,
    dataFromPassPage = {},
    btnAction,
}) {
    const [error, setError] = useState("");
    const [data, setData] = useState({
        clientAdminData: { verificationPass: "" }, // We can simply declare clientAdminData.verificationPass in the sendDataToBackend obj
    });
    const { clientAdminData } = data;

    useAnimateElem(".password-form--comp", {
        animaIn: "bounceInUp",
        speed: "normal",
    });

    const { bizId } = useBizData();

    // const { history } = dataFromPassPage;
    // const { clientAdminName } = dataFromPassPage;
    // const { bizLinkName } = dataFromPassPage;

    useEffect(() => {
        if (isFromCliAdminDash) {
            (async () => {
                const res = await getAPI({
                    url: readVerificationPass(bizId),
                    fullCatch: true,
                    loader: false,
                }).catch((err) => {
                    if (err.status !== 200)
                        return console.log("CODE ERROR: There is no bizId...");
                    return null;
                });
                if (!res) return null;

                const passValue = res.data.verificationPass;
                const keyName = "clientAdminData.verificationPass";

                setValObjWithStr(data, keyName, passValue);
                const newObj = data;
                return setData({ ...data, ...newObj });
            })();
        }
    }, [bizId]);

    const sendDataBackend = () => {
        if (!clientAdminData.verificationPass) {
            setError(true);
            showToast("Você precisa inserir a senha de verificação", {
                type: "error",
            });
            return;
        }

        const dataToSend = {
            "clientAdminData.verificationPass":
                clientAdminData.verificationPass,
        };

        showToast("Ok, registrando...");
        updateUser(bizId, dataToSend, {
            thisRole: "cliente-admin",
        }).then((res) => {
            if (res.status !== 200)
                return showToast(res.data.msg, { type: "error" });

            setVar(
                { verifPass: clientAdminData.verificationPass },
                "user"
            ).then((res) => {
                if (isFromCliAdminDash) {
                    showToast("Senha foi alterada!", { type: "success" });
                } else {
                    btnAction(true);
                }
            });
        });
    };

    const showButtonAction = () => (
        <div className="container-center" style={{ marginTop: "20px" }}>
            <ButtonMulti
                title={isFromCliAdminDash ? "Alterar senha" : "Continuar"}
                needParse
                onClick={() => {
                    sendDataBackend();
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="save" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    const handleBottomValues = () => {
        if (isFromCliAdminDash) {
            return "";
        }
        return isSmall ? "-50px" : "-300px";
    };

    return (
        <div
            style={{ zIndex: 1000, bottom: handleBottomValues() }}
            className="password-form--comp mt-4 position-relative container-center"
        >
            <form
                className="shadow-elevation margin-auto-95"
                onBlur={() => setError("")}
                style={styles.form}
            >
                <div className="animated zoomIn fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold">
                    <p className="text-shadow">
                        {isFromCliAdminDash
                            ? "Altere aqui sua senha sempre que precisar"
                            : "Insira aqui sua senha de verificação"}
                    </p>
                    <div className="position-relative">
                        <ToggleVisibilityPassword
                            showGeneratePass
                            generatePassObj={{
                                setObj: setData,
                                obj: data,
                            }}
                            style={styles.fieldFormValue}
                            onChange={handleChange(setData, data, true)}
                            label=" "
                            name="clientAdminData.verificationPass"
                            value={clientAdminData.verificationPass}
                        />
                        <div
                            style={styles.lockIcon}
                            className="position-absolute"
                        >
                            <img
                                src={`${CLIENT_URL}/img/icons/lock.svg`}
                                className="svg-elevation"
                                width={90}
                                height="auto"
                                alt="cadeado"
                            />
                        </div>
                    </div>
                </div>
                {showButtonAction()}
            </form>
        </div>
    );
}
