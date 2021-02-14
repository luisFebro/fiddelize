import { useState } from "react";
// Redux
import { useStoreDispatch } from "easy-peasy";
import parse from "html-react-parser";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
// import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import handleChange from "../../../utils/form/use-state/handleChange";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { updateUser } from "../../../redux/actions/userActions";
import { modalDefaultType } from "../../../types";
import { setRun } from "../../../redux/actions/globalActions";

ModalSelect_userFunction.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modal: PropTypes.shape(modalDefaultType),
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

export default function ModalSelect_userFunction({ open, onClose, modal }) {
    const [error, setError] = useState(false);
    const [data, setData] = useState({
        selected: "selecione nova função:",
    });
    const { selected } = data;

    const { title, txtBtn, iconBtn, modalData } = modal;

    let itemsSelection;
    switch (modalData.role) {
        case "cliente":
            itemsSelection = ["admin", "colaborador"];
            break;
        case "admin":
            itemsSelection = ["cliente", "colaborador"];
            break;
        case "colaborador":
            itemsSelection = ["cliente", "admin"];
            break;
        default:
            itemsSelection = ["cliente", "admin", "colaborador"];
    }

    const clearForm = () => {
        setData({
            selected: "selecione nova função:",
        });
    };

    const dispatch = useStoreDispatch();

    const styles = {
        actionButtons: {
            display: "flex",
            justifyContent: "center",
            marginTop: "28px",
        },
    };

    const handleSubmit = () => {
        if (selected.includes("selecione")) {
            showSnackbar(dispatch, "Selecione um novo status", "error");
            setError(true);
            return;
        }

        const objToSend = {
            role: selected,
        };
        onClose();
        showSnackbar(dispatch, "Alterando...", "warning", 3000);
        updateUser(dispatch, objToSend, modalData._id).then((res) => {
            clearForm();
            showSnackbar(
                dispatch,
                `O Tipo de Usuário foi alterado para ${selected.toUpperCase()} e movido.`,
                "success"
            );
            setRun(dispatch, "registered");
        });
    };

    const classes = useStyles();

    const showActionButtons = () => (
        <section style={styles.actionButtons}>
            <ButtonMulti
                title="Voltar"
                onClick={() => {
                    onClose();
                    clearForm();
                }}
                variant="link"
            />
            <ButtonMulti
                title={txtBtn}
                onClick={handleSubmit}
                iconFontAwesome={iconBtn}
            />
        </section>
    );

    const showSelect = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            onBlur={() => setError(false)}
        >
            <Select
                style={{ margin: "9px 0" }}
                labelId="selected"
                onChange={handleChange(setData, data)}
                name="selected"
                error={!!error}
                value={selected}
                fullWidth
            >
                <MenuItem value={selected}>selecione nova função:</MenuItem>
                {itemsSelection.map((item, ind) => (
                    <MenuItem key={ind} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </form>
    );
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <div className="container-center flex-column px-5 pb-2">
                <DialogTitle id="form-dialog-title">{parse(title)}</DialogTitle>
            </div>
            {showSelect()}
            {showActionButtons()}
        </Dialog>
    );
}
