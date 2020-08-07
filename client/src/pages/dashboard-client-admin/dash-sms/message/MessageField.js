import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import handleChange from '../../../../utils/form/use-state/handleChange';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import useAPI, { sendSMS } from '../../../../hooks/api/useAPI';
import { useAppSystem } from '../../../../hooks/useRoleData';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import { useStoreDispatch } from 'easy-peasy';
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    form: {
        background: 'var(--themePLight)',
        borderRadius: '10px',
        padding: '25px 5px',
    },
    fieldFormValue: {
        backgroundColor: 'var(--mainWhite)',
        color: 'var(--themeP)',
        fontSize: '20px',
        fontFamily: 'var(--mainFont)',
        zIndex: 2000
    },
});


export default function MessageField({
    whichTab,
    contactList,
    showMessage,
    suggestionMsg,
}) {
    const [message, setMessage] = useState("");
    const [trigger, setTrigger] = useState(false);
    const styles = getStyles();

    useEffect(() => {
        if(suggestionMsg) setMessage(suggestionMsg);
    }, [suggestionMsg])

    const { businessId: userId } = useAppSystem();
    useAPI({
        method: 'post',
        url: sendSMS(userId),
        body: { contactList, msg: message },
        needAuth: true,
        trigger })

    const dispatch = useStoreDispatch();
    const handleTrigger = () => {
        if(!message.length) return showSnackbar(dispatch, "Insira alguma mensagem ou selecione uma sugestão abaixo", "error", 6000);
        setTrigger(true);
    }

    const showCTABtn = () => (
        <section className="container-center mt-5 mb-3">
            <ButtonFab
                size="large"
                title="Enviar agora"
                onClick={handleTrigger}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
        </section>
    );

    return (
        showMessage &&
        <form className="animated fadeInUp slow shadow-elevation container-center-max-width-500" style={styles.form}>
            <p className="text-center text-shadow text-white text-subtitle font-weight-bold">
                MENSAGEM SMS
                <span
                    className="mt-3 ml-2 d-block text-left text-shadow text-white text-normal font-weight-bold"
                >
                    ✔ ENVIO PARA:
                    <br/>
                    {whichTab}
                </span>
                <span
                    className="mt-3 ml-2 d-block text-left text-shadow text-white text-normal font-weight-bold"
                >
                    ✔ TOTAL:
                    <br/>
                    {contactList.length} contatos.
                </span>
            </p>
            <TextField
                multiline
                rows={5}
                id="messageField"
                name="message"
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                inputProps={{
                    maxLength: 160
                }}
                value={message}
                onChange={handleChange(setMessage)}
                onBlur={null}
                variant="outlined"
                fullWidth
            />
            <div className="position-relative text-white text-shadow text-nowrap pl-1" style={{top: '10px'}}>
                <span
                    className="font-weight-bold"
                >
                    {message.length}/160 characteres
                </span>
            </div>
            {showCTABtn()}
        </form>
    );
}