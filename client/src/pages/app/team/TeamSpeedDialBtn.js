import React from "react";
import Tooltip from "../../../components/tooltips/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SpeedDialButton from "../../../components/buttons/SpeedDialButton";

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

export default function TeamDialSpeedBtn({ sColor, disableClick }) {
    const styles = getStyles();

    const speedDialActions = [
        //the order rendered is inverse from the bottom to top
        {
            icon: <ExitToAppIcon style={styles.muStyle} />,
            name: "Sair ►",
            backColor: "var(--themeSDark--" + sColor + ")",
            onClick: () => {
                // !disableClick && logout(dispatch);
            },
        },
        {
            icon: <AssignmentIcon style={styles.muStyle} />,
            name: "Tarefas Recentes ►",
            backColor: "var(--themeSDark--" + sColor + ")",
            onClick: () => {
                // !disableClick && openMemberTasks();
                // playBeep();
            },
        },
    ];

    return (
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
    );
}
