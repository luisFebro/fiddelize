import React, { useState, useEffect, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import handleChange from '../../../../utils/form/use-state/handleChange';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import useAPI, { sendSMS, getUniqueId } from '../../../../hooks/api/useAPI';
import { useAppSystem } from '../../../../hooks/useRoleData';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import Title from '../../../../components/Title';
import SchedulingBtn from './scheduling-btn/SchedulingBtn';
import AccessDenialModal from './denial-modal/AccessDenialModal';
import scrollIntoView from '../../../../utils/document/scrollIntoView';
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

const getModalData = ({ whichTab, userId, contactList, message }) => ({
    userId,
    contactList,
    whichTab: whichTab ? whichTab : "Lista de Clientes",
    message,
});

export default function MessageField({
    whichTab,
    contactList,
    showMessage,
    suggestionMsg,
    currBalance = 0,
    totalRecipients,
    handleShowMessage,
}) {
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [whichDenial, setWhichDenial] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const styles = getStyles();

    useEffect(() => {
        if(suggestionMsg) setMessage(suggestionMsg);
    }, [suggestionMsg])

    const { businessId: userId } = useAppSystem();

    const uniqueId = getUniqueId();
    const runName = `UpdateSMSAll ${uniqueId}`

    const { data: doneMsg, loading, setRun, dispatch } = useAPI({
        method: 'post',
        url: sendSMS(),
        body: { userId, contactList, msg: message },
        needAuth: true,
        snackbar: { txtPending: "Enviando agora...", txtSuccess: "Mensagem Enviada!" },
        trigger,
    })

    useEffect(() => {
        if(doneMsg && !loading) {
            setDisabled(false);

            const handleCallback = () => {
                setMessage("");
                handleShowMessage(false);
                setRun(dispatch, runName);
            }

            const config = {
                mode: "center",
                duration: 3000,
                onDone: () => handleCallback(),
            }

            scrollIntoView("#smsHistoryTotals", config);
        }
    }, [doneMsg, loading])

    const handleSendNow = () => {
        if(!message.length) return showSnackbar(dispatch, "Insira alguma mensagem ou selecione uma sugestão abaixo", "error", 6000);
        if(currBalance === 0) return setWhichDenial("NoCredits");
        if(currBalance < totalRecipients) return setWhichDenial("ChargeCredits");

        setDisabled(true);
        setTrigger(uniqueId);
    }

    const modal = getModalData({ whichTab, userId, contactList, message });

    const showCTABtn = () => (
        <section className="d-flex align-items-center justify-content-around mt-5 mb-3">
            <SchedulingBtn modal={modal} />
            <ButtonFab
                size="large"
                disabled={disabled}
                title="Enviar agora"
                position="relative"
                onClick={handleSendNow}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
        </section>
    );

    const plural = contactList.length > 1 ? "s" : "";

    return (
        <Fragment>
            {Boolean(showMessage && contactList.length) && (
                <section className="animated fadeInUp slow">
                    <hr className="lazer-purple" />
                    <Title
                        title="&#187; Escreva sua Mensagem"
                        color="var(--themeP)"
                        margin="my-5"
                        padding=" "
                    />
                    <section className="container-center-max-width-500">
                        <form className="shadow-elevation" style={styles.form}>
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
                                    {contactList.length} contato{plural}.
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
                    </section>
                </section>
            )}
            <AccessDenialModal
                whichDenial={whichDenial}
                currBalance={currBalance}
                totalRecipients={totalRecipients}
            />
        </Fragment>
    );
}