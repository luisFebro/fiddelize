import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import useAPI, { convertCurrency } from "api/useAPI";
import convertToReal from "utils/numbers/convertToReal";
import handleChange from "utils/form/use-state/handleChange";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "1em",
        zIndex: 2000,
        width: 100,
        padding: 0,
    },
});

export default function CurrentConverter() {
    const [data, setData] = useState({
        brlAmount: 1,
    });
    const { brlAmount } = data;

    const styles = getStyles();

    const { data: dataConv, loading } = useAPI({
        url: convertCurrency(),
        params: {
            from: "USD",
            to: "BRL",
        },
    });

    const rawDollar = dataConv && dataConv.USD_to_BRL;
    const nowDollar = loading ? "$ ..." : `$${rawDollar}`;
    const totalConversion = loading
        ? "R$ ..."
        : `R$ ${convertToReal(brlAmount * rawDollar, { needFraction: true })}`;

    const amountField = () => (
        <TextField
            margin="dense"
            onChange={handleChange(setData, data)}
            name="brlAmount"
            value={brlAmount}
            InputProps={{
                style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
            }}
            type="number"
            label=""
            placeholder="R$ 0,00"
            autoComplete="off"
            fullWidth
        />
    );

    return (
        <section className="text-purple">
            <section className="d-flex justify-content-around">
                <div className="text-normal text-center font-weight-bold">
                    <span className="font-site text-em-1-1">Real</span>
                    <br />
                    {amountField()}
                </div>
                <div className="text-normal text-center font-weight-bold">
                    <span className="font-site text-em-1-1">Dolar</span>
                    <br />
                    {nowDollar}
                </div>
            </section>
            <div className="text-normal text-center font-weight-bold">
                <span className="font-site text-em-1-1">Total</span>
                <br />
                {totalConversion}
            </div>
        </section>
    );
}
