import React, { useState, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import getFirstName from "../../../../../utils/string/getFirstName";
import MoneyKeyboard from "../../../../../components/keyboards/MoneyKeyboard";
import { convertBrToDollar } from "../../../../../utils/numbers/convertDotComma";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "3em",
        zIndex: 2000,
        width: 270,
        padding: 0,
    },
    input: {
        padding: "10px",
    },
});

export default function ScoreCustomer({
    customerName,
    colorP = "purple",
    setCurr,
}) {
    const [score, setScore] = useState("");

    const styles = getStyles();

    const handleReturn = () => {
        setCurr((prev) => ({
            ...prev,
            field: "name",
        }));
    };

    const handleConfirm = () => {
        // open confir
        // Confira o resumo
    };

    return (
        <Fragment>
            <h1 className="animated fadeInUp delay-1s mt-4 mb-3 text-center text-white text-subtitle font-weight-bold">
                <span className="text-em-1-3 d-block">
                    Cliente:
                    <br />
                    {getFirstName(customerName && customerName.cap(), {
                        addSurname: true,
                    })}
                </span>
                Quanto foi a compra?
            </h1>
            <section className="animated slideInRight container-center">
                <TextField
                    placeholder="0,00"
                    InputProps={{
                        style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                    }}
                    inputProps={{ style: styles.input }}
                    name="score"
                    value={score}
                    variant="outlined"
                    error={false}
                    autoComplete="off"
                />
            </section>
            <MoneyKeyboard
                setDisplay={setScore}
                display={score}
                colorP={colorP}
                handleReturn={handleReturn}
                handleConfirm={handleConfirm}
            />
        </Fragment>
    );
}
