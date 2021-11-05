import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import EmailIcon from "@material-ui/icons/Email";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import useData, { useBizData } from "init";
import validatePhone from "utils/validation/validatePhone";
import validateEmail from "utils/validation/validateEmail";
import showToast from "components/toasts";
import convertPhoneStrToInt from "utils/numbers/convertPhoneStrToInt";
import useCheckBalance from "hooks/sms/useCheckBalance";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import sendSMS from "hooks/sms/sendSMS";
import { getUniqueId } from "api/useAPI";
import { handleFocus } from "utils/form/handleFocus";
import usePro from "init/pro";
import getAPI, { encryptPointsLink } from "api";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import runLinkTagOnClick from "utils/tags/runLinkTagOnClick";
import useInvitationMsg from "./hooks/useInvitationMsg";
import QrInvitationBtn from "./qr-code-invitation-btn/QrInvitationBtn";
import SuccessOp from "./SuccessOp";
import AsyncShowNewContactForm from "../../../../dashboard-client-admin/dash-sms/recipient-options/options/comps/AsyncShowNewContactForm";

const Async = Load({
    loader: () =>
        import(
            "../../../../dashboard-client-admin/dash-sms/message/denial-modal/AsyncNoCredits" /* webpackChunkName: "denial-page-lazy", webpackMode: "lazy", webpackIgnore: false */
        ),
});

export const muStyle = {
    transform: "scale(1.6)",
    marginLeft: "3px",
};

const getStyles = () => ({
    msgField: {
        background: "var(--themeP)",
        borderRadius: "30px",
    },
});

const getSmsObj = ({ bizId, name, meanPayload }) => ({
    isAutomatic: false,
    userId: bizId,
    contactList: [{ name, phone: meanPayload }],
});

