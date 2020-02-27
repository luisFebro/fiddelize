import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {default as TooltipMU} from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Zoom from '@material-ui/core/Zoom';
import parse from 'html-react-parser';
import  '../../keyframes/pulseWaves.css';

Tooltip.propTypes = {
    title: PropTypes.string.isRequired,
    elemToOpen: PropTypes.any,
    showLevel: PropTypes.any,
    element: PropTypes.element,
}

const radiusTooltipStyle = makeStyles(theme => ({
    tooltip: {
        position: 'absolute',
        top: '-85px',
        left: '-10px',
        fontSize: '15px',
        backgroundColor: 'var(--themeSDark)',
        fontWeight: 'bold',
        borderRadius: '15px 15px',
        padding: '4px 8px',
        whiteSpace: 'nowrap',
    },
}));

export default function Tooltip({ title, isOpen, elemToOpen, showLevel, element }) {
    const [open, setOpen] = React.useState(false);
    const [stopWave, setStopWave] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };

    const handleTooltipOpen = () => {
      setOpen(true);
    };

    const classes = radiusTooltipStyle();
    let selectedLogic;
    const logic1 = showLevel === elemToOpen ? 'd-block' : 'd-none';
    const logic2 = isOpen ? 'd-block' : 'd-none';

    selectedLogic = logic1;
    if(typeof isOpen === 'boolean') {
        selectedLogic = logic2;
    }

    return(
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div className="position-relative c-pointer" onClick={() => setStopWave(true)}>
                <div className={`${stopWave ? "" : "pulse-waves"}`}>
                    <span style={{visibility: 'hidden'}}>.</span>
                </div>
                <TooltipMU
                    title={parse(title)}
                    classes={classes}
                    onClick={handleTooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    interactive
                    arrow
                    onClose={handleTooltipClose}
                    open={open}
                    placement="top"
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 200 }}
                    PopperProps={{ disablePortal: true }}
                >
                    {element}
                </TooltipMU>
            </div>

        </ClickAwayListener>
    );
}

/* ARCHIVES

 */