import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import usePro from "init/pro";
import FuncExpModal from "components/pro/func-exp-modal/FuncExpModal";

const AsyncNewRegister = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../app/team/registers-panel/RegistersPanel.js" /* webpackChunkName: "new-member-or-customer-register-page-lazy" */
        ),
});

const AsyncTeamApp = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../app/team/TeamApp.js" /* webpackChunkName: "team-app-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function RegisterPanelBtn({
    title = "CADASTRE O PRIMEIRO",
    size = "large",
    needPlusIcon = false, // for team app's btn
    needTeamApp = false,
    isNewMember = false,
    isCliAdmin = false,
    needRecordTasks = false,
    backColor = "purple",
    sColor = "default",
    needClick = true,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [expModal, setExpModal] = useState(false);
    const { isMainRegisterFuncBlocked } = usePro();

    const handleFullOpen = () => {
        if (isMainRegisterFuncBlocked) return setExpModal(true);
        return setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncComp = needTeamApp ? (
        <AsyncTeamApp isCliAdmin={isCliAdmin} />
    ) : (
        <AsyncNewRegister isNewMember={isNewMember} />
    );

    return (
        <section>
            {needRecordTasks && (
                <ButtonFab
                    size="large"
                    title="CADASTRAR TAREFA"
                    position="relative"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                />
            )}
            {needPlusIcon && (
                <ButtonFab
                    size={size}
                    title={title}
                    iconToLeft
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    onClick={needClick ? handleFullOpen : null}
                    iconMu={PlusIcon}
                    position="relative"
                    variant="extended"
                />
            )}

            {!needPlusIcon && !needRecordTasks && (
                <ButtonFab // used in the dashboard only
                    size={size}
                    title={title}
                    position="relative"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                />
            )}
            <ModalFullContent
                contentComp={AsyncComp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={
                    needTeamApp
                        ? `var(--themeBackground--${backColor})`
                        : "var(--mainWhite)"
                }
            />
            {expModal && <FuncExpModal app="cliente" />}
        </section>
    );
}
