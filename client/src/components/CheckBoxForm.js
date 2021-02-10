import React, { useState, useEffect, useRef } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import getId from "../utils/getId";

const getStatusWithId = (bool) => `${bool}_${getId()}`;

export default function CheckBoxForm({
    text,
    setIsBoxChecked,
    defaultState = false,
    data = "",
    callback,
    position,
    margin,
    txtFontweight,
    onClick,
    needId = false,
    color,
}) {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (defaultState) setIsChecked(defaultState);
    }, [defaultState]);

    const embededData = useRef(data).current;

    useEffect(() => {
        const thisIsChecked = needId ? getStatusWithId(isChecked) : isChecked;
        setIsBoxChecked && setIsBoxChecked(thisIsChecked, embededData);
        callback && callback();
        // eslint-disable-next-line
    }, [isChecked]);

    const handleChange = (event) => {
        setIsChecked(!isChecked);
    };

    const showText = () => (
        <p
            className={`${
                txtFontweight ? "font-weight-bold" : ""
            } text-small text-purple`}
            style={{ margin: 0 }}
        >
            {text}
        </p>
    );

    return (
        <div
            className={`${
                position ? position : "d-flex justify-content-center"
            }`}
            style={{ width: "100%", margin: margin }}
        >
            <FormControlLabel
                className={position ? "" : "ml-2"}
                control={
                    <Checkbox
                        checked={Boolean(isChecked)}
                        onClick={onClick}
                        onChange={() => handleChange()}
                        color="primary"
                        style={{ color: color ? color : undefined }}
                    />
                }
                label={showText()}
                position="end"
            />
        </div>
    );
}
