import React, { useState, useEffect, Fragment, useCallback } from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import EmailIcon from "@material-ui/icons/Email";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import { default as clearThisForm } from "../../../../../../utils/form/use-state/clearForm";
import { handleFocus } from "../../../../../../utils/form/handleFocus";
import isKeyPressed from "../../../../../../utils/event/isKeyPressed";
import phoneMaskBr from "../../../../../../utils/validation/masks/phoneMaskBr";
import validatePhone from "../../../../../../utils/validation/validatePhone";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import debounce from "../../../../../../utils/performance/debounce";

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
}) {
    const [data, setData] = useState({
        name: "",
        phone: "",
    });
    const { name, phone } = data;
    const [dataMean, setDataMean] = useState({
        selectedMean: "number",
        job: "vendas", // only for team members
        email: null,
    });
    const { selectedMean, email, job } = dataMean;
    const [error, setError] = useState(null);
    const [readyMean, setReadyMean] = useState(false);

    useEffect(() => {
        // transfer: set data to the parent component
        const needTransfer = loadData && selectedMean !== "selecione um modo:";

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
    }, [loadData, selectedMean]);

    const delayedType = useCallback(
        debounce((value) => {
            setReadyMean(true);
        }, 2500),
        []
    );
    const onChangeMean = (e, setObj) => {
        // LESSON: do not import the whole event element to debounce/throttle cuz react pooling or smt
        const name = e.target.name;
        const value = e.target.value;
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
    const needPhoneField = !isQuickRegister || selectedMean === "number";
    const needEmailField = selectedMean === "email";

    const dispatch = useStoreDispatch();

    const styles = getStyles();

    const handleCTA = () => {
        if (!name) {
            showSnackbar(dispatch, "Insira o nome do destinatário", "error");
            setError("name");
            return;
        }
        if (!phone) {
            showSnackbar(dispatch, "Insira um telefone", "error");
            setError("phone");
            return;
        }
        if (!validatePhone(phone)) {
            showSnackbar(
                dispatch,
                "Formato telefone inválido. exemplo:<br />95 9 9999 8888",
                "error"
            );
            setError("phone");
            return;
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
                {!isQuickRegister ? "Nome" : "Primeiro nome"}
                <TextField
                    required
                    onChange={handleChange(setData)}
                    error={error === "name" ? true : false}
                    variant="outlined"
                    margin="dense"
                    id="field1"
                    name="name"
                    onKeyPress={(e) =>
                        handleEvents(e, {
                            setData,
                            newValue: name.cap(),
                            field: "selectedOpt", // i am omitting this because if user jump to the last field, it will focus back on the second field.
                        })
                    }
                    onBlur={(e) =>
                        handleEvents(e, {
                            setData,
                            newValue: name.cap(),
                            eventName: "blur",
                            field: "selectedOpt", // this is the essential fields which can be either phone or email in this form.
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
                        <MenuItem value={"number"}>Número de Contato</MenuItem>
                        <MenuItem value={"email"}>Email</MenuItem>
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
                        <MenuItem value={"vendas"}>Vendas</MenuItem>
                        <MenuItem value={"atendimento"}>Atendimento</MenuItem>
                        <MenuItem value={"caixa"}>Caixa</MenuItem>
                        <MenuItem value={"gerência"}>Gerência</MenuItem>
                    </Select>
                </section>
            )}

            {needPhoneField && (
                <div
                    className={`${
                        isQuickRegister
                            ? "animated fadeInUp fast mt-3 mb-5"
                            : "mt-3"
                    }`}
                >
                    Contato
                    <TextField
                        required
                        id="selectedOpt"
                        margin="dense"
                        name="phone"
                        value={phone}
                        onChange={(e) => onChangeMean(e, setData)}
                        error={error === "phone" ? true : false}
                        onKeyPress={(e) =>
                            handleEvents(e, {
                                setData,
                                newValue: phoneMaskBr(phone),
                            })
                        }
                        onBlur={(e) =>
                            handleEvents(e, {
                                setData,
                                newValue: phoneMaskBr(phone),
                                eventName: "blur",
                            })
                        }
                        helperText={"Digite apenas números com DDD"}
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
                <div className="animated fadeInUp fast mt-3 mb-5">
                    Email
                    <TextField
                        required
                        id="selectedOpt"
                        margin="dense"
                        onChange={(e) => onChangeMean(e, setDataMean)}
                        error={false ? true : false}
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
        </form>
    );

    const showButtonActions = () => (
        <Fragment>
            {!isQuickRegister && (
                <section className="container-center my-3">
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap={true}
                        title="Adicionar"
                        onClick={handleCTA}
                        backgroundColor={"var(--themeSDark--default)"}
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
                entryAnimation ? entryAnimation : "animated zoomIn fast"
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
