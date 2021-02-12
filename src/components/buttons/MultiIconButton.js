import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PropTypes from 'prop-types';

MultiIconButton.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    onClick: PropTypes.func,
    size: PropTypes.string,
    buttonIcon: PropTypes.element.isRequired
};

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1)
    }
}));

export default function MultiIconButton({ top, right, left, bottom, onClick, size, buttonIcon, backColor }) {
    const classes = useStyles();

    return (
        <Fab
            onClick={onClick}
            size={size || 'small'}
            style={{
                position: 'absolute',
                top: `${top || 0}px`,
                right: `${right || 0}px`,
                left: `${left || 0}px`,
                bottom: `${bottom || 0}px`,
                zIndex: 1500,
                outline: 'none',
                color: 'var(--mainWhite)',
                backgroundColor: `${backColor}`
            }}
            aria-label="edit"
            className={(classes.fab, 'shadow-elevation')}
        >
            {buttonIcon}
        </Fab>
    );
}
