import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'html-react-parser';
import { CLIENT_URL } from '../../../../config/clientUrl';
import PropTypes from 'prop-types';
import handleChange from '../../../../utils/form/use-state/handleChange';

// OPTIONALS
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import detectErrorField from '../../../../utils/validation/detectErrorField';
//datePicker
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import AlarmIcon from '@material-ui/icons/Alarm';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
// END OPTIONALS

// CUSTOMIZED DATA
import { modalTextFieldDashboardType } from '../../../../types';
import { updateBooking } from '../../../../redux/actions/staffBookingActions';
import { readServicesList } from '../../../../redux/actions/adminActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
// END CUSTOMIZED DATA

ModalForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modal: modalTextFieldDashboardType,
    setRun: PropTypes.func,
    run: PropTypes.bool,
};

export default function ModalForm({
    open, onClose, modal, setRun, run }) {
    const [data, setData] = useState({
        status: "3pendente",
        staffName: '',
        _id: '',
        clientName: '',
        service: "selecione tipo de serviço",
        notes: '',
        bookingDate: '',
        formattedDate: '',
    });

    const { services } = useStoreState(state => ({
        services: state.adminReducer.cases.services,
    }));
    const dispatch = useStoreDispatch();

    const {
        _id,
        staffName,
        clientName,
        service,
        notes,
        bookingDate,
    } = data;

    const {
        title,
        txtBtn,
        iconBtn,
        modalData } = modal;

    const [gotError, setGotError] = useState(false);
    const [fieldError, setFieldError] = useState(null);
    const errorBookingDate = fieldError && fieldError.bookingDate;
    const errorClientName = fieldError && fieldError.clientName;

    const [selectedDate, handleDateChange] = useState(new Date());


    useEffect(() => {
        readServicesList(dispatch)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            const { staffBooking } = modalData;
            setData({
                staffName: staffBooking.staffName,
                _id: staffBooking._id,
                clientName: staffBooking.clientName,
                service: staffBooking.service,
                notes: staffBooking.notes,
                bookingDate: staffBooking.bookingDate,
            })
        })
    }, [])

    useEffect(() => {
        setData({ ...data, bookingDate: selectedDate })
    }, [selectedDate])

    const styles = {
        dialog: {
            margin: 'auto',
            width: '90%',
            maxWidth: '450px'
        },
        form: {
            margin: 'auto',
            width: '80%'
        },
        fieldForm: {
            margin: '9px 0',
            zIndex: 2000
        },
        actionButtons: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '28px'
        }
    }

    const clearForm = () => {
        setGotError(false);
        setFieldError(null);
    }

    const handleSubmit = () => {
        if(service === "selecione tipo de serviço") {
            showSnackbar(dispatch, "Selecione um serviço.", 'error')
            setGotError(true);
            return;
        }

        const convertDate = moment(bookingDate).utc().format();
        const objToSend = {
            ...data,
            bookingDate: convertDate,
            formattedDate: moment(bookingDate).format("LLL")
        }

        showSnackbar(dispatch, "Processando...", 'warning', 5000)
        updateBooking(dispatch, objToSend, _id)
        .then(res => {
            if(res.status !== 200) {
                showSnackbar(dispatch, res.data.msg, 'error')
                const thisModalFields = Object.keys(data);
                const foundObjError = detectErrorField(res.data.msg, thisModalFields);
                setFieldError(foundObjError);
                return;
            }
            clearForm();
            onClose();
            setRun(!run);
            showSnackbar(dispatch, `Agendamento Atualizado!`, 'success', 8000)
        })
    };

    const showTitle = () => (
        <div className="text-center container-center">
            <DialogTitle id="form-dialog-title">
                {parse(title)}
            </DialogTitle>
            <div>
                <img
                    width={135}
                    height={135}
                    src={`${CLIENT_URL}/img/illustrations/client-booking.svg`}
                    alt="agendamento cliente"
                />
            </div>
        </div>
    );

    const showForm = () => (
        <form style={styles.form} onBlur={() => {setGotError(false); setFieldError(null)}}>
            <TextField
                label="NOME COLABORADOR:"
                value={staffName}
                variant="standard"
                fullWidth
                margin="dense"
                disabled
            />
            <TextField
                required
                label="NOME CLIENTE:"
                autoComplete="off"
                name="clientName"
                value={clientName}
                onChange={handleChange(setData, data)}
                error={errorClientName ? true : false}
                variant="standard"
                type="text"
                fullWidth
                margin="dense"
            />
            <Select
              style={styles.fieldForm}
              labelId="service"
              onChange={handleChange(setData, data)}
              name="service"
              value={service}
              error={gotError ? true : false}
            >
                <MenuItem value={service}>
                  selecione tipo de serviço:
                </MenuItem>
                {services && services.map(service => (
                    <MenuItem key={service._id} value={service.name}>
                        {service.name.cap()}
                    </MenuItem>
                ))}
            </Select>
            <br />
            <MuiPickersUtilsProvider utils={MomentUtils} locale={"pt-br"}>
                <DateTimePicker
                    required
                    disablePast
                    variant="outlined"
                    margin="dense"
                    error={errorBookingDate ? true : false}
                    ampm={false}
                    placeholder="Data Agendamento"
                    label={`Qual DIA e HORÁRIO?`}
                    name="serviceDate"
                    value={bookingDate}
                    onChange={handleDateChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlarmIcon />
                        </InputAdornment>
                      ),
                    }}
                />
            </MuiPickersUtilsProvider>
            <TextField
                label="OBSERVAÇÕES:"
                multiline
                rows={4}
                name="notes"
                value={notes}
                onChange={handleChange(setData, data)}
                variant="outlined"
                placeholder="Escreva detalhes adicionais do agendamento"
                fullWidth
                margin="dense"
            />
        </form>
    );

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

    return (
        <div>
            <Dialog
                style={styles.dialog}
                open={open}
                aria-labelledby="form-dialog-title">
                {showTitle()}
                {showForm()}
                {showActionButtons()}
            </Dialog>
        </div>
    );
}
