import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import { treatBoolStatus } from "../../../hooks/api/trigger";
import { setVar, store } from "../../../hooks/storage/useVar";
import SwitchBtn from "../../buttons/material-ui/SwitchBtn";
import { logout } from "../../../redux/actions/authActions";
import { Load } from "../../code-splitting/LoadableComp";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
// import { useClientAdmin } from '../../../hooks/useRoleData';

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

    const dispatch = useStoreDispatch();

    const handleAccessSwitcher = (res) => {
        const status = treatBoolStatus(res);

        if (status === false) {
            setFullOpen(true);
        }
    };

    const getModalCallback = async () => {
        showSnackbar(dispatch, "Desconectando...", "warning");
        await setVar({ rememberAccess: false }, store.user);
        logout(dispatch, { needReload: true });
    };

    return (
        <section className="position-relative" style={{ top }}>
            <SwitchBtn
                titleLeft=" "
                titleRight="Lembrar acesso"
                defaultStatus={
                    typeof rememberAccess === "boolean" ? rememberAccess : true
                }
                customColor={`${selectTxtStyle(backColor)} text-normal`}
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
