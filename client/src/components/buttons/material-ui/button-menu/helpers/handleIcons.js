import React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuIcon from "@material-ui/icons/Menu";

export default function handleIcons(mainIcon) {
    if (mainIcon === "hamburger") {
        return <MenuIcon className="main-options-icon" />;
    }

    if (mainIcon === "moreVert") {
        return <MoreVertIcon className="main-options-icon" />;
    }
}
