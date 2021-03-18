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
import { convertBrToDollar } from "../../../../../../../../utils/numbers/convertDotComma";
// const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    // helperFromField: {
    //     color: "grey",
    //     fontFamily: "Poppins, sans-serif",
    //     fontSize: isSmall ? ".8em" : ".6em",
    // },
});

export default function CostForm({ switchCostPanel, handleNewCostCard }) {
    const [data, setData] = useState({
        desc: "",
        value: null,
    });
    const { desc, value } = data;

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
                value: convertBrToDollar(formattedValue),
                createdAt: new Date(),
            };

            await getAPI({
                method: "post",
                url: addFiddelizeCosts(),
                body: newCostCard,
            });

            await handleNewCostCard(newCostCard);
            switchCostPanel(false);
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
