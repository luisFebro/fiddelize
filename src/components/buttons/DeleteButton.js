import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";

DeleteButton.propTypes = {
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
    transform: "scale(0.9)",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "#fff",
};

export default function DeleteButton({
    position,
    top,
    right,
    left,
    bottom,
    onClick,
    transform = "scale(1.2)",
    size = "small",
}) {
    const classes = useStyles();

    return (
        <Fab
            onClick={onClick}
            size={size}
            style={{
                position: position || "relative",
                top,
                right,
                left,
                bottom,
                outline: "none",
                color: "var(--mainWhite)",
                backgroundColor: "var(--expenseRed)",
            }}
            aria-label="Botão deletar"
            className={classes.fab}
        >
            <DeleteIcon style={{ ...muStyle, transform }} />
        </Fab>
    );
}
