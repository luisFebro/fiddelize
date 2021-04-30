import { useState, useRef } from "react";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import parse from "html-react-parser";
import getId from "../../../utils/getId";
import { useBizData } from "init";

export { treatBoolStatus } from "../../../hooks/api/trigger";

const getStyles = ({ pillStyle, pillBack }) => ({
    pill: pillStyle
        ? {
              background: pillBack || "rgb(202, 211, 200, .4)",
              padding: "5px 8px",
              borderRadius: "30px",
          }
        : undefined,
});

const useStyles = makeStyles((theme) => ({
    switchBase: {
        color: (props) => props.darkColor || purple[300],
        "&$checked": {
            color: (props) => props.lightColor || purple[500],
        },
        "&$checked + $track": {
            backgroundColor: (props) => props.lightColor || purple[500],
        },
    },
    checked: {
        color: (props) => props.lightColor || purple[500],
    },
    track: {
        backgroundColor: (props) => props.darkColor || purple[300],
    },
}));

const getStatusWithId = (bool) => `${bool}_${getId()}`;

export default function SwitchBtn({
    titleLeft = "Não",
    titleRight = "Sim",
    titleQuestion = "",
    callback,
    defaultStatus = false,
    disabled = false,
    data = "",
    pillStyle = false,
    pillBack,
    customColor,
    animationOn = true,
    needCustomColor = false,
    // loading = false,
}) {
    const [checked, setChecked] = useState(defaultStatus);

    const switchData = useRef(data);

    const { selfThemeSColor: sColor } = useBizData();

    const styles = getStyles({ pillStyle, pillBack });
    const classes = useStyles({
        darkColor: needCustomColor ? `var(--themeSDark--${sColor})` : undefined,
        lightColor: needCustomColor
            ? `var(--themeSLight--${sColor})`
            : undefined,
    });

    const handleChange = (event) => {
        const status = event.target.checked;
        const statusId = getStatusWithId(status);

        setChecked(status);
        if (typeof callback === "function")
            callback(statusId, switchData.current);
    };

    const setTrue = () => {
        setChecked(true);
        if (typeof callback === "function")
            callback(getStatusWithId(true), switchData.current);
    };

    const setFalse = () => {
        setChecked(false);
        if (typeof callback === "function")
            callback(getStatusWithId(false), switchData.current);
    };

    const on = `m-0 ${animationOn ? "animated rubberBand" : ""} text-normal ${
        customColor || "text-purple font-weight-bold"
    }`;
    const off = `m-0 text-normal ${customColor || "text-grey"}`;
    const txtStyle1 = checked ? off : on;
    const txtStyle2 = !checked ? off : on;

    titleLeft = parse(titleLeft);
    titleRight = parse(titleRight);
    return (
        <section className="d-flex justify-content-center" style={styles.pill}>
            <p className="m-0 mr-2 d-inline-block text-normal font-weight-bold text-purple">
                {titleQuestion}
            </p>
            <p className={txtStyle1} onClick={setFalse}>
                {titleLeft}
            </p>
            <Switch
                classes={{
                    switchBase: classes.switchBase,
                    checked: classes.checked,
                    track: classes.track,
                }}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
            />
            <p className={txtStyle2} onClick={setTrue}>
                {titleRight}
            </p>
        </section>
    );
}

/* ARCHIVES

const PurpleSwitch = withStyles({
    switchBase: {
        color: purple[300],
        "&$checked": {
            color: purple[500],
        },
        "&$checked + $track": {
            backgroundColor: purple[500],
        },
    },
    checked: {},
    track: {},
})(Switch);

*/

/*
// const IOSSwitch = withStyles((theme) => ({
//   root: {
//     width: 42,
//     height: 26,
//     padding: 0,
//     margin: theme.spacing(1),
//   },
//   switchBase: {
//     padding: 1,
//     '&$checked': {
//       transform: 'translateX(16px)',
//       color: theme.palette.common.white,
//       '& + $track': {
//         backgroundColor: '#52d869',
//         opacity: 1,
//         border: 'none',
//       },
//     },
//     '&$focusVisible $thumb': {
//       color: '#52d869',
//       border: '6px solid #fff',
//     },
//   },
//   thumb: {
//     width: 24,
//     height: 24,
//   },
//   track: {
//     borderRadius: 26 / 2,
//     border: `1px solid ${theme.palette.grey[400]}`,
//     backgroundColor: theme.palette.grey[50],
//     opacity: 1,
//     transition: theme.transitions.create(['background-color', 'border']),
//   },
//   checked: {},
//   focusVisible: {},
// }))(({ classes, ...props }) => {
//   return (
//     <Switch
//       focusVisibleClassName={classes.focusVisible}
//       disableRipple
//       classes={{
//         root: classes.root,
//         switchBase: classes.switchBase,
//         thumb: classes.thumb,
//         track: classes.track,
//         checked: classes.checked,
//       }}
//       {...props}
//     />
//   );
// });
 */
