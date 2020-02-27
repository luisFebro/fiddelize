import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import MultiIconButton from './MultiIconButton';
// import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';

SpeedDialButton.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    direction: PropTypes.string,
    tooltipOpen: PropTypes.bool,
    FabProps: PropTypes.shape({
        size: PropTypes.oneOf(["large", 'medium', 'small']),
        backgroundColor: PropTypes.string,
    }),
};

const useStyles = makeStyles({
    staticTooltipLabel: {
        color: 'var(--mainWhite)',
        width: '245px',
        textAlign: 'center',
        backgroundColor: 'var(--themeSDark)',
        font: 'bold 17px var(--mainFont)',
    },
    staticTooltip: {
        textShadow: '1px 1px 3px black',
    }
});

const styles = {
    fabIcon: {
        textShadow: '.5px .5px 3px black',
    }
}

export default function SpeedDialButton({
    actions,
    direction,
    tooltipOpen,
    FabProps,
    root,
    hidden }) {
    const classes = useStyles();
    const [isOpen, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const styles = {
        root: {
            zIndex: 1501,
            position: root.position || 'fixed',
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
    }

    return (
        <div style={styles.root}>
            <Backdrop open={isOpen} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                hidden={hidden || false}
                icon={<SpeedDialIcon openIcon={null} />}
                onClose={handleClose}
                direction={direction || "up"}
                FabProps={{
                    style: {
                        backgroundColor: FabProps.backgroundColor || '#000',
                        outline: 'none',
                    },
                    size: FabProps.size || 'large',
                }}
                onOpen={handleOpen}
                open={isOpen}
            >
                {isOpen
                ? actions.map(action => (
                    <SpeedDialAction
                        key={action.name}
                        icon={<MultiIconButton backColor={action.backColor} buttonIcon={action.icon} />}
                        tooltipPlacement="left"
                        tooltipTitle={action.name}
                        classes={{
                            staticTooltipLabel: classes.staticTooltipLabel,
                            staticTooltip: classes.staticTooltip
                        }}
                        tooltipOpen={tooltipOpen || false}
                        onClick={() => {
                            action.onClick();
                            handleClose();
                        }}
                        FabProps={{
                            style: {
                                textShadow: '1px 1px 3px black',
                            },
                        }}
                    />
                )) : null}
            </SpeedDial>
        </div>
    );
}
