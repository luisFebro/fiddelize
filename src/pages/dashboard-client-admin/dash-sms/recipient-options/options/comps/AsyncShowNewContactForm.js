import { useState, useEffect, Fragment, useCallback } from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import EmailIcon from "@material-ui/icons/Email";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import showToast from "../../../../../../components/toasts";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import { default as clearThisForm } from "../../../../../../utils/form/use-state/clearForm";
import { handleFocus } from "../../../../../../utils/form/handleFocus";
import isKeyPressed from "../../../../../../utils/event/isKeyPressed";
import autoPhoneMask from "../../../../../../utils/validation/masks/autoPhoneMask";
import validatePhone from "../../../../../../utils/validation/validatePhone";
import debounce from "../../../../../../utils/performance/debounce";
import AddScoreCTAs from "./from-add-score/AddScoreCTAs";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
        color: "var(--themeP)",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
    card: {
        margin: "auto",
        width: "90%",
        maxWidth: isSmall ? "" : 320,
    },
});

const handleEvents = (e, options) => {
    const {
        setData,
        newValue,
        field,
        eventName,
        callback,
        onlyFocus = false,
        delay = 0,
    } = options;
    if (onlyFocus) {
        if (field) {
            setTimeout(() => handleFocus(field), 2000);
        }
        return;
    }

    let { name, value } = e.target;

    if (newValue) value = newValue;

    if (isKeyPressed(e, "Enter") || eventName === "blur") {
        setData((prevData) => ({ ...prevData, [name]: value }));
        if (field) {
            setTimeout(() => handleFocus(field), delay);
        }
        if (typeof callback === "function") {
            callback();
        }
    }
};

const getAdornmentIcon = (Icon, styles) => ({
    startAdornment: <InputAdornment position="start">{Icon}</InputAdornment>,
    style: styles.fieldForm,
});

