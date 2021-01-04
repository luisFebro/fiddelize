import React, { useState, useRef } from "react";
import IconButton from "@material-ui/core/IconButton";
import "./_ButtonMenu.scss";
import handleIcons from "./helpers/handleIcons";
import MenuPopper from "./comps/MenuPopper";

export default function ButtonMenu({
    optionsArray = [],
    whiteRipple = false,
    mainIcon = "hamburger",
}) {
    const mainIcons = ["hamburger", "moreVert"];
    if (!mainIcons.includes(mainIcon))
        throw new Error("mainIcon should be: " + mainIcons);

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    return (
        <section className="button-menu--root">
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                ref={anchorRef}
                onClick={handleToggle}
                className={`more-options-btn ${
                    whiteRipple ? "ripple-color-white" : ""
                }`}
            >
                {handleIcons(mainIcon)}
            </IconButton>
            <MenuPopper
                open={open}
                optionsArray={optionsArray}
                setOpen={setOpen}
                anchorRef={anchorRef}
            />
        </section>
    );
}
