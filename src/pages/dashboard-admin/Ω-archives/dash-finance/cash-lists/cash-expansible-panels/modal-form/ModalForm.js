import React, { useEffect, useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import parse from "html-react-parser";
import moment from "moment";
import ButtonMulti from "../../../../../../components/buttons/material-ui/ButtonMulti";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";

// CUSTOM DATA
import {
    convertCommaToDot,
    convertDotToComma,
} from "../../../../../../utils/numbers/convertDotComma";
import { readServicesList } from "../../../../../../redux/actions/adminActions";
import { updateFinance } from "../../../../../../redux/actions/financeActions";
import isMoneyBrValidAndAlert from "../../../../../../utils/numbers/isMoneyBrValidAndAlert";

export default function ModalForm({ setRun, run, open, onClose, modalData }) {
    const [data, setData] = useState({
        paymentType: "",
        agentName: "",
        installmentsIfCredit: 2,
        cashInValue: null,
        cashOutValue: null,
        description: "",
        service: "outros",
        adminNamesList: [],
        // do not change
        statusCheck: "",
        formattedDate: moment(new Date()).format("LLLL"),
        agentRole: "",
    });
    const {
        paymentType,
        installmentsIfCredit,
        agentName,
        cashInValue,
        cashOutValue,
        description,
        service,
        formattedDate,
        adminNamesList,
    } = data;

    const { title, txtBtn, iconBtn, itemData, isCashOut } = modalData;

    const [error, setError] = useState("");

    const { servicesList } = useStoreState((state) => ({
        servicesList: state.adminReducer.cases.services,
    }));
    const dispatch = useStoreDispatch();

    useEffect(() => {
        readServicesList(dispatch).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            setData({
                ...data,
                agentRole: itemData.agentRole,
                statusCheck: itemData.statusCheck,
                paymentType: itemData.paymentType,
                installmentsIfCredit: itemData.installmentsIfCredit,
                agentName: itemData.agentName,
                cashInValue: convertDotToComma(itemData.cashInValue),
                cashOutValue: convertDotToComma(itemData.cashOutValue),
                description: itemData.description,
                service: itemData.service,
                formattedDate: itemData.formattedDate,
            });
        });
    }, []);

    const styles = {
        root: {
            width: "100%",
        },
        mainContent: {
            display: "flex",
            flexBasis: "90%",
            justifyContent: "center",
            minHeight: "auto", // temp
        },
        form: {
            maxWidth: "400px",
            background: `${
                isCashOut ? "var(--expenseRed)" : "var(--incomeGreen)"
            }`,
            borderRadius: "10px",
            padding: "25px",
        },
        fieldForm: {
            backgroundColor: "var(--mainWhite)",
            textAlign: "center",
            zIndex: 2000,
        },
        fieldFormValue: {
            backgroundColor: "var(--mainWhite)",
            fontSize: "2.1em",
            zIndex: 2000,
        },
        icon: {
            top: "-40px",
            left: "-30px",
            animationIterationCount: 2,
        },
        actionButtons: {
            display: "flex",
            justifyContent: "center",
            marginTop: "28px",
        },
    };

    const handleSubmit = () => {
        // Validation
        let cashType = cashInValue;
        if (isCashOut) {
            cashType = cashOutValue;
        }
        if (!isMoneyBrValidAndAlert(cashType, showSnackbar, dispatch)) {
            setError("cashValue");
            return;
        }

        if (description === "") {
            showSnackbar(dispatch, "Insira uma breve descrição", "error");
            setError("description");
            return;
        }

        const objToSend = {
            ...data,
            cashInValue: parseFloat(convertCommaToDot(cashInValue)),
            cashOutValue: parseFloat(convertCommaToDot(cashOutValue)),
        };

        onClose();
        showSnackbar(dispatch, "Alterando...", "warning", 3000);
        updateFinance(dispatch, itemData._id, objToSend).then((res) => {
            showSnackbar(
                dispatch,
                `A operação financeira de ${itemData.agentName.toUpperCase()} foi atualizada.`,
                "success",
                8000
            );
            setRun(!run);
        });
    };

    const showTitle = () => (
        <div className="text-center container-center font-weight-bold">
            <DialogTitle id="form-dialog-title">{parse(title)}</DialogTitle>
        </div>
    );

    const showForm = () => (
        <form
            onBlur={() => setError("")}
            style={styles.form}
            className="position-relative"
        >
            <div>
                <span className="text-white text-normal text-em-1.5 font-weight-bold">
                    {`VALOR EM R$ ${isCashOut ? "QUE SAIU:*" : "QUE ENTROU:*"}`}
                    <TextField
                        placeholder="0,00"
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                        }}
                        name={`${isCashOut ? "cashOutValue" : "cashInValue"}`}
                        value={isCashOut ? cashOutValue : cashInValue}
                        onChange={handleChange(setData, data)}
                        variant="outlined"
                        error={error === "cashValue"}
                        autoComplete="off"
                        helperText="Insira apenas números e vírgula"
                        fullWidth
                    />
                </span>
            </div>
            <div className="mt-3">
                <span className="text-white text-normal text-em-1 font-weight-bold">
                    DESCRIÇÃO:
                    <TextField
                        style={styles.fieldForm}
                        name="description"
                        value={description}
                        onChange={handleChange(setData, data)}
                        error={error === "description"}
                        variant="outlined"
                        autoComplete="off"
                        multiline
                        rows={2}
                        fullWidth
                    />
                </span>
            </div>
            {isCashOut ? (
                <React.Fragment>
                    <div className="mt-3">
                        <span className="text-white text-normal text-em-1 font-weight-bold">
                            {`${isCashOut ? "DESPESA COM:" : null}`}
                            <Select
                                style={styles.fieldForm}
                                fullWidth
                                variant="outlined"
                                name="paymentType"
                                value={paymentType}
                                onChange={handleChange(setData, data)}
                            >
                                <MenuItem value={paymentType}>
                                    dinheiro
                                </MenuItem>
                                <MenuItem value="crédito">crédito</MenuItem>
                                <MenuItem value="débito">débito</MenuItem>
                            </Select>
                        </span>
                    </div>
                    {paymentType === "crédito" ? (
                        <div className="animated zoomIn mt-3">
                            <span className="text-white text-normal text-em-1 font-weight-bold">
                                QTDE. PARCELAS:
                                <br />
                                <TextField
                                    InputProps={{
                                        style: {
                                            fontSize: "2em",
                                            width: "80px",
                                            backgroundColor: "var(--mainWhite)",
                                        },
                                        inputProps: { min: 2, max: 12 },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="installmentsIfCredit"
                                    value={installmentsIfCredit}
                                    onChange={handleChange(setData, data)}
                                />
                            </span>
                        </div>
                    ) : null}
                </React.Fragment>
            ) : null}
            <div className="mt-3">
                {isCashOut ? null : (
                    <span className="text-white text-normal text-em-1 font-weight-bold">
                        SERVIÇO:
                        <Select
                            style={styles.fieldForm}
                            labelId="service"
                            fullWidth
                            variant="outlined"
                            name="service"
                            value={service}
                            onChange={handleChange(setData, data)}
                        >
                            <MenuItem value={service}>outros</MenuItem>
                            {servicesList &&
                                servicesList.map((service) => (
                                    <MenuItem
                                        key={service._id}
                                        value={service.name}
                                    >
                                        {service.name.cap()}
                                    </MenuItem>
                                ))}
                        </Select>
                    </span>
                )}
                <div className="mt-3 text-center text-normal font-weight-bold">
                    Data Registro:
                    <br />
                    {formattedDate}
                </div>
            </div>
        </form>
    );

    const showActionButtons = () => (
        <section style={styles.actionButtons}>
            <ButtonMulti title="Voltar" onClick={onClose} variant="link" />
            <ButtonMulti
                title={txtBtn}
                onClick={handleSubmit}
                iconFontAwesome={iconBtn}
            />
        </section>
    );

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                {showTitle()}
                {showForm()}
                {showActionButtons()}
            </Dialog>
        </div>
    );
}
