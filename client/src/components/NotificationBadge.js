import React from 'react';
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
    badgeNumber,
    right,
    top, }) {
    const BorderedBadge = withStyles(theme => ({
        badge: {
            right: right || -3, //14
            top: top || 1, //18
            border: `2px solid var(--mainDark)`,
            padding: padding || '12px 7px',
            fontSize: fontSize || '19px',
            backgroundColor: 'var(--themeSDark)',
            color: 'white',
            textShadow: '1px 1px 3px black',
        }
    }))(Badge);

    return (
        <BorderedBadge className="" badgeContent={badgeNumber}>
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