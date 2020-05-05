import React, { useState, useEffect } from 'react';
// import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

NotificationBadge.propTypes = {
    badgeNumber: PropTypes.number.isRequired,
    children: PropTypes.element,
    padding: PropTypes.string,
    fontSize: PropTypes.string,
    right: PropTypes.number,
    top: PropTypes.number,
}

export default function NotificationBadge({
    children,
    padding,
    fontSize,
    badgeValue,
    badgeInvisible,
    backgroundColor,
    borderColor,
    right,
    top, }) {
    const [invisible, setInvisible] = useState(true);
    const [value, setValue] = useState(0);

    useEffect(() => {
        setTimeout(() => { setValue(badgeValue); setInvisible(false);}, 5000);
    }, [])

    useEffect(() => {
        badgeInvisible && setInvisible(true);
    }, [badgeInvisible])

    const BorderedBadge = withStyles(theme => ({
        badge: {
            right: right || -3, //14
            top: top || 1, //18
            height: 0,
            maxWidth: '16px',
            padding: '16px',
            border: `3px solid ${borderColor ? borderColor : "var(--mainDark)"}`,
            font: `bold ${fontSize || '22px'} var(--mainFont)`,
            backgroundColor: backgroundColor || 'var(--themeSDark)',
            color: 'white',
            borderRadius: '50%',
            textShadow: '1px 1px 3px black',
        }
    }))(Badge);

    return (
        <BorderedBadge
            badgeContent={value}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            invisible={invisible}
            showZero={false}
            max={99}
            overlap="rectangle"
            variant="standard"
        >
            {children}
        </BorderedBadge>
    );
}


/* REFERENCES - babadoo
<IconButton href="" className="no-outline" style={{color: 'var(--mainWhite)'}} onClick={handleClick}>
    <BorderedBadge className="animated bounce slow" badgeContent={allMessagesList.length}>
        <NotificationsIcon className="icon-svg" />
    </BorderedBadge>
</IconButton>
<StyledMenu id="customized-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
    {allMessagesList.length === 0 ? (
        ...
*/