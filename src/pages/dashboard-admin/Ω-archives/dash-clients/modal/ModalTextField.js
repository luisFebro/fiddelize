import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
import isMoneyBrValidAndAlert from "../../../../utils/numbers/isMoneyBrValidAndAlert";
import {
    readHighestScores,
    updateUser,
    readUserList,
} from "../../../../redux/actions/userActions";

// CUSTOMIZED DATA
import { modalTextFieldDashboardType } from "../../../../types";
import {
    convertCommaToDot,
    convertDotToComma,
} from "../../../../utils/numbers/convertDotComma";

import { showSnackbar } from "../../../../redux/actions/snackbarActions";
// END CUSTOMIZED DATA

ModalTextField.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modal: modalTextFieldDashboardType,
};

export default function ModalTextField({ open, onClose, modal }) {
    const [data, setData] = useState({
        newValue: "0,0",
    });
    const [gotError, setGotError] = useState(false);

    const { newValue } = data;

    const dispatch = useStoreDispatch();

    const {
        title,
        subTitle,
        txtBtn,
        iconBtn,
        labelTxtField,
        userId,
        userCurrentScore,
    } = modal;

    const styles = {
        dialog: {
            width: "90%",
            margin: "auto",
            zIndex: 1500,
        },
        form: {
            margin: "15px auto 0",
            width: "80%",
        },
        actionButtons: {
            display: "flex",
            justifyContent: "center",
            marginTop: "28px",
        },
    };

    const handleSubmit = () => {
        if (!isMoneyBrValidAndAlert(newValue, showSnackbar, dispatch)) {
            setGotError(true);
            return;
        }
        if (newValue < 0) {
            showSnackbar(
                dispatch,
                "O valor da retirada é maior que o acumulado. Digite valor menor",
                "error",
                7000
            );
            setGotError(true);
            return;
        }

        const bodyToSend = {
            "loyaltyScores.currentScore": parseFloat(newValue),
        };

        updateUser(dispatch, bodyToSend, userId, false).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            readUserList(dispatch);
            showSnackbar(
                dispatch,
                "Os pontos de fidelidade do cliente foram descontados com sucesso",
                "success",
                8000
            );
            onClose();
            setTimeout(() => readHighestScores(dispatch), 3000);
        });
    };

    const handleChange = (setObj, obj) => (e) => {
        const { name, value } = e.target;
        const remainingValue = parseFloat(
            userCurrentScore - convertCommaToDot(value)
        );
        setObj({
            ...obj,
            [name]: convertCommaToDot(remainingValue).toString(),
        });
    };

    const showTitle = () => (
        <div className="text-center">
            <DialogTitle id="form-dialog-title">{parse(title)}</DialogTitle>
            <DialogContentText>
                <span>{subTitle}</span>
                <br />
                <br />
                <span>Acumulado Atual: {userCurrentScore}</span>
                <br />
                <span className="text-blue">
                    {!Number.isNaN(parseFloat(newValue)) && newValue !== "0,0"
                        ? parse(
                              `<strong>
                            Saldo restante agora: ${convertDotToComma(newValue)}
                         </strong>`
                          )
                        : null}
                </span>
            </DialogContentText>
        </div>
    );

    const showForm = () => (
        <form style={styles.form} onBlur={() => setGotError(false)}>
            <TextField
                label={parse(labelTxtField)}
                type="text"
                fullWidth
                name="newValue"
                error={!!gotError}
                variant="outlined"
                autoComplete="off"
                onChange={handleChange(setData, data)}
            />
        </form>
    );

    const showActionButtons = () => (
        <section style={styles.actionButtons}>
            <ButtonMulti onClick={onClose} variant="link">
                Voltar
            </ButtonMulti>
            <ButtonMulti onClick={handleSubmit} iconFontAwesome={iconBtn}>
                {txtBtn}
            </ButtonMulti>
        </section>
    );

    return (
        <div>
            <Dialog
                style={styles.dialog}
                open={open}
                maxWidth="md"
                aria-labelledby="form-dialog-title"
            >
                {showTitle()}
                {showForm()}
                {showActionButtons()}
            </Dialog>
        </div>
    );
}
