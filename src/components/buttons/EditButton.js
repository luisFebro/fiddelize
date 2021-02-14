import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import PropTypes from "prop-types";

EditButton.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
};

const useStyles = makeStyles((theme) => ({
    fab: {
        margin: theme.spacing(1),
    },
}));

const muStyle = {
    transform: "scale(1.2)",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "#fff",
};

export default function EditButton({
    disabled,
    position,
    top,
    right,
    left,
    bottom,
    onClick,
}) {
    const classes = useStyles();

    return (
        <Fab
            onClick={onClick}
            size="small"
            disabled={disabled}
            style={{
                position: position || "relative",
                top: `${top || 0}px`,
                right: `${right || 0}px`,
                left: `${left || 0}px`,
                bottom: `${bottom || 0}px`,
                zIndex: 1500,
                outline: "none",
                color: "var(--mainWhite)",
                backgroundColor: "var(--themeSDark)",
            }}
            aria-label="edit"
            className={classes.fab}
        >
            <EditIcon style={muStyle} />
        </Fab>
    );
}
