import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import animateCSS from "../../utils/animateCSS";

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

export default function CustomButton({
    position,
    top,
    right,
    left,
    bottom,
    onClick,
    transform = "scale(1.2)",
    size = "small",
    backgroundColor = "grey",
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
                backgroundColor,
            }}
            aria-label="Botão"
            className={classes.fab}
        >
            <VisibilityOffIcon style={{ ...muStyle, transform }} />
        </Fab>
    );
}
