import React, { useState } from 'react';
// Redux
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../redux/actions/snackbarActions';
import handleChange from '../../../../../../utils/form/use-state/handleChange';
import parse from 'html-react-parser';
// Material UI
import ButtonMulti from '../../../../../../components/buttons/material-ui/ButtonMulti';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { modalDefaultType } from '../../../../../../types';

//CUSTOM DATA
import { updateFinance } from '../../../../../../redux/actions/financeActions';

ModalSelect_cashEdit.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modal: PropTypes.shape(modalDefaultType),
};
// End Material UI

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    media: {
        height: 50,
        width: '50%',
        margin: 'auto'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}));

export default function ModalSelect_cashEdit({ open, onClose, modal, setRun, run }) {
    const [error, setError] = useState(false);
    const [data, setData] = useState({
        selected: "selecione novo status:",
        paymentType: 'dinheiro',
        installmentsIfCredit: 2,
    });
    const { selected, paymentType, installmentsIfCredit } = data;

    const { title, txtBtn, iconBtn, modalData } = modal;

    const clearForm = () => {
        setData({
            selected: "selecione novo status:",
        })
    }

    let itemsSelection;
    switch(modalData.statusCheck) {
        case "pago":
            itemsSelection = ["pendente"];
            break;
        case "pendente":
            itemsSelection = ["pago"];
            break;
        default:
            itemsSelection = ["pago", "pendente"];
    }

    const dispatch = useStoreDispatch();

    const styles = {
        actionButtons: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '28px'
        },
        fieldForm: {
            backgroundColor: 'var(--mainWhite)',
            textAlign:'center',
            zIndex: 2000
        }
    }


    const handleSubmit = () => {
        if(selected.includes("selecione")) {
            showSnackbar(dispatch, "Selecione um novo status", "error");
            setError(true);
            return;
        }

        const objToSend = {
            ...data,
            statusCheck: selected,
        }
        onClose();
        showSnackbar(dispatch, "Alterando...", "warning", 3000);
        updateFinance(dispatch,  modalData._id, objToSend)
        .then(res => {
            clearForm();
            showSnackbar(dispatch, `O status mudou para ${selected.toUpperCase()}. Pagamento no ${paymentType.toUpperCase()}.`, 'success', 8000);
            setRun(!run)
        })
    }

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

    const showMainSelect = () => (
        <form
            style={{ margin: 'auto', width: '90%' }}
            onBlur={() => setError(false)}
        >
            <Select
              style={{ margin: '9px 0' }}
              labelId="selected"
              onChange={handleChange(setData, data)}
              name="selected"
              error={error ? true : false}
              value={selected}
              fullWidth
            >
              <MenuItem value={selected}>
                selecione novo status:
              </MenuItem>
              {itemsSelection.map((item, ind) => (
                  <MenuItem key={ind} value={item}>{item}</MenuItem>
               ))}
            </Select>
        </form>
    );

    const showPaySelect = () => (
        <form
            style={{ margin: 'auto', width: '90%' }}
            onBlur={() => setError(false)}
        >
            <div className="mt-3">
                <span className="text-white text-normal text-em-1 font-weight-bold">
                    "FORMA DE PAGAMENTO:
                    <Select
                      style={styles.fieldForm}
                      fullWidth
                      variant="outlined"
                      name="paymentType"
                      value={paymentType}
                      onChange={handleChange(setData, data)}
                    >
                        <MenuItem value={paymentType}>
                          dinheiro
                        </MenuItem>
                        <MenuItem value={'crédito'}>crédito</MenuItem>
                        <MenuItem value={'débito'}>débito</MenuItem>
                    </Select>
                </span>
            </div>
            {paymentType === "crédito"
            ? (
                <div className="animated zoomIn mt-3">
                    <span className="text-white text-normal text-em-1 font-weight-bold">
                        QTDE. PARCELAS:
                        <br />
                        <TextField
                          InputProps={{
                              style: {fontSize: '2em', width: '80px', backgroundColor: 'var(--mainWhite)',},
                              inputProps: { min: 2, max: 12 }
                          }}
                          variant="outlined"
                          type="number"
                          name="installmentsIfCredit"
                          value={installmentsIfCredit}
                          onChange={handleChange(setData, data)}
                        />
                    </span>
                </div>
            ) : null}
        </form>
    );

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
        >
            <div className="container-center flex-column pb-2">
                <DialogTitle id="form-dialog-title">
                    <span
                        className="text-main-container text-center font-weight-bold"
                    >
                        {parse(title)}
                    </span>
                </DialogTitle>
                <p className="text-left">
                    Pagamento Atual: <strong>{modalData.paymentType.cap()}</strong>
                    <br />
                    Status atual: <strong>{modalData.statusCheck.cap()}</strong>
                </p>
            </div>
            {showMainSelect()}
            {showPaySelect()}
            {showActionButtons()}
        </Dialog>
    );
}