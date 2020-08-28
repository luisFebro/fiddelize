import React, { useState, useEffect } from 'react';
import AsyncShowNewContactForm from '../../../dashboard-client-admin/dash-sms/recipient-options/options/comps/AsyncShowNewContactForm';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import generateAppDownloadLink from '../../../../utils/biz/generateAppDownloadLink';
import { useProfile, useClientAdmin, useAppSystem } from '../../../../hooks/useRoleData';
import validatePhone from '../../../../utils/validation/validatePhone';
import validateEmail from '../../../../utils/validation/validateEmail';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import { useStoreDispatch } from 'easy-peasy';
import convertPhoneStrToInt from '../../../../utils/numbers/convertPhoneStrToInt';
import useCheckBalance from '../../../../hooks/sms/useCheckBalance';
import ModalFullContent from '../../../../components/modals/ModalFullContent';
import { Load } from '../../../../components/code-splitting/LoadableComp'
import sendSMS from '../../../../hooks/sms/sendSMS';

const AsyncNoCredits = Load({ loader: () => import('../../../dashboard-client-admin/dash-sms/message/denial-modal/AsyncNoCredits'  /* webpackChunkName: "denial-page-lazy", webpackMode: "lazy", webpackIgnore: false */ )});

const getStyles = () => ({
    msgField: {
        background: 'var(--themeP)',
        borderRadius: '30px',
    },
});

const runLink = (url) => {
    let a = document.createElement('a');
    a.target = '_blank';
    a.rel="noopener noreferrer";
    a.href= url;
    a.click();
}

export default function QuickRegister() {
    const [data, setData] = useState({ meanPayload: "", meanType: "", name: "" }); // number or email
    const { meanPayload, meanType, name } = data;
    const [msg, setMsg] = useState("");
    const [fullOpen, setFullOpen] = useState(false);
    const handleFullClose = () => {
        setFullOpen(false);
    }

    const { businessId } = useAppSystem();
    const { bizName, bizCodeName } = useClientAdmin();
    const { name: userName } = useProfile();

    const smsBalance = useCheckBalance();

    const downloadLink = generateAppDownloadLink({ bizCodeName, name });

    useEffect(() => {
       if(name) {
          const text = `${name.toUpperCase()}, segue convite para o programa de fidelidade da ${bizName && bizName.toUpperCase()}. Acesse seu link exclusivo: ${downloadLink}`
          setMsg(text);
       }
    }, [name])

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    const handleMeanData = (data) => {
        const { meanPayload, meanType, name } = data;
        setData({ meanPayload, meanType, name });
    }

    // Actions
    const handleNumberCTA = (type = "sms") => {
        const number = meanPayload;
        if(!name) return showSnackbar(dispatch, "Insira primeiro nome do cliente", "error");
        if(!number) return showSnackbar(dispatch, "Insira contato do cliente", "error");
        if(!validatePhone(number)) return showSnackbar(dispatch, "Formato telefone inválido. exemplo:<br />95 9 9999 8888", "error");

        if(type === "sms") {
            if(smsBalance === 0) return setFullOpen(true);
            showSnackbar(dispatch, `Enviando convite para ${name.cap()}!`, 'success', 6000);
            sendSMS({
                isAutomatic: false,
                userId: businessId,
                dispatch,
                contactList: [{ name: name, phone: number }]
            })
            .then(res => {
                // Create a card to display result istead
                showSnackbar(dispatch, `Convite Enviado!`, 'success', 6000);
            })
        }
        if(type === "whatsapp") {
            const convertedWhatsapp = convertPhoneStrToInt(number);
            const whatsUrl = `https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${msg}`;
            runLink(whatsUrl);
        }
    }

    const handleEmailCTA = () => {
        const email = meanPayload;
        if(!name) return showSnackbar(dispatch, "Insira primeiro nome do cliente", "error");
        if(!validateEmail(email)) return showSnackbar(dispatch, "Formato de e-mail inválido.", "error");

        const subject = `${name.cap()}, convite da ${bizName && bizName.cap()}`
        const emailUrl = `mailto:${email}?subject=${subject}&body=${msg}`;

        runLink(emailUrl);
    }
    // End Actions


    const showNumberCTAs = () => (
        <section className="animated fadeInUp delay-1s container-center my-4">
            <section className="d-flex justify-content-center">
                <div className="mr-4">
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap={true}
                        title="Enviar SMS"
                        onClick={() => handleNumberCTA("sms")}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant = 'extended'
                        position = 'relative'
                    />
                </div>
                <ButtonFab
                    size="medium"
                    needTxtNoWrap={true}
                    title="Enviar W"
                    onClick={() => handleNumberCTA("whatsapp")}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                    position = 'relative'
                />
            </section>
        </section>
    );

    const showEmailCTA = () => (
        <section className="animated fadeInUp delay-1s container-center my-4">
            <ButtonFab
                size="medium"
                needTxtNoWrap={true}
                title="Enviar Email"
                onClick={handleEmailCTA}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
            />
        </section>
    );


    return (
        <section>
            <div className="my-5">
                <AsyncShowNewContactForm
                   isQuickRegister={true}
                   handleMeanData={handleMeanData}
                />
            </div>
            {meanType && meanType === "number" && showNumberCTAs()}
            {meanType && meanType === "email" && showEmailCTA()}
            <section>
                <p className="mt-5 text-purple text-subtitle text-center font-weight-bold">
                    {name ? "Convite gerado:" : ""}
                </p>
                <main
                    className="mx-3"
                    style={styles.msgField}
                >
                    {name ? (
                        <p className="m-0 p-3 text-normal text-white text-break text-left mx-3" >
                            {msg}
                       </p>
                    ) : (
                        <p className="m-0 p-3 text-normal text-white text-break text-left mx-3">
                          {userName.cap()}, no aguardo do nome do cliente e um meio de envio...
                        </p>
                    )}
                </main>
            </section>
            <ModalFullContent
                contentComp={<AsyncNoCredits />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
