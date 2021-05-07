import { useState } from "react";
// Redux

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { CardMedia } from "@material-ui/core";
import Button from "@material-ui/core/Button";
// import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import { sendNotification } from "../../redux/actions/userActions";
import { closeModal } from "../../redux/actions/modalActions";

ModalTextField.propTypes = {
    currItemFound: PropTypes.shape({
        propTitle: PropTypes.string,
        propSubTitle: PropTypes.string,
        propTxtBtn: PropTypes.string,
        // mainSubject: PropTypes.string,
        objToSend: PropTypes.object,
    }),
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
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export default function ModalTextField({ currItemFound }) {
    const [newMessage, setNewMessage] = useState("");
    const { isModalTextFieldOpen } = useStoreState((state) => ({
        isModalTextFieldOpen: state.modalReducers.cases.isModalTextFieldOpen,
    }));
    const dispatch = useStoreDispatch();
    const name = currItemFound ? currItemFound.name : null;
    const _idClient = currItemFound ? currItemFound._id : null;
    const propTxtBtn = currItemFound ? currItemFound.propTxtBtn : null;
    // const mainSubject = currItemFound ? currItemFound.mainSubject : null;
    const objToSend = currItemFound ? currItemFound.objToSend : null;
    const propTitle = currItemFound ? currItemFound.propTitle : null;
    const propSubTitle = currItemFound ? currItemFound.propSubTitle : null;
    const mainKey = currItemFound ? currItemFound.mainKey : null;

    const setObjToSend = () => {
        const data = objToSend;
        objToSend.messageList.message = newMessage.message;
        sendNotification(dispatch, data, _idClient);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setNewMessage({ [name]: value });
    };

    const classes = useStyles();
    return (
        <div>
            <Dialog
                style={{ zIndex: 1500 }}
                open={isModalTextFieldOpen}
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
                        <span className="">{propSubTitle}</span>
                    </DialogContentText>
                    <form onChange={onChange}>
                        <TextField
                            id="outlined-multiline-static"
                            label={parse(
                                `Mensagem para <br /><strong>${name}</strong>`
                            )}
                            multiline
                            rows="5"
                            fullWidth
                            name={mainKey}
                            autoComplete="off"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                    </form>
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
                                    closeModal(dispatch);
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
