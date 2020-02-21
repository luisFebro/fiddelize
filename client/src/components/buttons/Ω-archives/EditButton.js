import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';

EditButton.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number
};

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1)
    }
}));

export default function EditButton({ top, right, left, bottom, onClick }) {
    const classes = useStyles();

    return (
        <Fab
            onClick={onClick}
            size="small"
            style={{
                position: 'absolute',
                top: `${top || 0}px`,
                right: `${right || 0}px`,
                left: `${left || 0}px`,
                bottom: `${bottom || 0}px`,
                zIndex: 1500,
                outline: 'none',
                color: 'var(--mainWhite)',
                backgroundColor: 'var(--mainYellow)'
            }}
            aria-label="edit"
            className={classes.fab}
        >
            <EditIcon />
        </Fab>
    );
}
