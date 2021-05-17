import { useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { handleEnterPress, handleOnChange } from "./helpers/index";
import debounce from "../../../utils/performance/debounce";
import "./_Field.scss";

// Warning: use a <form></form> wrapper to a group or even an individual field.
// TextField is simply rendered as a raw <input /> tag

export default function Field({
    id,
    size = "medium",
    textAlign = "text-left",
    name,
    value,
    // onChange,
    error,
    placeholder,
    autoComplete = "off",
    variant = "outlined",
    enterCallback = () => null,
    onChangeCallback = () => null,
    // backgroundColor = "var(--mainWhite)",
    multiline = false,
    rows = 3,
    fullWidth = true,
    debounceCallback = () => null,
}) {
    const sizes = ["small", "medium", "large"];
    const variants = ["filled", "outlined", "standard"];
    const textAligns = ["text-center", "text-left"];
    if (!sizes.includes(size)) throw new Error("Invalid field size");
    if (!variants.includes(variant)) throw new Error("Invalid variant");
    if (!textAligns.includes(textAlign)) throw new Error("Invalid text align");

    // do not use a () => for debounce. If not function, it will return nothing only.
    const handler = useCallback(debounce(debounceCallback), []);

    return (
        <section className="single-field--root field">
            <TextField
                id={id}
                className={`${size} ${textAlign}`}
                placeholder={placeholder}
                name={name}
                value={value}
                variant={variant}
                onChange={(e) => {
                    handleOnChange(e, onChangeCallback);
                    debounceCallback && handler();
                }}
                onKeyPress={(e) => {
                    handleEnterPress(e, enterCallback);
                }}
                error={error}
                autoComplete={autoComplete}
                multiline={multiline}
                rows={multiline ? rows : undefined}
                fullWidth={fullWidth}
            />
        </section>
    );
}
