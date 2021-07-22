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
    const isFloat = type === "float";

    const [float, setFloat] = useState("0");
    const maskedValue = isFloat ? moneyMaskBr(float) : null;

    useEffect(() => {
        if (isFloat && float === "0" && value)
            setFloat(value && value.toString());
        const e = {
            target: {
                name: props.name,
                value: convertBrToDollar(maskedValue) || 0,
            },
        };
        if (isFloat && float !== "0") handleOnChange(e, onChangeCallback);

        // eslint-disable-next-line
    }, [maskedValue, value, float, isFloat]);

    if (isFloat) {
        return (
            <Field {...props} value={maskedValue} onChangeCallback={setFloat} />
        );
    }

    return <Field {...props} type="number" />;
}
