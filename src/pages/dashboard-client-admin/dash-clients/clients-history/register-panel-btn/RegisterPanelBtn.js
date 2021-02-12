import React, { useState } from "react";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const AsyncNewRegister = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../app/team/registers-panel/RegistersPanel" /* webpackChunkName: "new-member-or-customer-register-page-lazy" */
        ),
});

const AsyncTeamApp = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../app/team/TeamApp" /* webpackChunkName: "team-app-lazy" */
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

    const handleFullOpen = () => {
        setFullOpen(true);
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
                    backgroundColor={"var(--themeSDark--default)"}
                    variant="extended"
                />
            )}
            {needPlusIcon && (
                <ButtonFab
                    size={size}
                    title={title}
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
                    backgroundColor={`var(--themeSDark--default)`}
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
        </section>
    );
}
