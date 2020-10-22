import React from "react";
import { treatBoolStatus } from "../../../hooks/api/trigger";
import { setVar, store } from "../../../hooks/storage/useVar";
import SwitchBtn from "../../../components/buttons/material-ui/SwitchBtn";

// By default, the Lembrar acesso is activated. User should disable it manually.
// This should have a modal with the following warning when user switch to disabled:
// Desabilitando a opção Lembrar acesso, você vai precisar digitar CPF e senha em cada sessão. Continuar?
// Also: If first access or Lembrar acesso is disabled, then after CPF is checked, redirect user to password page, then his dashboard directly.
export default function AccessSwitcher({
    rememberAccess, // from indexDB user collection
    top = -70,
}) {
    const handleAccessSwitcher = (res) => {
        const status = treatBoolStatus(res);
        setVar({ rememberAccess: status }, store.user);
    };

    return (
        <section className="position-relative" style={{ top }}>
            <SwitchBtn
                titleLeft=" "
                titleRight="Lembrar acesso"
                defaultStatus={
                    typeof rememberAccess === "boolean" ? rememberAccess : true
                }
                customColor="text-white"
                animationOn={false}
                callback={handleAccessSwitcher}
            />
        </section>
    );
}
