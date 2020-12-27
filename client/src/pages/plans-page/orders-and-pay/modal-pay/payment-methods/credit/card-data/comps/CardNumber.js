import React from "react";
import TextField from "@material-ui/core/TextField";
import NavBtns from "./NavBtns";
import { handleEnterPress } from "../../../../../../../../utils/event/isKeyPressed";

export default function CardNumber({
    styles,
    handleChange,
    setData,
    setCurrComp,
    data,
    cardNumber,
}) {
    return (
        <section className="position-relative">
            <p
                className="text-small position-absolute text-p m-0 font-weight-bold"
                style={{ right: "0px" }}
            >
                1/3
            </p>
            <p className="text-p font-weight-bold text-normal m-0">
                Insira N.º cartão:
            </p>
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={false}
                name="cardNumber"
                value={cardNumber}
                variant="outlined"
                onKeyPress={(e) =>
                    handleEnterPress(e, () => setCurrComp("fullName"))
                }
                onBlur={null}
                type="tel"
                autoComplete="off"
                fullWidth
                inputProps={{
                    maxLength: 19,
                    style: styles.fieldForm,
                }}
            />
            <NavBtns continueCallback={() => setCurrComp("fullName")} />
        </section>
    );
}