export default function AsyncShowNewContactForm({
    handleAddContact,
    isQuickRegister = false,
    handleMeanData,
    clearForm,
    entryAnimation,
    loadData,
    isNewMember,
    handleScoreToLink,
}) {
    const [data, setData] = useState({
        name: "",
        phone: "",
    });
    const { name, phone } = data;
    const phoneValue = autoPhoneMask(phone);

    const [dataMean, setDataMean] = useState({
        selectedMean: "selecione um modo:",
        job: "vendas", // only for team members
        email: null,
    });
    const { selectedMean, email, job } = dataMean;
    const [error, setError] = useState(null);
    const [readyMean, setReadyMean] = useState(false);

    const isAfterCompleteRegister = Boolean(loadData && loadData.name);
    const alreadySelectedMethod = selectedMean !== "selecione um modo:";
    const needPhoneField = !isQuickRegister || selectedMean === "number";
    const needEmailField = selectedMean === "email";

    useEffect(() => {
        // transfer: set data to the parent component
        const needTransfer =
            (loadData && selectedMean !== "selecione um modo:") ||
            alreadySelectedMethod;

        if (loadData && !needTransfer) {
            const {
                name: thisName,
                phone: thisPhone,
                email: thisEmail,
            } = loadData;

            setData({ ...data, name: thisName, phone: thisPhone });
            setDataMean({ ...dataMean, email: thisEmail });
        }

        if (needTransfer) {
            handleMeanData({
                meanType: selectedMean,
                meanPayload: selectedMean === "number" ? phone : email,
                name,
                job,
            });
        }
    }, [loadData, selectedMean, alreadySelectedMethod]);

    const delayedType = useCallback(
        debounce((value) => {
            setReadyMean(true);
        }, 2500),
        []
    );
    const onChangeMean = (e, setObj) => {
        // LESSON: do not import the whole event element to debounce/throttle cuz react pooling or smt
        const { name, value } = e.target;

        if (isQuickRegister) {
            setObj((prev) => ({ ...prev, [name]: value }));
            delayedType();
            return;
        }
        handleChange(setObj)(e);
    };

    useEffect(() => {
        if (clearForm) {
            clearThisForm(setData);
            clearThisForm(setDataMean);
        }
    }, [clearForm]);

    useEffect(() => {
        const mean = selectedMean === "number" ? phone : email;

        if (isQuickRegister && selectedMean && mean && readyMean) {
            handleMeanData({
                meanType: selectedMean,
                meanPayload: mean,
                name,
                job,
            });
        }
    }, [isQuickRegister, readyMean, selectedMean, email, phone, name, job]);

    const styles = getStyles();

    const handleCTA = () => {
        if (!name) {
            return showToast("Insira o nome do destinatário", {
                type: "error",
                callback: () => setError("name"),
            });
        }
        if (!phone) {
            return showToast("Insira um telefone", {
                type: "error",
                callback: () => setError("phone"),
            });
        }
        if (!validatePhone(phone)) {
            return showToast("Formato telefone inválido.", {
                type: "error",
                callback: () => setError("phone"),
            });
        }
        clearThisForm(setData);
        handleAddContact({ name, phone });
    };

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => {
                setError(null);
            }}
        >
            <div className="mt-3">
                {!isQuickRegister
                    ? "Nome"
                    : `Primeiro nome ${isNewMember ? "(membro)" : "(cliente)"}`}
                <TextField
                    required
                    onChange={handleChange(setData)}
                    error={error === "name"}
                    variant="outlined"
                    margin="dense"
                    id="field1"
                    name="name"
                    onKeyPress={(e) =>
                        handleEvents(e, {
                            setData,
                            newValue: name.cap(),
                            field: "fieldMean",
                        })
                    }
                    onBlur={(e) =>
                        handleEvents(e, {
                            setData,
                            newValue: name.cap(),
                            eventName: "blur",
                            field: "fieldMean",
                        })
                    }
                    autoComplete="off"
                    value={name}
                    type="text"
                    fullWidth
                    InputProps={getAdornmentIcon(<AccountCircle />, styles)}
                />
            </div>

            {isQuickRegister && (
                <section className="my-4">
                    Modo de Envio
                    <Select
                        margin="dense"
                        labelId="selectedMean"
                        id="fieldMean"
                        onChange={(e) => {
                            handleChange(setDataMean)(e);
                            handleEvents(e, {
                                onlyFocus: true,
                                field: isNewMember
                                    ? "selectedJob"
                                    : "selectedOpt",
                            });
                            setReadyMean(false);
                        }}
                        name="selectedMean"
                        fullWidth
                        value={selectedMean}
                        variant="outlined"
                        style={{ backgroundColor: "var(--mainWhite)" }}
                    >
                        <MenuItem value={selectedMean}>
                            <span
                                className="text-p text-normal"
                                style={{
                                    fontSize: isSmall ? "1.1em" : "",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                selecione um modo:
                            </span>
                        </MenuItem>
                        <MenuItem value="qrCode">Código QR</MenuItem>
                        <MenuItem value="number">
                            Celular (SMS ou Whatsapp)
                        </MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="copy">Copiar convite</MenuItem>
                    </Select>
                </section>
            )}

            {isQuickRegister && isNewMember && (
                <section className="my-4">
                    Área de Atuação
                    <Select
                        margin="dense"
                        labelId="selectedMean"
                        id="selectedJob"
                        onChange={(e) => {
                            handleChange(setDataMean)(e);
                            handleEvents(e, {
                                onlyFocus: true,
                                field: "selectedOpt",
                            });
                            setReadyMean(false);
                        }}
                        name="job"
                        fullWidth
                        value={job}
                        variant="outlined"
                        style={{ backgroundColor: "var(--mainWhite)" }}
                    >
                        <MenuItem value={job}>
                            <span
                                className="text-p text-normal"
                                style={{
                                    fontSize: isSmall ? "1.1em" : "",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                selecione atuação:
                            </span>
                        </MenuItem>
                        <MenuItem value="vendas">Vendas</MenuItem>
                        <MenuItem value="atendimento">Atendimento</MenuItem>
                        <MenuItem value="caixa">Caixa</MenuItem>
                        <MenuItem value="gerência">Gerência</MenuItem>
                    </Select>
                </section>
            )}

            {needPhoneField && (
                <div
                    className={`${
                        isQuickRegister ? "animated fadeInUp fast my-3" : "mt-3"
                    }`}
                >
                    Contato
                    <TextField
                        required
                        id="selectedOpt" // this is the essential fields which can be either phone or email in this form.
                        margin="dense"
                        name="phone"
                        value={phoneValue}
                        onChange={(e) => onChangeMean(e, setData)}
                        error={error === "phone"}
                        onKeyPress={(e) =>
                            handleEvents(e, {
                                setData,
                                newValue: autoPhoneMask(phone),
                            })
                        }
                        onBlur={(e) =>
                            handleEvents(e, {
                                setData,
                                newValue: autoPhoneMask(phone),
                                eventName: "blur",
                            })
                        }
                        helperText="Digite com DDD"
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        type="tel"
                        autoComplete="off"
                        fullWidth
                        variant="outlined"
                        InputProps={getAdornmentIcon(
                            <PhoneIphoneIcon />,
                            styles
                        )}
                    />
                </div>
            )}

            {needEmailField && (
                <div className="animated fadeInUp fast my-3">
                    Email
                    <TextField
                        required
                        id="selectedOpt"
                        margin="dense"
                        onChange={(e) => onChangeMean(e, setDataMean)}
                        error={!!false}
                        name="email"
                        variant="outlined"
                        value={email}
                        type="email"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                        }}
                    />
                </div>
            )}
            {isQuickRegister &&
                !isNewMember &&
                alreadySelectedMethod &&
                !isAfterCompleteRegister && (
                    <AddScoreCTAs
                        clientName={name}
                        handleScoreToLink={handleScoreToLink}
                    />
                )}
            {isAfterCompleteRegister && (
                <p className="my-3 mx-3 text-small text-purple">
                    <strong>Nota:</strong> O{" "}
                    <strong>cadastro com pontos</strong> está disponível apenas
                    para envio de convite sem cadastro na hora.
                </p>
            )}
        </form>
    );

    const showButtonActions = () => (
        <Fragment>
            {!isQuickRegister && (
                <section className="container-center my-3">
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap
                        title="Adicionar"
                        onClick={handleCTA}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        position="relative"
                    />
                </section>
            )}
        </Fragment>
    );

    return (
        <Card
            className={`mt-0 mb-5 ${
                entryAnimation || "animated zoomIn fast"
            } shadow-elevation`}
            style={styles.card}
            elevation={false}
        >
            {!isQuickRegister && (
                <p className="my-3 text-subtitle font-weight-bold text-purple text-center">
                    Novo Contato
                </p>
            )}
            {showForm()}
            {showButtonActions()}
        </Card>
    );
}
