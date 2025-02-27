import parse from "html-react-parser";
// End Redux
import green from "@material-ui/core/colors/green";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { closeSnackbar } from "../redux/actions/snackbarActions";

const useStyles = makeStyles((theme) => ({
    snackbar: {
        [theme.breakpoints.down("xs")]: {
            right: 30,
            top: 85, // n2
        },
        [theme.breakpoints.up("md")]: {
            top: 70,
        },
    },
    close: {
        padding: theme.spacing(0.5),
    },
    // colors
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    warning: {
        backgroundColor: blueGrey[800],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: "flex",
        alignItems: "center",
    },
    //
}));

const variantIcon = {
    success: <FontAwesomeIcon icon="check-circle" />,
    warning: <FontAwesomeIcon icon="info-circle" />,
    error: <FontAwesomeIcon icon="exclamation-circle" />,
};

export default function SnackbarRedux() {
    // Redux
    const { isSnackbarOpen, snackbar } = useStoreState((state) => ({
        isSnackbarOpen: state.snackbarReducer.cases.isSnackbarOpen,
        snackbar: state.snackbarReducer.cases,
    }));
    const dispatch = useStoreDispatch();
    const { snackbarStatusColor, snackbarTiming } = snackbar;
    let { snackbarMsg } = snackbar;
    if (typeof snackbarMsg === "string") snackbarMsg = parse(snackbarMsg);
    // End Redux
    const classes = useStyles();

    return (
        <Snackbar
            className={classes.snackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            disableWindowBlurListener // n1
            TransitionComponent={Slide}
            transitionDuration={{ enter: 300, exit: 300 }}
            style={{ zIndex: 30000 }}
            open={isSnackbarOpen}
            autoHideDuration={snackbarTiming || 2000} // This stopped to work with error type, it forced me to put an setTimeout below...
            resumeHideDuration={500} // n3
            onClose={() =>
                setTimeout(
                    () => closeSnackbar(dispatch),
                    snackbarTiming || 2000
                )
            }
            ContentProps={{
                "aria-describedby": "message-id",
                classes: {
                    root: classes[snackbarStatusColor],
                },
            }}
            message={
                <span
                    id="message-id"
                    className={`text-normal ${classes.message}`}
                >
                    <div
                        style={{
                            color: "var(--mainWhite)",
                            fontSize: "1.7em",
                            paddingRight: "8px",
                        }}
                    >
                        {variantIcon[snackbarStatusColor]}
                    </div>
                    {snackbarMsg}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => closeSnackbar(dispatch)}
                >
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    );
}

/* COMMENTS
n1: If true, the autoHideDuration timer will expire even if the window is not focused.
n2: applied to mobile only
n3: The number of milliseconds to wait before dismissing after user interaction
*/
