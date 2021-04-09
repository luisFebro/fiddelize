import { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import handleChange from "../../utils/form/use-state/handleChange";

/* EXAMPLES
title = "selecione valor:"
valuesArray = [
    { val:"optionA", showVal: "opção A" },
    { val:"optionB", showVal: "opção B" },
]

 */
export default function SelectField({
    title = "",
    valuesArray,
    rootClassName,
    handleValue,
}) {
    const [data, setData] = useState({
        selected: "",
    });
    const { selected } = data;

    useEffect(() => {
        setData({ ...data, selected: title });
    }, [title]);

    useEffect(() => {
        if (typeof handleValue === "function") handleValue(selected);
        // eslint-disable-next-line
    }, [selected]);

    return (
        <section className={rootClassName || "my-3 container-center"}>
            <Select
                margin="dense"
                onChange={handleChange(setData, data)}
                name="selected"
                value={selected}
                variant="outlined"
                error={false}
                style={{ backgroundColor: "#fff" }}
            >
                <MenuItem value={selected}>
                    <span
                        className="text-p text-normal"
                        style={{
                            fontSize: "1.2em",
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        {title}
                    </span>
                </MenuItem>
                {valuesArray &&
                    valuesArray.map((elem, ind) => {
                        return (
                            <MenuItem key={ind} value={elem.val}>
                                {elem.showVal}
                            </MenuItem>
                        );
                    })}
            </Select>
        </section>
    );
}
