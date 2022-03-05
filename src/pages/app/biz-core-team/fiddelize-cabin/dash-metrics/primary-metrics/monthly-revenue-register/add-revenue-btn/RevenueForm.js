import { useState } from "react";
import { convertToDollar } from "utils/numbers/convertToReal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import showToast from "components/toasts";
import handleChange from "utils/form/use-state/handleChange";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getAPI, { addFiddelizeRevenue } from "api";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";
import useData from "init";
import getPercentage from "utils/numbers/getPercentage";
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        font: "normal 1em Poppins, sans-serif",
    },
});

export default function RevenueForm({
    mainData,
    switchRevenuePanel,
    handleNewRevenueCard,
}) {
    const [data, setData] = useState({
        desc: "",
        value: null,
        isCAC: false,
        alreadySalary: false,
    });
    const { desc, value } = data;

    const availableCash = mainData && mainData.allTimeCashAmount;

    const styles = getStyles();
    const [firstName] = useData(["firstName"]);

    const formattedValue = moneyMaskBr(value);

    const handleNewCost = () => {
        if (!desc) {
            return showToast("Faltando descrição!", { type: "error" });
        }

        if (!value) {
            return showToast("Faltando valor!", { type: "error" });
        }

        (async () => {
            showToast(`Registrando agora! Um momento...`);

            const newCostCard = {
                desc,
                value: convertToDollar(formattedValue),
            };

            await getAPI({
                method: "post",
                url: addFiddelizeRevenue(),
                body: newCostCard,
            });

            // update by adding this new card to the list of loaded cards
            await handleNewRevenueCard(newCostCard);
            // close panel
            await switchRevenuePanel(false);

            showToast(`Nova Receita registrada, ${firstName}!`, {
                type: "success",
            });
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
                Nova Receita
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
