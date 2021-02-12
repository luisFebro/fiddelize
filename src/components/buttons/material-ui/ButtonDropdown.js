import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import PropTypes from "prop-types";

ButtonDropdown.propTypes = {
    button: PropTypes.shape({}),
    dropdown: PropTypes.shape({
        titleOptions: PropTypes.array.isRequired,
    }),
};

export default function ButtonDropdown({ button, dropdown, onSelectedValue }) {
    const { titleOptions } = dropdown;

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleMenuItemClick = (event, index) => {
        onSelectedValue(titleOptions[index]);
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    ref={anchorRef}
                    aria-label="split button"
                >
                    <Button
                        color="primary"
                        size="large"
                        aria-controls={open ? "split-button-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-label="selecione botão"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                    <Button>
                        <span
                            style={{
                                color: "white",
                                textShadow: "1px 1px 3px black",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {titleOptions[selectedIndex]}
                        </span>
                    </Button>
                </ButtonGroup>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    style={{
                        zIndex: 1000,
                    }}
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
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {titleOptions.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={
                                                    index === selectedIndex
                                                }
                                                onClick={(event) =>
                                                    handleMenuItemClick(
                                                        event,
                                                        index
                                                    )
                                                }
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
    );
}
