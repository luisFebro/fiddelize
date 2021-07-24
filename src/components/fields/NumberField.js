import { useState, useEffect } from "react";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";
import { convertBrToDollar } from "utils/numbers/convertDotComma";
import Field from "./field/Field";
import { handleOnChange } from "./field/helpers/index";
// import TextField from "@material-ui/core/TextField";

export default function NumberField(props) {
    const types = ["integer", "float"];
    const { type, value, onChangeCallback } = props;

    if (!types.includes(type)) throw new Error(`Invalid type. Only ${types}`);

    const [num, setNum] = useState("0");
    const maskedValue = handleMaskedValue({ type, num });

    useEffect(() => {
        if (num === "0" && value) setNum(value && value.toString());
        const e = {
            target: {
                name: props.name,
                value: convertBrToDollar(maskedValue) || 0,
            },
        };
        if (num !== "0") handleOnChange(e, onChangeCallback);

        // eslint-disable-next-line
    }, [maskedValue, value, num]);

    return <Field {...props} value={maskedValue} onChangeCallback={setNum} />;
}

// HELPERS
function handleMaskedValue({ type, num }) {
    const intCondValue = num && num.toString().replace(/[^\d]+/gi, ""); // to avoid values like 900--
    const isFloat = type === "float";

    if (num === "0") return null;
    return isFloat ? moneyMaskBr(num) : intCondValue;
}
// END HELPERS
