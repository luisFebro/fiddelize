import React, { Fragment, useState } from "react";
import Tooltip from "../../../components/tooltips/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SpeedDialButton from "../../../components/buttons/SpeedDialButton";
import ModalFullContent from "../../../components/modals/ModalFullContent";
import { Load } from "../../../components/code-splitting/LoadableComp";
import { useStoreDispatch } from "easy-peasy";
import { logout } from "../../../redux/actions/authActions";

export const AsyncMemberTasksHistory = Load({
    loader: () =>
        import(
            "./member-tasks-history/AsyncMemberTasksHistory" /* webpackChunkName: "member-tasks-history-lazy" */
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
        filter: ``, // drop-shadow(0 0 8px #ffc)
    },
});

export default function TeamDialSpeedBtn({ sColor, disableClick, history }) {
    const [memberTasks, openMemberTasks] = useState(false);
    const styles = getStyles();

    const dispatch = useStoreDispatch();

    const speedDialActions = [
        //the order rendered is inverse from the bottom to top
        {
            icon: <ExitToAppIcon style={styles.muStyle} />,
            name: "Sair ►",
            backColor: "var(--themeSDark--" + sColor + ")",
            onClick: () => {
                if (!disableClick) {
                    (async () => {
                        await logout(dispatch);
                        history.push("/senha-equipe");
                    })();
                }
            },
        },
        {
            icon: <AssignmentIcon style={styles.muStyle} />,
            name: "Tarefas Recentes ►",
            backColor: "var(--themeSDark--" + sColor + ")",
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
                tooltipOpen={true}
                backColor={"var(--themeSDark--" + sColor + ")"}
                size="large"
                FabProps={{
                    backgroundColor: "var(--themeSDark--" + sColor + ")",
                    size: "medium",
                    filter: `drop-shadow(.5px .5px 3px black)`, // still not working
                }}
                hidden={false}
            />
            {memberTasks && (
                <ModalFullContent
                    contentComp={<AsyncMemberTasksHistory />}
                    fullOpen={memberTasks}
                    setFullOpen={openMemberTasks}
                />
            )}
        </Fragment>
    );
}
