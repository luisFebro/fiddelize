import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../../../redux/actions/snackbarActions";
import handleChange from "../../../../../../../../utils/form/use-state/handleChange";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import getAPI, {
    addFiddelizeCosts,
} from "../../../../../../../../utils/promises/getAPI";
import moneyMaskBr from "../../../../../../../../utils/validation/masks/moneyMaskBr";
import useData from "../../../../../../../../hooks/useData";
import converToReal, {
    convertToDollar,
} from "../../../../../../../../utils/numbers/convertToReal";
import getPercentage from "../../../../../../../../utils/numbers/getPercentage";
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        font: "normal 1em Poppins, sans-serif",
    },
});

export default function CostForm({
    mainData,
    switchCostPanel,
    handleNewCostCard,
}) {
    const [data, setData] = useState({
        desc: "",
        value: null,
        alreadySalary: false,
    });
    const { desc, value, alreadySalary } = data;

    const availableCash = mainData && mainData.allTimeNetProfitAmount;
    const alreadyCurrMonthWithdrawal = mainData
        ? mainData.alreadyCurrMonthWithdrawal
        : null;
    const CEO_PERC_SALARY = 15;
    const ceoSalary = getPercentage(availableCash, CEO_PERC_SALARY, {
        mode: "value",
    });

    const styles = getStyles();
    const dispatch = useStoreDispatch();
    const [firstName] = useData(["firstName"]);

    const formattedValue = moneyMaskBr(value);

    const handleNewCost = () => {
        if (!desc) {
            return showSnackbar(dispatch, "Faltando descrição!", "error");
        }

        if (!value) {
            return showSnackbar(dispatch, "Faltando valor!", "error");
        }

        (async () => {
            showSnackbar(
                dispatch,
                `Registrando agora!<br />Um momento...`,
                "warning"
            );

            const newCostCard = {
                desc,
                value: convertToDollar(formattedValue),
            };

            await getAPI({
                method: "post",
                url: addFiddelizeCosts(),
                body: newCostCard,
            });

            // update by adding this new card to the list of loaded cards
            await handleNewCostCard(newCostCard);
            // close panel
            await switchCostPanel(false);

            showSnackbar(
                dispatch,
                `Novo Custo registrado, ${firstName}!`,
                "success"
            );
        })();
    };

    const showCTA = () => (
        <section className="container-center my-5">
            <ButtonFab
                onClick={handleNewCost}
                disabled={false}
                title="Registrar"
                color="var(--mainWhite)"
                iconFontAwesome={<FontAwesomeIcon icon="save" style={null} />}
                size="large"
                backgroundColor="var(--themeSDark)"
                variant="extended"
            />
        </section>
    );

    const handleSalaryWithdrawal = async () => {
        showSnackbar(
            dispatch,
            `Retirando e registrando salário!<br />Um momento...`,
            "warning"
        );

        const newCostCard = {
            desc: "salário",
            value: ceoSalary,
            isSalary: true,
        };

        await getAPI({
            method: "post",
            url: addFiddelizeCosts(),
            body: newCostCard,
        });

        await setData((prev) => ({
            ...prev,
            alreadySalary: true,
        }));
        await handleNewCostCard(newCostCard);

        showSnackbar(dispatch, `Salário Retirado, ${firstName}!`, "success");
    };

    const showSalaryArea = () => {
        if (alreadyCurrMonthWithdrawal === null) {
            return (
                <h2 className="text-center text-purple text-subtitle font-weight-bold">
                    Carregando...
                </h2>
            );
        }

        if (alreadyCurrMonthWithdrawal === false) {
            return (
                <section
                    className="text-purple"
                    style={{
                        backgroundColor: "rgb(148, 224, 148)",
                        padding: "30px 0",
                        borderRadius: "25px",
                    }}
                >
                    <h2
                        className="text-center text-black text-subtitle font-weight-bold"
                        style={{
                            lineHeight: "25px",
                        }}
                    >
                        Salário Mensal
                        <br />
                        Disponível
                    </h2>
                    <div className="container-center">
                        <p
                            className="mt-3 text-pill text-normal text-center font-weight-bold"
                            style={{
                                backgroundColor: "green",
                            }}
                        >
                            {converToReal(ceoSalary, { moneySign: true })} (
                            {CEO_PERC_SALARY}%)
                        </p>
                    </div>
                    <section className="container-center my-4">
                        <ButtonFab
                            onClick={handleSalaryWithdrawal}
                            disabled={false}
                            title="Retirar"
                            color="var(--mainWhite)"
                            size="large"
                            backgroundColor="green"
                            variant="extended"
                        />
                    </section>
                </section>
            );
        }

        return (
            <h2
                className="text-center text-grey text-normal font-weight-bold"
                style={{
                    backgroundColor: "var(--themeBackground--white)",
                    borderRadius: "25px",
                    marginTop: "100px",
                }}
            >
                Salário do mês já retirado.
            </h2>
        );
    };

    return (
        <form
            style={{
                margin: "auto",
                width: "90%",
                borderRadius: "20px",
                padding: "10px",
            }}
            className="animated fadeInUp text-p text-normal shadow-babadoo"
            onBlur={null}
        >
            <h2 className="text-center text-subtitle font-weight-bold">
                Novo Custo
            </h2>
            <div id="field1" className="mt-3">
                Descrição:
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={null}
                    name="desc"
                    value={desc}
                    variant="standard"
                    type="text"
                    autoComplete="off"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <TextFieldsIcon />
                            </InputAdornment>
                        ),
                        style: styles.fieldForm,
                        id: "value2",
                    }}
                />
            </div>
            <div id="field2" className="mt-3">
                Valor:
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    onKeyPress={null}
                    onBlur={null}
                    error={null}
                    name="value"
                    value={formattedValue}
                    variant="standard"
                    type="text"
                    autoComplete="off"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MonetizationOnIcon />
                            </InputAdornment>
                        ),
                        style: styles.fieldForm,
                        id: "value3",
                    }}
                />
            </div>
            {showCTA()}
            {!alreadySalary && showSalaryArea()}
        </form>
    );
}

/*
onKeyPress={(e) => {
    // Not working
    // handleNextField(e, "field1", {
    //     callback: () => {
    //         setData({ ...data, cpf: autoCpfMaskBr(cpf) });
    //     },
    // });
}}
onBlur={(e) => {
    // setData({ ...data, cpf: autoCpfMaskBr(cpf) });
    // handleNextField(e, "field1", {
    //     callback: () => {
    //     },
    // });
}}
 */
