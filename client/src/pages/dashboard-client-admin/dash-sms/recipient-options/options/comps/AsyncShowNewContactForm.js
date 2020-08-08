import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../redux/actions/snackbarActions';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import handleChange from '../../../../../../utils/form/use-state/handleChange';
import clearForm from '../../../../../../utils/form/use-state/clearForm';
import { handleFocus } from '../../../../../../utils/form/handleFocus';
import isKeyPressed from '../../../../../../utils/event/isKeyPressed';
import phoneMaskBr from '../../../../../../utils/validation/masks/phoneMaskBr';
import validatePhone from '../../../../../../utils/validation/validatePhone';

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: 'var(--mainWhite)',
        zIndex: 2000,
        font: 'normal 1em Poppins, sans-serif',
        color: 'var(--themeP)',
    },
    helperFromField: {
        color: 'grey',
        fontFamily: 'Poppins, sans-serif',
        fontSize: isSmall ? '.8em' : '.6em',
    },
    card: {
        margin: 'auto',
        width: '90%',
        maxWidth: isSmall ? "" : 320,
    }
});

const handleEvents = (e, options) => {
    const { setData, newValue, field } = options;
    let { name, value } = e.target;

    if(newValue) value = newValue;

    if(isKeyPressed(e, "Enter")) {
        setData(prevData => ({ ...prevData, [name]: value }));
        field && handleFocus(field);
    }
}

const getAdornmentIcon = (Icon, styles) => ({
    startAdornment: (
        <InputAdornment position="start">
            {Icon}
        </InputAdornment>
    ),
    style: styles.fieldForm
});

export default function AsyncShowNewContactForm({ handleAddContact }) {
    const [data, setData] = useState({
        name: '',
        phone: '',
        countryCode: 55,
    });
    const [error, setError] = useState(null);

    const dispatch = useStoreDispatch();

    const { name, phone, countryCode } = data;

    const styles = getStyles();

    const handleCTA = () => {
        if(!name) { showSnackbar(dispatch, "Insira o nome do destinatário", "error"); setError("name"); return; }
        if(!phone) { showSnackbar(dispatch, "Insira um telefone", "error"); setError("phone"); return; }
        if(!validatePhone(phone)) { showSnackbar(dispatch, "Formato telefone inválido. exemplo: 95977779999", "error"); setError("phone"); return; }
        clearForm(setData);
        handleAddContact({ name, phone, countryCode })
    }

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '90%'}}
            className="text-p text-normal"
            onBlur={() => {
                setError(null);
            }}
        >
            <div className="mt-3">
                Nome
                <TextField
                    required
                    onChange={handleChange(setData)}
                    error={error === "name" ? true : false}
                    variant="outlined"
                    margin="dense"
                    id="name"
                    name="name"
                    onKeyPress={e => handleEvents(e, { setData, newValue: name.cap(), field: "field2" })}
                    onBlur={e => handleEvents(e, { setData, newValue: name.cap() })}
                    autoComplete="off"
                    value={name}
                    type="text"
                    fullWidth
                    InputProps={getAdornmentIcon(<AccountCircle />, styles)}
                />
            </div>
            <div className="mt-3">
                Telefone
                <TextField
                    required
                    id="field2"
                    margin="dense"
                    onChange={handleChange(setData)}
                    error={error === "phone" ? true : false}
                    onBlur={e => handleEvents(e, { setData, newValue: phoneMaskBr(phone) })}
                    onKeyPress={e => handleEvents(e, { setData, newValue: phoneMaskBr(phone) })}
                    name="phone"
                    helperText={"Digite apenas números com DDD"}
                    FormHelperTextProps={{ style: styles.helperFromField }}
                    value={phone}
                    type="tel"
                    autoComplete="off"
                    fullWidth
                    variant="outlined"
                    InputProps={getAdornmentIcon(<PhoneIphoneIcon />, styles)}
                />
            </div>
        </form>
    );


    const showButtonActions = () => (
        <section className="container-center my-3">
            <ButtonFab
                size="medium"
                needTxtNoWrap={true}
                title="Adicionar"
                onClick={handleCTA}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
            />
        </section>
    );

    return(
        <Card
            className={`mt-0 mb-5 animated zoomIn fast shadow-elevation`}
            style={styles.card}
            elevation={false}
        >
            <p className="my-3 text-subtitle font-weight-bold text-purple text-center">
                Novo Contato
            </p>
            {showForm()}
            {showButtonActions()}
        </Card>
    );
}