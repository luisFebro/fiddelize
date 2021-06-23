import { Fragment, useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import HelpIcon from "@material-ui/icons/Help";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";
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
        bottom: "15px",
        right: "15px",
    },
    fabTooltip: {
        backgroundColor: "var(--lightYellow)",
        color: "var(--mainDark)",
        filter: "", // drop-shadow(0 0 8px #ffc)
    },
});

export default function TeamDialSpeedBtn({ sColor, disableClick, history }) {
    const [memberTasks, openMemberTasks] = useState(false);

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
                showToast("Um momento. Redirecionando...", { dur: 12000 });
                window.location.href = `https://api.whatsapp.com/send?phone=5592992817363`;
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
                !disableClick && history.push("/painel-de-apps");
                // playBeep();
            },
        },
        {
            icon: <AssignmentIcon style={styles.muStyle} />,
            name: "Tarefas Recentes ►",
            backColor: `var(--themeSDark--${sColor})`,
            onClick: () => {
                !disableClick && openMemberTasks(true);
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
            {memberTasks && (
                <ModalFullContent
                    contentComp={<AsyncTeamTasksList />}
                    fullOpen={memberTasks}
                    setFullOpen={openMemberTasks}
                    needIndex={false}
                />
            )}
        </Fragment>
    );
}
