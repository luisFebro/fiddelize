import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import handleChange from "../../../../../../utils/form/use-state/handleChange";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import getAPI, {
    addFinanceTransaction,
} from "../../../../../../utils/promises/getAPI";
import moneyMaskBr from "../../../../../../utils/validation/masks/moneyMaskBr";
import useData from "../../../../../../hooks/useData";
import { convertToDollar } from "../../../../../../utils/numbers/convertToReal";
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        font: "normal 1em Poppins, sans-serif",
    },
});

export default function NewTransactionForm({
    mainData,
    switchTransactionPanel,
}) {
    const type = (mainData && mainData.type) || "out";
    const handleNewTransactionCard =
        mainData && mainData.handleNewTransactionCard;

    const [data, setData] = useState({
        desc: "",
        value: null,
    });
    const { desc, value } = data;

    const styles = getStyles();
    const dispatch = useStoreDispatch();
    const [firstName] = useData(["firstName"]);
    const isExpense = type === "out";

    const formattedValue = moneyMaskBr(value);

    const handleNewTransaction = () => {
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

            const newTransactionCard = {
                type,
                desc,
                value: convertToDollar(formattedValue),
            };

            await getAPI({
                method: "post",
                url: addFinanceTransaction(),
                body: newTransactionCard,
            });

            // update by adding this new card to the list of loaded cards
            await handleNewTransactionCard(newTransactionCard);
            await switchTransactionPanel(false);

            const confirmedMsg = isExpense
                ? "Nova Despesa registrada"
                : "Novo ganho registrado";
            showSnackbar(dispatch, `${confirmedMsg}, ${firstName}!`, "success");
        })();
    };

    const showCTA = () => (
        <section className="container-center my-5">
            <ButtonFab
                onClick={handleNewTransaction}
                disabled={false}
                title="Registrar"
                color="var(--mainWhite)"
                iconFontAwesome={<FontAwesomeIcon icon="save" style={null} />}
                size="large"
                backgroundColor="var(--expenseRed)"
                variant="extended"
            />
        </section>
    );

    return (
        <form
            style={{
                margin: "auto",
                width: "100%",
                borderRadius: "20px",
                padding: "10px",
            }}
            className="animated fadeInUp text-p text-normal shadow-babadoo"
            onBlur={null}
        >
            <h2 className="text-center text-subtitle font-weight-bold">
                {isExpense ? "Nova Despesa" : "Novo Ganho"}
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
