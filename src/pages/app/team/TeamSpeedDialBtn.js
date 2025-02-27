import { Fragment, useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import HelpIcon from "@material-ui/icons/Help";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpeedDialButton from "components/buttons/SpeedDialButton";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import disconnect from "auth/disconnect";

export const AsyncTeamTasksList = Load({
    loader: () =>
        import(
            "./team-tasks-history/AsyncTeamTasksList" /* webpackChunkName: "member-tasks-history-list-lazy" */
        ),
});

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.1)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
    fabRoot: {
        bottom: "45px",
        right: "15px",
    },
    fabTooltip: {
        backgroundColor: "var(--lightYellow)",
        color: "var(--mainDark)",
        filter: "", // drop-shadow(0 0 8px #ffc)
    },
});

export default function TeamDialSpeedBtn({ sColor, disableClick, history }) {
    const [teamTasks, openTeamTasks] = useState(false);

    const styles = getStyles();

    const speedDialActions = [
        // the order rendered is inverse from the bottom to top
        {
            icon: <ExitToAppIcon style={styles.muStyle} />,
            name: "Sair ►",
            backColor: `var(--themeSDark--${sColor})`,
            onClick: async () => {
                if (!disableClick) await disconnect({ msg: true });
            },
        },
        {
            icon: <HelpIcon style={styles.muStyle} />,
            name: "Suporte ►",
            backColor: `var(--themeSDark--${sColor})`,
            onClick: () => {
                if (!disableClick) history.push("/suporte");
            },
        },
        {
            icon: (
                <FontAwesomeIcon
                    icon="sync-alt"
                    style={{ ...styles.muStyle, transform: "scale(1.3)" }}
                />
            ),
            name: "Trocar App ►",
            backColor: `var(--themeSDark--${sColor})`,
            onClick: () => {
                if (!disableClick) history.push("/painel-de-apps");
                // playBeep();
            },
        },
        {
            icon: <AssignmentIcon style={styles.muStyle} />,
            name: "Tarefas Recentes ►",
            backColor: `var(--themeSDark--${sColor})`,
            onClick: () => {
                if (!disableClick) openTeamTasks(true);
                // playBeep();
            },
        },
    ];

    return (
        <Fragment>
            <SpeedDialButton
                actions={speedDialActions}
                root={styles.fabRoot}
                onClick={null} // playBeep
                tooltipOpen
                backColor={`var(--themeSDark--${sColor})`}
                size="large"
                FabProps={{
                    backgroundColor: `var(--themeSDark--${sColor})`,
                    size: "medium",
                    filter: "drop-shadow(.5px .5px 3px black)", // still not working
                }}
                hidden={false}
            />
            {teamTasks && (
                <ModalFullContent
                    contentComp={<AsyncTeamTasksList />}
                    fullOpen={teamTasks}
                    setFullOpen={openTeamTasks}
                    needIndex={false}
                />
            )}
        </Fragment>
    );
}
