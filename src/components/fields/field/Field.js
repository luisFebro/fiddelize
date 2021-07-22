import { useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import debounce from "utils/performance/debounce";
import { handleEnterPress, handleOnChange } from "./helpers/index";

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
    width,
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
        <section className={`single-field--root field width${width}`}>
            <TextField
                id={id}
                className={`${size} ${textAlign}`}
                placeholder={placeholder}
                name={name}
                value={value}
                variant={variant}
                onChange={(e) => {
                    handleOnChange(e, onChangeCallback);
                    if (debounceCallback) handler();
                }}
                onKeyPress={(e) => {
                    handleEnterPress(e, enterCallback);
                }}
                error={error}
                autoComplete={autoComplete}
                multiline={multiline}
                rows={multiline ? rows : undefined}
                fullWidth={width ? false : fullWidth}
            />
            <style jsx>
                {`
                    .single-field--root.field.width${width}
                        .MuiFormControl-root {
                        width: ${width ? `${width}px` : "none"};
                    }
                `}
            </style>
            <style jsx>
                {`
                    .single-field--root.field .MuiInputBase-input {
                        background-color: #fff !important;
                        z-index: 2000;
                        color: var(--themeP) !important;
                        font: var(--mainFont);
                        padding: 10px;
                    }

                    .single-field--root.field .large {
                        margin: 0 5px !important;
                    }

                    .single-field--root.field .large div .MuiInputBase-input {
                        font-size: 2.5em;
                    }

                    .single-field--root.field
                        .large
                        div
                        .MuiInputBase-input
                        .MuiOutlinedInput-input {
                        padding: 10.5px 14px;
                    }

                    .single-field--root.field .medium div .MuiInputBase-input {
                        font-size: 1.5em;
                    }

                    .single-field--root.field .small div .MuiInputBase-input {
                        font-size: 1em;
                    }

                    .single-field--root.field
                        .text-left
                        div
                        .MuiInputBase-input {
                        text-align: left !important;
                    }

                    .single-field--root.field
                        .text-center
                        div
                        .MuiInputBase-input {
                        text-align: center !important;
                    }
                `}
            </style>
        </section>
    );
}
