// End Redux
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { CardMedia } from "@material-ui/core";
import Button from "@material-ui/core/Button";
// import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { addElemArrayUser } from "../../redux/actions/userActions";
import { closeModal } from "../../redux/actions/modalActions";

ModalDefault.propTypes = {
    propTitle: PropTypes.string,
    propMsg: PropTypes.string,
    propTxtBtn: PropTypes.string,
    objToSend: PropTypes.object,
    closeAnimation: PropTypes.func,
};
// End Material UI

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    media: {
        height: 50,
        width: "50%",
        margin: "auto",
    },
}));

export default function ModalDefault({
    propTitle,
    propMsg,
    propTxtBtn,
    objToSend,
    closeAnimation,
}) {
    const { isModalDefaultOpen, _idUser } = useStoreState((state) => ({
        isModalDefaultOpen: state.modalReducers.cases.isModalDefaultOpen,
        _idUser: state.userReducer.cases.currentUser._id,
    }));
    const dispatch = useStoreDispatch();

    const setObjToSend = () => {
        const data = objToSend;
        addElemArrayUser(dispatch, data, _idUser);
    };

    const classes = useStyles();
    return (
        <div>
            <Dialog
                style={{ zIndex: 1500 }}
                open={isModalDefaultOpen}
                aria-labelledby="form-dialog-title"
            >
                <CardMedia
                    className={classes.media}
                    image="img/babadoo-logo_no-slogon.png"
                    title="loja babadoo"
                />
                <DialogTitle id="form-dialog-title">{propTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className="text-main-container">{propMsg}</span>
                    </DialogContentText>
                    <section>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "28px",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    closeModal(dispatch);
                                }}
                                color="primary"
                            >
                                Voltar
                            </Button>
                            <Button
                                onClick={() => {
                                    setObjToSend();
                                    showSnackbar(
                                        dispatch,
                                        "Cupom de Desconto Adicionado!",
                                        "success"
                                    );
                                    closeModal(dispatch);
                                    closeAnimation();
                                }}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                {propTxtBtn}
                                <i
                                    className="fas fa-paper-plane"
                                    style={{ marginLeft: "5px" }}
                                />
                            </Button>
                        </div>
                    </section>
                </DialogContent>
            </Dialog>
        </div>
    );
}
