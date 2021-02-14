import { useEffect, useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { CLIENT_URL } from "../../../../config/clientUrl";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
import handleChange from "../../../../utils/form/use-state/handleChange";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";

// CUSTOM DATA
import { convertCommaToDot } from "../../../../utils/numbers/convertDotComma";
import { readServicesList } from "../../../../redux/actions/adminActions";
import {
    getAllAvailableNames,
    createFinance,
} from "../../../../redux/actions/financeActions";
import isMoneyBrValidAndAlert from "../../../../utils/numbers/isMoneyBrValidAndAlert";

function BalanceForm({
    isExpenseForm = false,
    setRun,
    run,
    setCurrComponent,
    history,
}) {
    const [data, setData] = useState({
        paymentType: "dinheiro",
        agentName: "selecione nome:",
        installmentsIfCredit: 2,
        cashInValue: null,
        cashOutValue: null,
        description: "",
        service: "outros",
        adminNamesList: [],
        // do not change
        statusCheck: "pago",
        formattedDate: moment(new Date()).format("LLLL"),
        agentRole: "admin",
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

    const [error, setError] = useState("");
    const [preventDefault, setPreventDefault] = useState(false);

    const { servicesList } = useStoreState((state) => ({
        servicesList: state.adminReducer.cases.services,
    }));
    const dispatch = useStoreDispatch();

    useEffect(() => {
        readServicesList(dispatch);
        getAllAvailableNames(dispatch, true).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            setData({ ...data, adminNamesList: res.data });
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
                isExpenseForm ? "var(--expenseRed)" : "var(--incomeGreen)"
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
    };

    const clearForm = () => {
        setData({
            ...data,
            paymentType: "dinheiro",
            agentName: "selecione nome:",
            installmentsIfCredit: 2,
            cashInValue: "",
            cashOutValue: "",
            description: "",
            service: "outros",
            formattedDate: moment(new Date()).format("LLLL"),
            // do not change
            statusCheck: "pago",
            agentRole: "admin",
        });
    };

    const handleSubmit = (saveType) => {
        setPreventDefault(true);
        // Validation
        let cashType = cashInValue;
        if (isExpenseForm) {
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
        if (agentName === "selecione nome:") {
            showSnackbar(dispatch, "Selecione Nome Admin", "error");
            setError("agentName");
            return;
        }

        const bodyToSend = {
            ...data,
            cashInValue: parseFloat(convertCommaToDot(cashInValue)),
            cashOutValue: parseFloat(convertCommaToDot(cashOutValue)),
        };

        showSnackbar(dispatch, "Adicionando...");
        createFinance(dispatch, bodyToSend).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            showSnackbar(dispatch, res.data.msg, "success", 6000);
            clearForm();
            setRun(!run);
            if (saveType === "save-only") {
                history.push("/admin/painel-de-controle/#grafico");
                setCurrComponent("FinanceGraph");
            }
        });
    };

    const showForm = () => (
        <form
            onBlur={() => {
                setError("");
                setPreventDefault(false);
            }}
            style={styles.form}
            className="position-relative"
        >
            <div
                style={styles.icon}
                className="animated rotateIn delay-1 position-absolute"
            >
                <img
                    src={`${CLIENT_URL}/img/icons/${
                        isExpenseForm ? "less.svg" : "plus.svg"
                    }`}
                    width={60}
                    height="auto"
                    alt="icone mais/menos"
                />
            </div>
            <div>
                <span className="text-white text-normal text-em-1.5 font-weight-bold">
                    {`VALOR EM R$ ${
                        isExpenseForm ? "QUE SAIU:*" : "QUE ENTROU:*"
                    }`}
                    <TextField
                        placeholder="0,00"
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                        }}
                        name={`${
                            isExpenseForm ? "cashOutValue" : "cashInValue"
                        }`}
                        value={isExpenseForm ? cashOutValue : cashInValue}
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
                    DESCRIÇÃO*:
                    <TextField
                        style={styles.fieldForm}
                        name="description"
                        value={description}
                        onChange={handleChange(setData, data)}
                        error={error === "description"}
                        variant="outlined"
                        autoComplete="off"
                        multiline
                        rows={1}
                        fullWidth
                    />
                </span>
            </div>
            <div className="mt-3">
                <span className="text-white text-normal text-em-1 font-weight-bold">
                    ADMINISTRADOR*:
                    <Select
                        style={styles.fieldForm}
                        labelId="staff"
                        fullWidth
                        variant="outlined"
                        error={error === "agentName"}
                        name="agentName"
                        value={agentName}
                        onChange={handleChange(setData, data)}
                    >
                        <MenuItem value={agentName}>selecione nome:</MenuItem>
                        {adminNamesList &&
                            adminNamesList.map((found, ind) => (
                                <MenuItem key={ind} value={found}>
                                    {found.cap()}
                                </MenuItem>
                            ))}
                    </Select>
                </span>
            </div>
            <div className="mt-3">
                <span className="text-white text-normal text-em-1 font-weight-bold">
                    {`${
                        isExpenseForm ? "DESPESA COM:" : "FORMA DE PAGAMENTO:"
                    }`}
                    <Select
                        style={styles.fieldForm}
                        fullWidth
                        variant="outlined"
                        name="paymentType"
                        value={paymentType}
                        onChange={handleChange(setData, data)}
                    >
                        <MenuItem value={paymentType}>dinheiro</MenuItem>
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
            <div className="mt-3">
                {isExpenseForm ? null : (
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
            {showButtonActions()}
        </form>
    );

    const showButtonActions = () => (
        <div className="mt-4 mb-2 d-flex justify-content-between">
            <ButtonMulti
                title="Salvar + Novo"
                onClick={() => handleSubmit("save-and-new")}
                color="var(--mainWhite)"
                backgroundColor="var(--mainDark)"
                backColorOnHover="var(--mainDark)"
                iconFontAwesome="far fa-save"
                textTransform="uppercase"
                disabled={!!preventDefault}
            />
            <ButtonMulti
                title="SALVAR"
                onClick={() => handleSubmit("save-only")}
                color="var(--mainWhite)"
                backgroundColor="var(--mainDark)"
                backColorOnHover="var(--mainDark)"
                iconFontAwesome="fas fa-save"
                textTransform="uppercase"
                disabled={!!preventDefault}
            />
        </div>
    );

    return <div>{showForm()}</div>;
}

export default withRouter(BalanceForm);
