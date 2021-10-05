import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// material ui
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import setValObjWithStr from "utils/objects/setValObjWithStr";
import generateAlphaNumeric from "utils/string/generateAlphaNumeric";
import RadiusBtn from "../../buttons/RadiusBtn";
// end material ui

ToggleVisibilityPassword.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string,
    showForgotPass: PropTypes.bool,
    showGeneratePass: PropTypes.bool,
    generatePassObj: PropTypes.object,
    label: PropTypes.string,
    error: PropTypes.bool,
};

// this function requires useState in the parent with password, showPassword keys.
export default function ToggleVisibilityPassword({
    label,
    onChange,
    onKeyPress,
    error,
    name,
    value,
    style,
    showForgotPass = false,
    showGeneratePass = false,
    generatePassObj,
    autoFocus = false,
    autoComplete,
    maxWidth,
}) {
    const [data, setData] = useState({
        showPassword: false,
    });
    const { showPassword } = data;

    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Render

    const showForgotPassLink = (showForgotPass) =>
        showForgotPass && (
            <div
                className="mt-2"
                style={{ display: "flex", justifyContent: "flex-end" }}
            >
                <Link to="/cliente/trocar-senha">
                    <Button className="my-2" onClick={null} size="small">
                        Esqueceu sua senha?
                    </Button>
                </Link>
            </div>
        );

    const insertNewPass = () => {
        if (generatePassObj.hasOwnProperty("setObj")) {
            const passValue = generateAlphaNumeric(7, "a#@");
            const { setObj, obj } = generatePassObj;

            setValObjWithStr(obj, name, passValue);
            const newObj = obj;
            setObj({ ...obj, ...newObj });
            setData({ showPassword: true });
        }
    };

    const showGeneratePassBtn = (showGeneratePass) =>
        showGeneratePass && (
            <div
                style={{ display: "flex", justifyContent: "flex-end" }}
                className="mt-2"
            >
                <span className="text-white text-normal mr-2 text-shadow">
                    ou
                </span>
                <RadiusBtn
                    title="gerar uma senha"
                    backgroundColor="var(--themeP)"
                    padding="4px 9px"
                    className="my-2"
                    onClick={() => insertNewPass()}
                />
            </div>
        );

    return (
        <FormControl fullWidth style={{ maxWidth: maxWidth || undefined }}>
            <InputLabel
                htmlFor="adornment-password"
                style={{ color: error ? "red" : "black" }}
            >
                {label || "Inserir senha"}
            </InputLabel>
            <Input
                id="adornment-password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                style={style}
                name={name || "password"}
                margin="dense"
                error={!!error}
                onChange={onChange}
                onKeyPress={onKeyPress}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                value={value}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {showPassword ? (
                                <Visibility fontSize="large" />
                            ) : (
                                <VisibilityOff fontSize="large" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {showForgotPassLink(showForgotPass)}
            {showGeneratePassBtn(showGeneratePass)}
        </FormControl>
    );
}
