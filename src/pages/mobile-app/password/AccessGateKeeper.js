import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ProtectionMsg from "../../access-password/ProtectionMsg";
import AccessSwitcher from "../../../components/auth/password/AccessSwitcher";
import { getMultiVar, store } from "../../../hooks/storage/useVar";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";

const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px grey)",
    color: "white",
};

export default function AccessGateKeeper({
    backColor,
    sColor,
    accessClassname,
}) {
    const [data, setData] = useState({
        twoLastCpfDigits: "--",
        rememberAccess: true,
    });
    const { twoLastCpfDigits, rememberAccess } = data;

    useEffect(() => {
        getMultiVar(["twoLastCpfDigits", "rememberAccess"], store.user).then(
            (dataList) => {
                const [cpfDigits, rememberAccess] = dataList;
                setData((prev) => ({
                    ...prev,
                    twoLastCpfDigits: cpfDigits,
                    rememberAccess,
                }));
            }
        );
    }, []);

    const showLoginName = () => (
        <section className={`text-normal ${selectTxtStyle(backColor)}`}>
            CPF: ***.***.***-{twoLastCpfDigits}
        </section>
    );

    const showAccessSwitcher = () => (
        <AccessSwitcher
            rememberAccess={rememberAccess}
            top={0}
            backColor={backColor}
        />
    );

    const showGateKeeperCTAs = () => (
        <section className={accessClassname || "mt-3"}>
            <p
                className={`text-subtitle text-center ${selectTxtStyle(
                    backColor
                )}`}
            >
                Acesso com:
            </p>
            <section className="container-center">
                <Link className="no-text-decoration" to="/senha-de-acesso">
                    <ButtonFab
                        title="SENHA"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="lock" style={awesomeStyle} />
                        }
                        backgroundColor={`var(--themeSDark--${sColor})`}
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </Link>
            </section>
        </section>
    );

    return (
        <section className="text-white text-title text-center">
            {showLoginName()}
            {showAccessSwitcher()}
            {showGateKeeperCTAs()}
            <section className="my-5">
                <ProtectionMsg backColor={backColor} />
            </section>
        </section>
    );
}