export default function QuickRegister({ formPayload, isNewMember }) {
    // useCount("QuickRegister");
    const [data, setData] = useState({
        meanPayload: "",
        meanType: "", // number, email, copy, qrCode
        name: "",
        job: "", // for team members only
        linkScore: "",
    });

    const { linkScore, meanPayload, meanType, name, job } = data; // meanType = number, email
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
    const AsyncNoCredits = <Async />;

    const { isPro } = usePro();

    const styles = getStyles();

    const [linkId] = useData(["linkId"]);

    const { bizId, bizName, bizLinkName, registerBonusCoins } = useBizData();
    const gotBonusCoins = registerBonusCoins > 0;

    const { userId, name: userName } = useData();

    const smsBalance = useCheckBalance();

    const whichAudience = () => {
        if (isNewMember) return "membro";
        return "cliente";
    };

    const handleScoreToLink = (dbScore, cliFirstName) => {
        if (linkId === "..." || !bizLinkName) return;

        (async () => {
            const scoreToken = await getAPI({
                method: "post",
                url: encryptPointsLink(),
                needAuth: true,
                body: {
                    pts: dbScore,
                    cliFirstName,
                    bizLinkName,
                    bizId,
                    userId, // for auth
                    linkId,
                },
            });
            if (!scoreToken) return null;

            return setData((prev) => ({
                ...prev,
                linkScore: scoreToken,
            }));
        })();
    };

    const handleSuccessOp = (thisTitle, thisCtaFunc, status, thisNewOne) => {
        setSuccessOpData({
            successOp: status,
            title: thisTitle,
            ctaFunc: thisCtaFunc,
            newOne: thisNewOne,
        });
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const appType = isNewMember ? "member" : undefined;
    const payload = {
        jobRole: job,
        appType,
    };

    const { msg, downloadLink } = useInvitationMsg({
        name,
        linkScore,
        isNewMember,
        bizName,
        payload,
        bizLinkName,
        linkId,
        trigger: linkId !== "...",
    });

    // Actions
    const handleMeanData = ({ meanPayload, meanType, name, job }) => {
        setData({ meanPayload, meanType, name, job });
        setSuccessOpData({ ...successOpData, newOne: false });
    };

    const handleNewRegister = () => {
        handleFocus("field1");
        handleSuccessOp("", null, false, true);
        setSmsDisabled(false);
        const uniqueId = getUniqueId();
        setClearForm(uniqueId);
    };

    const handleNumberCTA = (type = "sms") => {
        const number = meanPayload;
        if (!name)
            return showToast(`Insira primeiro nome do ${whichAudience()}`, {
                type: "error",
            });
        if (!number)
            return showToast(`Insira contato do ${whichAudience()}`, {
                type: "error",
            });
        if (!validatePhone(number))
            return showToast("Formato telefone inválido.", { type: "error" });

        if (type === "sms") {
            setSmsDisabled(true);
            if (smsBalance === 0) return setFullOpen(true);
            showToast(`Enviando convite para ${name.cap()}!`);

            const smsObj = getSmsObj({
                bizId,
                name,
                meanPayload,
            });
            sendSMS(smsObj).then(() => {
                handleSuccessOp("Convite Enviado!", handleNewRegister, true);
            });
        }
        if (type === "whatsapp") {
            const convertedWhatsapp = convertPhoneStrToInt(number);
            const whatsUrl = `https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${msg}`;
            runLinkTagOnClick(whatsUrl);
            handleSuccessOp("Encaminhado", handleNewRegister, true);
        }
    };

    const handleEmailCTA = () => {
        const email = meanPayload;
        if (!name)
            return showToast(`Insira primeiro nome do ${whichAudience()}`, {
                type: "error",
            });
        if (!validateEmail(email))
            return showToast("Formato de e-mail inválido.", { type: "error" });

        const subject = `${name.cap()}, convite da ${bizName && bizName.cap()}`;
        const emailUrl = `mailto:${email}?subject=${subject}&body=${msg}`;

        runLinkTagOnClick(emailUrl);
        handleSuccessOp("Encaminhado", handleNewRegister, true);
    };
    // End Actions

    const showNumberCTAs = () =>
        !successOp &&
        !newOne && (
            <section className="animated fadeInUp delay-1s container-center my-4">
                <section className="d-flex justify-content-center">
                    <div className="mr-4">
                        <ButtonFab
                            size="medium"
                            needTxtNoWrap
                            title="Enviar"
                            height="60px"
                            disabled={smsDisabled}
                            onClick={() => handleNumberCTA("sms")}
                            backgroundColor="var(--themeSDark--default)"
                            iconFontAwesome={
                                <FontAwesomeIcon icon="sms" style={muStyle} />
                            }
                            variant="extended"
                            position="relative"
                        />
                    </div>
                    <section className="position-relative">
                        <ButtonFab
                            size="medium"
                            needTxtNoWrap
                            title="Enviar"
                            height="60px"
                            disabled={!isPro}
                            onClick={() => handleNumberCTA("whatsapp")}
                            backgroundColor="var(--themeSDark--default)"
                            iconMu={<WhatsAppIcon style={muStyle} />}
                            variant="extended"
                            position="relative"
                        />
                    </section>
                </section>
            </section>
        );

    const showEmailCTA = () =>
        !successOp &&
        !newOne && (
            <section className="animated fadeInUp delay-1s container-center my-4">
                <ButtonFab
                    size="medium"
                    needTxtNoWrap
                    title="Enviar"
                    height="60px"
                    onClick={handleEmailCTA}
                    backgroundColor="var(--themeSDark--default)"
                    iconMu={<EmailIcon style={muStyle} />}
                    variant="extended"
                    position="relative"
                />
            </section>
        );

    const showQrCodeCTA = () => (
        <div className="container-center my-5 animated fadeInUp">
            <QrInvitationBtn
                qrValue={downloadLink}
                cliName={name}
                isNewMember={isNewMember}
            />
        </div>
    );

    const handleCopy = () => {
        copyText(msg, {
            msg: "Link de convite copiado!",
            parentId: "root--input-copy",
        });
    };

    const showGeneratedMsg = () =>
        !successOp &&
        !newOne && (
            <section id="root--input-copy" className="position-relative">
                <p className="mt-5 text-purple text-subtitle text-center font-weight-bold">
                    {name ? "Convite gerado:" : ""}
                </p>
                <main className="mx-3" style={styles.msgField}>
                    {name ? (
                        <section className="position-relative">
                            <p className="m-0 p-3 text-normal text-white text-break text-left mx-3">
                                {msg}
                            </p>
                            <div
                                className="position-absolute"
                                style={{ right: "10px", bottom: "-20px" }}
                            >
                                <RadiusBtn
                                    size="small"
                                    title="copiar"
                                    onClick={handleCopy}
                                />
                            </div>
                        </section>
                    ) : (
                        <p className="m-0 p-3 text-normal text-white text-break text-left mx-3">
                            {userName && userName.cap()}, no aguardo do nome do{" "}
                            {whichAudience()} e um modo de envio...
                        </p>
                    )}
                </main>
                {!isNewMember && name && (
                    <section className="my-5 animated fadeInUp">
                        <p
                            className={`text-center text-normal font-weight-bold ${
                                gotBonusCoins ? "text-purple" : "text-grey"
                            }`}
                        >
                            Moedas Bônus de Cadastro
                        </p>
                        <div className="container-center">
                            <p
                                className="d-table text-subtitle text-pill text-shadow"
                                style={{
                                    backgroundColor: gotBonusCoins
                                        ? "var(--themeP)"
                                        : "grey",
                                }}
                            >
                                {gotBonusCoins
                                    ? `+ ${registerBonusCoins} PTS Extras`
                                    : "Desativado"}
                            </p>
                        </div>
                    </section>
                )}
                {isNewMember && name && (
                    <p className="font-weight-bold mx-3 mb-3 mt-5 font-site text-em-1 text-purple">
                        <strong className="font-weight-bold text-normal text-purple">
                            Notas:
                        </strong>
                        <br />- O app dos membros{" "}
                        <span className="text-underline">
                            solicita uma senha
                        </span>{" "}
                        para certificar que somente membros autorizados possam
                        cadastrar moedas e clientes com uma camada adicional de
                        segurança.
                        <br />
                        <br />- Você pode{" "}
                        <strong className="text-underline">
                            consultar e trocar
                        </strong>{" "}
                        a qualquer momento no seu painel de controle indo na aba
                        ajustes > senhas > senha app membros.
                    </p>
                )}
            </section>
        );

    const showSuccessOp = () =>
        successOp && (
            <SuccessOp
                trigger={successOp}
                title={title}
                ctaFunc={ctaFunc}
                isNewMember={isNewMember}
            />
        );

    return (
        <section>
            <div className="my-5">
                <AsyncShowNewContactForm
                    isQuickRegister
                    isNewMember={isNewMember}
                    entryAnimation=" "
                    clearForm={clearForm}
                    handleMeanData={handleMeanData}
                    loadData={formPayload}
                    handleScoreToLink={handleScoreToLink}
                />
            </div>
            {name && meanType && meanType === "number" && showNumberCTAs()}
            {name && meanType && meanType === "email" && showEmailCTA()}
            {name && meanType && meanType === "qrCode" && showQrCodeCTA()}
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

// ARCHIVES
// useEffect(() => {
//     if(formPayload) {
//         const { name: thisName, phone, email } = formPayload;
//         setData({
//             ...data,
//             meanPayload: meanType === "number" ? phone : email,
//             name: thisName,
//         })
//     }
// }, [formPayload, meanType])
