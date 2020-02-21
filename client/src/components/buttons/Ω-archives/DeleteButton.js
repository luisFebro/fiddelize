import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';

DeleteButton.propTypes = {
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

export default function DeleteButton({ top, right, left, bottom, onClick }) {
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
                outline: 'none',
                color: 'var(--mainWhite)',
                backgroundColor: '#4834d4'
            }}
            aria-label="Botão deletar"
            className={classes.fab}
        >
            <DeleteIcon />
        </Fab>
    );
}
