import React from "react";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import "./_MenuPopper.scss";
// import ClickAwayListener from "@material-ui/core/ClickAwayListener";

export default function MenuPopper({ open, optionsArray, setOpen, anchorRef }) {
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    // const handleToggle = () => {
    //     setOpen((prevOpen) => !prevOpen);
    // };

    // return focus to the button when we transitioned from !open -> open
    // const prevOpen = React.useRef(open);
    // React.useEffect(() => {
    //   if (prevOpen.current === true && open === false) {
    //     anchorRef.current.focus();
    //   }

    //   prevOpen.current = open;
    // }, [open]);

    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }

    return (
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            keepMounted={false} // if true, after selecting an option inside an app bar, it can cause a defect in the size. Always keep the children in the DOM. This prop can be useful in SEO situation or when you want to maximize the responsiveness of the Popper.
            disablePortal // Disable the portal behavior. The children stay within it's parent DOM hierarchy.
            transition
            style={{
                zIndex: 10000,
            }}
            placement="bottom"
        >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === "bottom"
                                ? "center top"
                                : "center bottom",
                    }}
                >
                    <Paper>
                        <MenuList
                            autoFocusItem={open}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                        >
                            {optionsArray.map((option) => (
                                <MenuItem
                                    key={option.text}
                                    onClick={(e) => {
                                        option.callback();
                                        handleClose(e);
                                    }}
                                >
                                    <ListItemIcon>{option.icon}</ListItemIcon>
                                    <ListItemText primary={option.text} />
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
}

// ARCHIVES
//<ClickAwayListener onClickAway={() => null}> {/*LESSON: disabled temporarily until finding a solution to toggle to close icon without triggering this...*/}
//</ClickAwayListener>
