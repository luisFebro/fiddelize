import { useState } from "react";
// Redux
import { useStoreState, useStoreDispatch } from "easy-peasy";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { CardMedia } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
// End Material UI
import PropTypes from "prop-types";
import { updateProduct } from "../../../redux/actions/productActions";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { closeModal } from "../../../redux/actions/modalActions";

ModalChangeTitle.propTypes = {
    currItemFound: PropTypes.object,
};

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

export default function ModalChangeTitle({ currItemFound }) {
    const [newInfo, setNewInfo] = useState("");
    const { isModalConfTitleOpen } = useStoreState((state) => ({
        isModalConfTitleOpen: state.modalReducers.cases.isModalConfTitleOpen,
    }));

    let mainItem = currItemFound ? currItemFound.title : null;
    const mainSubject = currItemFound ? currItemFound.mainSubject : null;
    let mainField;

    if (currItemFound) {
        if (currItemFound.nameForm === "price") {
            mainField = "price";
            mainItem = parse(
                `${currItemFound.title}<br />(R$ ${currItemFound.price})`
            );
        } else {
            mainField = "title";
        }
    }

    const dispatch = useStoreDispatch();
    const setObjectToSend = () => {
        const data = newInfo;
        console.log("obj", data);
        const id = currItemFound ? currItemFound._id : null;
        updateProduct(dispatch, data, id);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        // no need to write ...newInfo because we want one single key. Not adda new key
        setNewInfo({ [name]: value });
    };

    const classes = useStyles();
    return (
        <div>
            <Dialog
                style={{ zIndex: 1500 }}
                open={isModalConfTitleOpen}
                aria-labelledby="form-dialog-title"
            >
                <CardMedia
                    className={classes.media}
                    image="img/babadoo-logo_no-slogon.png"
                    title="loja babadoo"
                />
                <DialogTitle id="form-dialog-title">
                    <span className="text-main-container">{`Alterar ${mainSubject} do Produto`}</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className="text-normal">
                            {`Insira o novo ${mainSubject} do atual:`}
                            <br />
                            <strong>{mainItem}</strong>. <br />
                            <br />
                            para...
                        </span>
                    </DialogContentText>
                    <form onChange={onChange} style={{ marginTop: "5px" }}>
                        <TextField
                            required
                            margin="dense"
                            id="changeInfo"
                            name={mainField}
                            type={currItemFound ? currItemFound.typeForm : null}
                            label={`Novo ${mainSubject} aqui:`}
                            autoComplete="off"
                            fullWidth
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
                                    setObjectToSend();
                                    showSnackbar(
                                        dispatch,
                                        `${mainSubject} do Item foi Alterado para " ${newInfo[mainField]} "!`
                                    );
                                    closeModal(dispatch);
                                }}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                mudar
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
