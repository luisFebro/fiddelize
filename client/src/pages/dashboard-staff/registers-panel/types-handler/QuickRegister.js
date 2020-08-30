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
import { getUniqueId } from '../../../../hooks/api/useAPI';
import SuccessOp from './SuccessOp';
import useCount from '../../../../hooks/useCount';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { handleFocus } from '../../../../utils/form/handleFocus';
import PremiumButton from '../../../../components/buttons/premium/PremiumButton';

const Async = Load({ loader: () => import('../../../dashboard-client-admin/dash-sms/message/denial-modal/AsyncNoCredits'  /* webpackChunkName: "denial-page-lazy", webpackMode: "lazy", webpackIgnore: false */ )});

export const muStyle = {
    transform: 'scale(1.6)',
    marginLeft: '3px',
}

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

const getSmsObj = ({ businessId, dispatch, name, meanPayload }) => ({
    isAutomatic: false,
    userId: businessId,
    dispatch,
    contactList: [{ name: name, phone: meanPayload }]
})

export default function QuickRegister() {
    useCount("QuickRegister");
    const [data, setData] = useState({ meanPayload: "", meanType: "", name: "" }); // number or email
    const { meanPayload, meanType, name } = data;
    const [msg, setMsg] = useState("");
    const [fullOpen, setFullOpen] = useState(false);
    const [clearForm, setClearForm] = useState(false);
    const [successOpData, setSuccessOpData] = useState({
        successOp: false,
        title: "",
        ctaFunc: "",
        newOne: false,
    });
    const { successOp, title, ctaFunc, newOne } = successOpData;
    const [smsDisabled, setSmsDisabled] = useState(false);
    const AsyncNoCredits = <Async />

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    const { businessId } = useAppSystem();
    const { bizName, bizCodeName } = useClientAdmin();
    const { name: userName } = useProfile();

    const smsBalance = useCheckBalance();

    const handleSuccessOp = (title, ctaFunc, status, newOne) => {
        setSuccessOpData({
            successOp: status,
            title,
            ctaFunc,
            newOne,
        });
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const downloadLink = generateAppDownloadLink({ bizCodeName, name });

    useEffect(() => {
       if(name) {
          const text = `${name.toUpperCase()}, segue convite para o programa de fidelidade da ${bizName && bizName.toUpperCase()}. Acesse seu link exclusivo: ${downloadLink}`
          setMsg(text);
       }
    }, [name])

    const handleMeanData = (data) => {
        const { meanPayload, meanType, name } = data;
        setData({ meanPayload, meanType, name });
        setSuccessOpData({ ...successOpData, newOne: false })
    }

    const handleNewRegister = () => {
        handleFocus("field1");
        handleSuccessOp("", null, false, true);
        setSmsDisabled(false);
        const uniqueId = getUniqueId();
        setClearForm(uniqueId);
    }

    // Actions
    const handleNumberCTA = (type = "sms") => {
        const number = meanPayload;
        if(!name) return showSnackbar(dispatch, "Insira primeiro nome do cliente", "error");
        if(!number) return showSnackbar(dispatch, "Insira contato do cliente", "error");
        if(!validatePhone(number)) return showSnackbar(dispatch, "Formato telefone inválido. exemplo:<br />95 9 9999 8888", "error");

        if(type === "sms") {
            setSmsDisabled(true);
            if(smsBalance === 0) return setFullOpen(true);
            showSnackbar(dispatch, `Enviando convite para ${name.cap()}!`, 'warning', 3000);

            const smsObj = getSmsObj({ businessId, dispatch, name, meanPayload });
            sendSMS(smsObj)
            .then(res => {
                if(res.status === 200) handleSuccessOp("Convite Enviado!", handleNewRegister, true);
            })
        }
        if(type === "whatsapp") {
            const convertedWhatsapp = convertPhoneStrToInt(number);
            const whatsUrl = `https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${msg}`;
            runLink(whatsUrl);
            handleSuccessOp("Encaminhado", handleNewRegister, true);
        }
    }

    const handleEmailCTA = () => {
        const email = meanPayload;
        if(!name) return showSnackbar(dispatch, "Insira primeiro nome do cliente", "error");
        if(!validateEmail(email)) return showSnackbar(dispatch, "Formato de e-mail inválido.", "error");

        const subject = `${name.cap()}, convite da ${bizName && bizName.cap()}`
        const emailUrl = `mailto:${email}?subject=${subject}&body=${msg}`;

        runLink(emailUrl);
        handleSuccessOp("Encaminhado", handleNewRegister, true);
    }
    // End Actions


    const showNumberCTAs = () => (
        (!successOp && !newOne) &&
        <section className="animated fadeInUp delay-1s container-center my-4">
            <section className="d-flex justify-content-center">
                <div className="mr-4">
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap={true}
                        title="Enviar"
                        height="60px"
                        disabled={smsDisabled}
                        onClick={() => handleNumberCTA("sms")}
                        backgroundColor={"var(--themeSDark--default)"}
                        iconFontAwesome={<FontAwesomeIcon icon="sms" style={muStyle} />}
                        variant = 'extended'
                        position = 'relative'
                    />
                </div>
                <section className="position-relative">
                    <PremiumButton
                        top={-10}
                        right={0}
                    />
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap={true}
                        title="Enviar"
                        height="60px"
                        onClick={() => handleNumberCTA("whatsapp")}
                        backgroundColor={"var(--themeSDark--default)"}
                        iconMu={<WhatsAppIcon style={muStyle} />}
                        variant = 'extended'
                        position = 'relative'
                    />
                </section>
            </section>
        </section>
    );

    const showEmailCTA = () => (
        (!successOp && !newOne) &&
        <section className="animated fadeInUp delay-1s container-center my-4">
            <ButtonFab
                size="medium"
                needTxtNoWrap={true}
                title="Enviar Email"
                height="60px"
                onClick={handleEmailCTA}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
            />
        </section>
    );

    const showGeneratedMsg = () => (
        (!successOp && !newOne) &&
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
    );

    const showSuccessOp = () => (
        successOp &&
        <SuccessOp
            trigger={successOp}
            title={title}
            ctaFunc={ctaFunc}
        />
    );

    return (
        <section>
            <div className="my-5">
                <AsyncShowNewContactForm
                   isQuickRegister={true}
                   entryAnimation="animated fadeInUp delay-2s"
                   clearForm={clearForm}
                   handleMeanData={handleMeanData}
                />
            </div>
            {meanType && meanType === "number" && showNumberCTAs()}
            {meanType && meanType === "email" && showEmailCTA()}
            {showSuccessOp()}
            {showGeneratedMsg()}
            <ModalFullContent
                contentComp={AsyncNoCredits}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
