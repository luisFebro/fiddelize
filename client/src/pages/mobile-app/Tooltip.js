// cómponents should be pure without intermidiate components handling props. Otherwise it will pop up some ref errors.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import this to component later!!!
import {default as TooltipMU} from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Zoom from '@material-ui/core/Zoom';
import parse from 'html-react-parser';
import  '../../keyframes/pulseWaves.css';

Tooltip.propTypes = {
    title: PropTypes.string.isRequired,
    element: PropTypes.element,
    needAttentionWaves: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    placement: PropTypes.string,
}

const radiusTooltipStyle = makeStyles(theme => ({
    tooltip: {
        fontSize: '15px',
        backgroundColor: 'var(--themeSDark)',
        fontWeight: 'bold',
        borderRadius: '15px 15px',
        padding: '4px auto',
        margin: '40px 0',
        whiteSpace: 'nowrap',
        textShadow: '1px 1px 3px black',
    },
}));

export default function Tooltip({
    title,
    element,
    needAttentionWaves,
    placement,
    needOpen }) {
    const [open, setOpen] = React.useState(false);
    const [stopWave, setStopWave] = React.useState(false);
    // this useEffect solves the problem with uncontrolled vs controlled components handling.
    useEffect(() => {
        if(needOpen) {
            setOpen(true);
        }
    }, [needOpen])

    const handleTooltipClose = () => {
      setOpen(false);
    };

    const handleTooltipOpen = () => {
      setOpen(true);
    };

    const classes = radiusTooltipStyle();

    return(
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div className="position-relative c-pointer" onClick={() => setStopWave(true)}>
                {needAttentionWaves
                ? (
                    <div className={`${stopWave ? "" : "pulse-waves"}`}>
                        <span style={{visibility: 'hidden'}}>.</span>
                    </div>
                ) : null}

                <TooltipMU
                    title={parse(title)}
                    classes={classes}
                    onClick={handleTooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    interactive
                    onClose={handleTooltipClose}
                    open={open}
                    placement={placement || "top"}
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

/* COMMENTS
n1: element only accepts one html tag. If nested, it won't work...
LESSON: empty elements like <i> without an online icon will prevent the tooltip to work properly...
*/

/* ARCHIVES
 let selectedLogic;
    const logic1 = showLevel === elemToOpen ? 'd-block' : 'd-none';
    const logic2 = isOpen ? 'd-block' : 'd-none';

    selectedLogic = logic1;
    if(typeof isOpen === 'boolean') {
        selectedLogic = logic2;
    }
 */