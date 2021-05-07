// End Redux
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import parse from "html-react-parser";
// End Material UI
import PropTypes from "prop-types";
import { deleteProduct } from "../../../redux/actions/productActions";
import { deleteUser, readUserList } from "../../../redux/actions/userActions";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { closeModal } from "../../../redux/actions/modalActions";

ModalConfYesNo.propTypes = {
    currItemFound: PropTypes.shape({
        action: PropTypes.objectOf(PropTypes.string),
        _idUser: PropTypes.string,
        mainSubject: PropTypes.string,
        name: PropTypes.string,
    }),
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

export default function ModalConfYesNo({ currItemFound }) {
    // const [newInfo, setNewInfo] = useState('');
    const { isModalConfYesNoOpen } = useStoreState((state) => ({
        isModalConfYesNoOpen: state.modalReducers.cases.isModalConfYesNoOpen,
    }));

    const dispatch = useStoreDispatch();

    const _idUser = currItemFound ? currItemFound._id : null;

    let name;
    if (currItemFound) {
        switch (currItemFound.mainSubject) {
            case "Usuário":
                name = currItemFound ? currItemFound.name : null;
                break;
            case "Produto":
            case "Agendamento":
                name = currItemFound ? currItemFound.title : null;
                break;
            default:
                console.log("No matching for mainSubject");
        }
    }

    // For any case
    const action = {
        noun: currItemFound ? currItemFound.action.noun : null,
        verb: currItemFound ? currItemFound.action.verb : null,
    };
    const mainSubject = currItemFound ? currItemFound.mainSubject : null;
    // End For any case

    const classes = useStyles();
    return (
        <div>
            <Dialog
                style={{ zIndex: 1500 }}
                open={isModalConfYesNoOpen}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    <span className="text-main-container">{`Confirmação de ${action.noun} de ${mainSubject}`}</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className="text-normal">
                            {parse(
                                `${action.verb} o ${mainSubject}: <strong>${
                                    name && name.cap()
                                }</strong> ?`
                            )}
                            <br />
                        </span>
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
                                NÃO
                            </Button>
                            <Button
                                onClick={() => {
                                    closeModal(dispatch);
                                    showSnackbar(
                                        dispatch,
                                        "Processando...",
                                        "warning",
                                        3000
                                    );
                                    if (currItemFound) {
                                        switch (currItemFound.mainSubject) {
                                            case "Usuário":
                                                setTimeout(
                                                    () =>
                                                        showSnackbar(
                                                            dispatch,
                                                            "Fazendo cópia de segurança e excluindo usuário...",
                                                            "warning",
                                                            4000
                                                        ),
                                                    3000
                                                );
                                                setTimeout(() => {
                                                    deleteUser(
                                                        dispatch,
                                                        _idUser
                                                    ).then((res) => {
                                                        if (res.status !== 200)
                                                            return showSnackbar(
                                                                dispatch,
                                                                res.data.msg,
                                                                "error"
                                                            );
                                                        showSnackbar(
                                                            dispatch,
                                                            `O ${mainSubject} ${name.cap()} foi excluído com sucesso!`,
                                                            "success"
                                                        );
                                                        readUserList(dispatch);
                                                    });
                                                }, 7000);
                                                break;
                                            case "Produto":
                                                setTimeout(() => {
                                                    deleteProduct(
                                                        dispatch,
                                                        _idUser
                                                    );
                                                }, 8000);
                                                break;
                                            case "Agendamento":
                                                setTimeout(() => {
                                                    deleteProduct(
                                                        dispatch,
                                                        _idUser
                                                    );
                                                }, 8000);
                                                break;
                                            default:
                                                console.log(
                                                    "no matching for main Subject"
                                                );
                                        }
                                    }
                                }}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                SIM
                                <i
                                    className="far fa-check-circle"
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
