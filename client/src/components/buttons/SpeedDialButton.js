import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import MultiIconButton from "./MultiIconButton";
// import EditIcon from '@material-ui/icons/Edit';
import PropTypes from "prop-types";

SpeedDialButton.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    direction: PropTypes.string,
    tooltipOpen: PropTypes.bool,
    FabProps: PropTypes.shape({
        size: PropTypes.oneOf(["large", "medium", "small"]),
        backgroundColor: PropTypes.string,
    }),
};

// const styles = {
//     fabIcon: {
//         textShadow: '.5px .5px 3px black',
//     },
//     muStyle: {
//         transform: 'scale(1.2)',
//         filter:  'drop-shadow(.5px .5px 1.5px black)',
//         color: '#fff',
//     }
// }

export default function SpeedDialButton({
    actions,
    direction,
    tooltipOpen,
    backColor,
    FabProps,
    onClick,
    root,
    hidden,
}) {
    const [isOpen, setOpen] = React.useState(false);

    const useStyles = makeStyles({
        staticTooltipLabel: {
            padding: "5px",
            color: "#fff",
            width: "auto",
            minWidth: "190px",
            textAlign: "center",
            backgroundColor: backColor || "var(--themeSDark)",
            font: "bold 17px var(--mainFont)",
            borderRadius: "30px",
            filter: "drop-shadow(.001em .1em .007em var(--mainWhite))",
        },
        staticTooltip: {
            filter: "drop-shadow(.001em .1em .1em var(--mainWhite))",
            textShadow: "1px 1px 3px black",
        },
    });
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const styles = {
        root: {
            zIndex: 1501,
            position: root.position || "fixed",
            top: root.top, // LESSON: do not use 0 as default
            left: root.left,
            bottom: root.bottom,
            right: root.right,
            // display: 'flex',
            // transform: 'translateZ(0px)',
            // flexGrow: 1
            // justifyContent: 'center',
            // alignItems: 'center',
            // height: 300, // this makes the button to be reallocated
        },
    };

    return (
        <div style={styles.root}>
            <Backdrop open={isOpen} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                hidden={hidden || false}
                icon={<SpeedDialIcon openIcon={null} />}
                onClick={onClick}
                onClose={handleClose}
                direction={direction || "up"}
                FabProps={{
                    style: {
                        backgroundColor: FabProps.backgroundColor || "#000",
                        outline: "none",
                        filter:
                            "drop-shadow(.001em .1em .1em var(--mainWhite))",
                    },
                    size: FabProps.size || "large",
                    icon: styles.muStyle,
                }}
                onOpen={handleOpen}
                open={isOpen}
            >
                {isOpen
                    ? actions.map((action) => (
                          <SpeedDialAction
                              key={action.name}
                              icon={
                                  <MultiIconButton
                                      backColor={action.backColor}
                                      buttonIcon={action.icon}
                                  />
                              }
                              tooltipPlacement="left"
                              tooltipTitle={action.name}
                              classes={{
                                  staticTooltipLabel:
                                      classes.staticTooltipLabel,
                                  staticTooltip: classes.staticTooltip,
                              }}
                              tooltipOpen={tooltipOpen || false}
                              onClick={() => {
                                  action.onClick();
                                  handleClose();
                              }}
                              FabProps={{
                                  style: {
                                      color: "#fff",
                                      textShadow: "1px 1px 3px black",
                                  },
                              }}
                          />
                      ))
                    : null}
            </SpeedDial>
        </div>
    );
}
