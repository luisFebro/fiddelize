import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const PurpleSwitch = withStyles({
  switchBase: {
    color: purple[300],
    '&$checked': {
      color: purple[500],
    },
    '&$checked + $track': {
      backgroundColor: purple[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

export default function SwitchBtn({
    titleLeft = "Não",
    titleRight = "Sim",
    callback,
}) {
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        const status = event.target.checked;
        setChecked(status);
        if(typeof callback === "function") callback(status);
    };

    const setTrue = () => setChecked(true);
    const setFalse = () => setChecked(false);

    const on = 'm-0 animated rubberBand text-normal text-purple font-weight-bold';
    const off = "m-0 text-normal text-grey";
    const txtStyle1 = checked ? off : on;
    const txtStyle2 = !checked ? off : on;

    return (
        <section className="container-center">
            <p className="m-0 mr-2 d-inline-block text-normal font-weight-bold text-purple">Feito?</p>
            <p className={txtStyle1} onClick={setFalse}>{titleLeft}</p>
            <PurpleSwitch
                checked={checked}
                onChange={handleChange}
                name="purpleSwitch"
            />
            <p className={txtStyle2} onClick={setTrue}>{titleRight}</p>
        </section>
    );
}

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