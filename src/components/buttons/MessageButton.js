import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PropTypes from "prop-types";

MessageButton.propTypes = {
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

export default function MessageButton({ top, right, left, bottom, onClick }) {
    const classes = useStyles();

    return (
        <Fab
            onClick={onClick}
            size="small"
            style={{
                position: "absolute",
                top: `${top || 0}px`,
                right: `${right || 0}px`,
                left: `${left || 0}px`,
                bottom: `${bottom || 0}px`,
                outline: "none",
                color: "var(--mainWhite)",
                backgroundColor: "var(--mainDark)",
            }}
            aria-label="Botão de Messagem"
            className={classes.fab}
        >
            <QuestionAnswerIcon />
        </Fab>
    );
}
