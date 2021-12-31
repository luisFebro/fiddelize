import { Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

export default function CommentField({
    setValue,
    name = "buyReport",
    value,
    rows = 5,
    placeholder = "escreva seu comentário",
    maxLen = 300,
    maxLenColor = "purple",
    maxLenTxtSize = "0-9",
}) {
    const styles = getStyles();

    return (
        <Fragment>
            <TextField
                multiline
                placeholder={placeholder}
                rows={rows}
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                // eslint-disable-next-line
                inputProps={{
                    maxLength: maxLen,
                }}
                name={name}
                value={value}
                onChange={(e) => handleChange(setValue)(e)}
                onBlur={null}
                variant="outlined"
                fullWidth
            />
            <div
                className={`mb-3 position-relative text-${maxLenColor} text-left`}
            >
                <span
                    className={`font-site text-em-${maxLenTxtSize} font-weight-bold`}
                >
                    {value ? value.length : 0}/{maxLen} characteres
                </span>
            </div>
        </Fragment>
    );
}
