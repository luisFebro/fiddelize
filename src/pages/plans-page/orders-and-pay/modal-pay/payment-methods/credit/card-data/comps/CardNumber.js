import React from "react";
import TextField from "@material-ui/core/TextField";
import NavBtns from "./NavBtns";
import { handleEnterPress } from "../../../../../../../../utils/event/isKeyPressed";
import { getUniqueId } from "../../../../../../../../hooks/api/trigger";
import ShowAvailableCards from "./ShowAvailableCards";

const isSmall = window.Helper.isSmallScreen();

export default function CardNumber({
    styles,
    handleChange,
    setData,
    setCurrComp,
    data,
    cardNumber,
    setWatermark,
    maxCardNumberLength,
    modalData,
}) {
    const getSpaceNum = () => {
        if (maxCardNumberLength === 16) return 3;
        if (maxCardNumberLength === 19) return 4;
    };

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
                onFocus={() => {
                    isSmall && setWatermark(false);
                }}
                onBlur={() => {
                    isSmall && setWatermark(getUniqueId());
                }}
                type="tel"
                autoComplete="off"
                fullWidth
                inputProps={{
                    maxLength: maxCardNumberLength + getSpaceNum() || 23, // 19 characters and up to 4 spaces
                    style: styles.fieldForm,
                }}
            />
            <NavBtns continueCallback={() => setCurrComp("fullName")} />
            <ShowAvailableCards modalData={modalData} />
        </section>
    );
}
