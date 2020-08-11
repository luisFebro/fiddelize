import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(() => ({ // LESSON
    root: {
      color: props => props.color || '#52af77',
      height: 8,
    },
    valueLabel: {
      left: 'calc(-50% + 4px)',
      font: props => `bold ${props.labelSize || "17px"} var(--mainFont)`,
    },
    thumb: {
      height: 28,
      width: 28,
      backgroundColor: '#fff',
      border: '4px solid currentColor',
      marginTop: -12,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
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
    defaultValue = 1,
    valueLabelDisplay = "on",
    step = 1,
    callback,
    value,
    disabled = false,
    max = 300,
}) {
    const [labelSize, setLabelSize] = useState(null);
    const classes = useStyles({ color, labelSize });

    useEffect(() => {
        if(value === 1000) {
            setLabelSize("13px")
        } else {
            setLabelSize(null)
        }
    }, [value])

    const handleChange = (e, newValue) => {
        if(typeof callback === "function") callback(newValue);
    }

    return (
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
            min={1}
            max={disabled ? 1 : max}
            orientation="horizontal"
            disabled={disabled}
        />
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