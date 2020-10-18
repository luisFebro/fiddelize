import React from "react";
import SwitchBtn from "../../../components/buttons/material-ui/SwitchBtn";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const awesomeStyle = {
    fontSize: "30px",
    filter: "drop-shadow(.5px .5px 1.5px grey)",
    color: "white",
};

const getStyles = () => ({
    rootProtectionMsg: {
        border: "1px solid #fff",
        borderRadius: "30px",
        padding: "10px",
    },
    miniLock: {
        fontSize: "20px",
        color: "white",
    },
});

export default function AccessGateKeeper() {
    const twoLastCpfDigits = "42";

    const styles = getStyles();

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

    const showProtectionMsg = () => (
        <section className="my-5" style={styles.rootProtectionMsg}>
            <p className="font-weight-bold text-small text-center text-white">
                <FontAwesomeIcon
                    className="mr-3"
                    icon="lock"
                    style={styles.miniLock}
                />
                Nunca compartilhe sua senha.
            </p>
            <p className="text-small text-center text-white">
                A Fiddelize não pedirá
                <br />
                sua senha por email ou
                <br />
                outros meios online.
            </p>
        </section>
    );

    return (
        <section className="text-white text-title text-center">
            {showLoginName()}
            {showAccessSwitcher()}
            {showGateKeeperCTAs()}
            {showProtectionMsg()}
        </section>
    );
}
