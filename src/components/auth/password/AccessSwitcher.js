import { useState } from "react";
import showToast from "components/toasts";
import { treatBoolStatus } from "api/trigger";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import { Load } from "components/code-splitting/LoadableComp";
import disconnect from "auth/disconnect";
import getColor from "styles/txt";

const AsyncModalYesNo = Load({
    loader: () =>
        import(
            "../../../components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
        ),
});

// By default, the Lembrar acesso is activated. User should disable it manually.
export default function AccessSwitcher({
    rememberAccess, // from indexDB user collection
    top = -70,
    backColor,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleAccessSwitcher = (res) => {
        const status = treatBoolStatus(res);

        if (status === false) {
            setFullOpen(true);
        }
    };

    const getModalCallback = async () => {
        showToast("Desconectando...");
        await disconnect({ rememberAccess: false });
    };

    return (
        <section className="position-relative" style={{ top }}>
            <SwitchBtn
                titleLeft=" "
                titleRight="Lembrar acesso"
                defaultStatus={
                    typeof rememberAccess === "boolean" ? rememberAccess : true
                }
                customColor={`${getColor(backColor).txtColor} text-normal`}
                animationOn={false}
                needCustomColor
                callback={handleAccessSwitcher}
            />
            {fullOpen && (
                <AsyncModalYesNo
                    title="Lembrar Acesso"
                    subTitle="<span>Desabilitando a opção <strong>Lembrar acesso</strong>, você será desconectado da conta atual. Continuar?</span>"
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={getModalCallback}
                />
            )}
        </section>
    );
}
