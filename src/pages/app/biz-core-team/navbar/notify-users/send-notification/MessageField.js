import { useState, useEffect, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import useAPI, { sendPushNotifs } from "../../../../../../hooks/api/useAPI";
import showToast from "../../../../../../components/toasts";
import Title from "../../../../../../components/Title";
import SelectField from "../../../../../../components/fields/SelectField";
import Field from "../../../../../../components/fields/field";
import getId from "../../../../../../utils/getId";
import scrollIntoView from "../../../../../../utils/document/scrollIntoView";
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    form: {
        background: "var(--themePLight)",
        borderRadius: "10px",
        padding: "25px 5px",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
        zIndex: 2000,
    },
});

const handlePushPayloads = ({ body, ...data }) => ({
    announcement: {
        fields: [
            {
                showTitle: "URL do anúncio:",
                title: "learnMoreUrl",
            },
        ],
        dataToSend: {
            payload: {
                title: "📣 Novidade no app!", // 🔧⚙️ Falha corrigida!
                releaseBrief: body,
            },
            notifCard: {
                cardType: "announcement",
                title: "Novidade no App",
                brief: body,
                learnMoreUrl: data.learnMoreUrl,
            },
        },
        bodyShowTitle: "Descreva a nova funcionalidade:",
    },
    bugFix: {
        fields: [
            {
                showTitle: "Versão do conserto",
                title: "fixedVersion",
            },
            {
                showTitle: "Nome Usuário (opcional)",
                title: "firstUserName",
            },
        ],
        dataToSend: {
            payload: {
                title: "🔧⚙️ Falha corrigida!",
                bugBrief: body,
                firstUserName: data.firstUserName,
                fixedVersion: data.fixedVersion,
            },
            notifCard: false,
        },
        bodyShowTitle: "Descreva apenas o problema consertado:",
    },
});

const defaultSelected = "selecione tipo notif:";

export default function MessageField({
    whichTab,
    usersList,
    showMessage,
    appType,
    setMainData,
}) {
    const [data, setData] = useState({
        notifType: "",
        body: "",
        // for announcement:
        learnMoreUrl: "",
        // for bug Fix
        firstUserName: "",
        fixedVersion: "",
    });
    const { notifType, body } = data;

    const runMoreFields = notifType !== "";

    const [disabled, setDisabled] = useState(false);
    const styles = getStyles();

    const [triggerData, setTriggerData] = useState({
        trigger: false,
        triggerBody: {},
    });

    const { trigger, triggerBody } = triggerData;

    const { data: doneMsg, loading } = useAPI({
        method: "post",
        url: sendPushNotifs(),
        body: triggerBody,
        needAuth: true,
        timeout: 50000,
        snackbar: {
            txtPending: "Enviando agora...",
            txtSuccess: "Notificações Enviadas!",
            txtFailure: "",
        },
        trigger,
    });

    useEffect(() => {
        if (doneMsg && !loading) {
            (async () => {
                await setDisabled(false);
                await setMainData((prev) => ({
                    ...prev,
                    usersList: [],
                    showMessage: false,
                }));
                scrollIntoView("#recipientOptions");
            })();
        }
        // eslint-disable-next-line
    }, [doneMsg, loading]);

    const handleSendNow = () => {
        if (!body.length)
            return showToast("Insira alguma mensagem para a notificação", {
                type: "error",
            });

        const { dataToSend } = handlePushPayloads({
            body,
            learnMoreUrl: data.learnMoreUrl,
            firstUserName: data.firstUserName,
            fixedVersion: data.fixedVersion,
        })[notifType];

        const userIds = usersList.map((elem) => elem.userId);

        const finalData = {
            appType,
            notifType,
            userIds,
            ...dataToSend,
        };

        setDisabled(true);
        const uniqueId = getId();
        setTriggerData({
            trigger: uniqueId,
            triggerBody: finalData,
        });

        return false;
    };

    const showCTABtn = () => (
        <section className="d-flex align-items-center justify-content-around mt-5 mb-3">
            <ButtonFab
                size="large"
                disabled={disabled}
                title="Enviar agora"
                position="relative"
                onClick={handleSendNow}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
            />
        </section>
    );

    const plural = usersList.length > 1 ? "s" : "";

    const showNotifTypeField = () => {
        const handleSelectedApp = (val) => {
            if (defaultSelected === val) return;
            setData({
                ...data,
                notifType: val,
            });
        };

        const valuesArray = [
            { val: "announcement", showVal: "Anúncio de Novidade" },
            { val: "bugFix", showVal: "Conserto de Erros" },
        ];

        return (
            <SelectField
                title={defaultSelected}
                valuesArray={valuesArray}
                handleValue={handleSelectedApp}
            />
        );
    };

    const dataFieldsForNotifType = runMoreFields
        ? handlePushPayloads({})[notifType].fields
        : [];
    const showFieldsForNotifType = () => (
        <Fragment>
            {dataFieldsForNotifType.map((fi) => (
                <Fragment key={fi.title}>
                    <p className="mt-2 text-normal text-white text-shadow">
                        {fi.showTitle}
                    </p>
                    <Field
                        textAlign="text-center"
                        size="medium"
                        name={fi.title}
                        value={data[fi.title]}
                        onChangeCallback={setData}
                    />
                </Fragment>
            ))}
        </Fragment>
    );

    const bodyShowTitle =
        handlePushPayloads({})[notifType] &&
        handlePushPayloads({})[notifType].bodyShowTitle;
    return (
        <section
            style={{
                marginBottom: 150,
            }}
        >
            {Boolean(showMessage && usersList.length) && (
                <section className="animated fadeInUp slow">
                    <hr className="lazer-purple" />
                    <Title
                        title="&#187; Crie sua Notificação"
                        color="var(--themeP)"
                        margin="my-5"
                        padding=" "
                    />
                    <section className="container-center-max-width-500">
                        <form className="shadow-elevation" style={styles.form}>
                            <p className="text-center text-shadow text-white text-subtitle font-weight-bold">
                                NOTIFICAÇÃO
                                <span className="mt-3 ml-2 d-block text-left text-shadow text-white text-normal font-weight-bold">
                                    ✔ ENVIO PARA:
                                    <br />
                                    {whichTab}
                                </span>
                                <span className="mt-3 ml-2 d-block text-left text-shadow text-white text-normal font-weight-bold">
                                    ✔ TOTAL:
                                    <br />
                                    {usersList.length} contato{plural}.
                                </span>
                            </p>
                            {showNotifTypeField()}
                            {runMoreFields && (
                                <section className="animated fadeInUp">
                                    {showFieldsForNotifType()}
                                    <p className="mt-2 text-normal text-white text-shadow">
                                        {bodyShowTitle}
                                    </p>
                                    <TextField
                                        multiline
                                        rows={8}
                                        id="messageField"
                                        name="body"
                                        InputProps={{
                                            style: styles.fieldFormValue,
                                        }}
                                        inputProps={{
                                            maxLength: 300,
                                        }}
                                        value={body}
                                        onChange={handleChange(setData, data)}
                                        onBlur={null}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <div
                                        className="position-relative text-white text-shadow text-nowrap pl-1"
                                        style={{ top: "10px" }}
                                    >
                                        <span className="font-weight-bold">
                                            {body.length}/300 characteres
                                        </span>
                                    </div>
                                    {showCTABtn()}
                                </section>
                            )}
                        </form>
                    </section>
                </section>
            )}
        </section>
    );
}
