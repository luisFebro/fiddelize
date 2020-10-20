import React from "react";
import SwitchBtn from "../../../components/buttons/material-ui/SwitchBtn";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ProtectionMsg from "../../access-password/ProtectionMsg";

const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px grey)",
    color: "white",
};

export default function AccessGateKeeper() {
    const twoLastCpfDigits = "42";

    const showLoginName = () => (
        <section className="text-normal text-white">
            CPF: ***.***.***-{twoLastCpfDigits}
        </section>
    );

    // By default, the Lembrar acesso is activated. User should disable it manually.
    //This should have a modal with the following warning when user switch to disabled:
    // Desabilitando a opção Lembrar acesso, você vai precisar digitar CPF e senha em cada sessão. Continuar?
    // Also: If first access or Lembrar acesso is disabled, then after CPF is checked, redirect user to password page, then his dashboard directly.
    const showAccessSwitcher = () => (
        <SwitchBtn
            titleLeft=" "
            titleRight="Lembrar acesso"
            defaultStatus="true"
            customColor="var(--mainWhite)"
            animationOn={false}
        />
    );

    const showGateKeeperCTAs = () => (
        <section className="mt-3">
            <p className="text-subtitle text-white text-center">Acesso com:</p>
            <section className="container-center">
                <div style={{ marginRight: "25px" }}>
                    <ButtonFab
                        title="GOOGLE"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="lock" style={awesomeStyle} />
                        }
                        backgroundColor="var(--themeSDark--default)"
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
                <Link className="no-text-decoration" to="/senha-de-acesso">
                    <ButtonFab
                        title="SENHA"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="lock" style={awesomeStyle} />
                        }
                        backgroundColor="var(--themeSDark--default)"
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
                <ProtectionMsg />
            </section>
        </section>
    );
}
