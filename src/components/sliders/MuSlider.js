import { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles(() => ({
    // LESSON
    root: {
        color: (props) => props.color || "#52af77",
        width: (props) => props.width || "100%",
        height: 8,
    },
    valueLabel: {
        left: "calc(-50% + 4px)",
        font: (props) => `bold ${props.labelSize || "15px"} var(--mainFont)`,
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundColor: "#fff",
        border: "4px solid currentColor",
        marginTop: -12,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
}));

export default function MuSlider({
    color = "var(--themeP)",
    width,
    defaultValue = 1,
    valueLabelDisplay = "on",
    step = 1,
    callback,
    marks,
    value,
    disabled = false,
    max = 300,
    min = 1,
    needSlideInstru = false,
}) {
    const [labelSize, setLabelSize] = useState(null);
    const classes = useStyles({ color, labelSize, width });

    useEffect(() => {
        if (value >= 1000) {
            setLabelSize("10px");
        } else {
            setLabelSize(null);
        }
    }, [value]);

    const handleChange = (e, newValue) => {
        if (typeof callback === "function") callback(newValue);
    };

    const showSlideInstru = () => (
        <div className="add-credits-slide text-purple font-weight-bold container-center text-small">
            <FontAwesomeIcon className="mr-2" icon="arrow-left" />
            {"  "}
            Deslize para mudar
            {"  "}
            <FontAwesomeIcon className="ml-2" icon="arrow-right" />
        </div>
    );

    return (
        <Fragment>
            <Slider
                aria-label="deslizador"
                onChange={handleChange}
                classes={{
                    root: classes.root,
                    valueLabel: classes.valueLabel,
                    track: classes.track,
                    rail: classes.rail,
                    thumb: classes.thumb,
                }}
                valueLabelDisplay={valueLabelDisplay}
                step={step}
                value={value}
                min={min}
                max={disabled ? 1 : max}
                orientation="horizontal"
                disabled={disabled}
                marks={marks}
            />
            {needSlideInstru && showSlideInstru()}
        </Fragment>
    );
}

/* COMMENTS
n1: LESSON: do not use custom component with onChange in material ui
*/

/*
const marks = [
  {
    value: 1,
    label: '1 Pacote',
  },
  {
    value: 100,
    label: '100 Pacotes',
  },
];
 */
