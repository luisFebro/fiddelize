import React from "react";
import "./_BizTeamNavbar.scss";
import Img from "../../../../components/Img";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const isSmall = window.Helper.isSmallScreen();

const muIcon = {
    position: "absolute",
    fontSize: "45px",
    selfAlign: "flexEnd",
    top: "5px",
    right: "10px",
};

export default function BizTeamNavbar() {
    return (
        <header className="biz-team-navbar--root">
            <Img
                className="animated zoomIn slow"
                style={{
                    position: "absolute",
                    top: "3px",
                    left: isSmall ? "10px" : "20px",
                }}
                width={180}
                height={80}
                src="/img/official-logo-name-biz-team.png"
                alt="logo equipe"
            />
            <MoreVertIcon style={muIcon} />
        </header>
    );
}
