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
    value,
    placeholder = "escreva seu comentário",
    maxLen = 300,
}) {
    const styles = getStyles();

    return (
        <Fragment>
            <TextField
                multiline
                placeholder={placeholder}
                rows={5}
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                // eslint-disable-next-line
                inputProps={{
                    maxLength: maxLen,
                }}
                name="buyReport"
                value={value}
                onChange={(e) => handleChange(setValue)(e)}
                onBlur={null}
                variant="outlined"
                fullWidth
            />
            <div className="mb-3 position-relative text-purple text-left">
                <span className="font-site text-em-0-9 font-weight-bold">
                    {value ? value.length : 0}/{maxLen} characteres
                </span>
            </div>
        </Fragment>
    );
}
