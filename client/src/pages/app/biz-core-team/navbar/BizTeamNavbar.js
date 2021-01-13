import React, { useState } from "react";
import "./_BizTeamNavbar.scss";
import Img from "../../../../components/Img";
import ButtonMenu from "../../../../components/buttons/material-ui/button-menu/ButtonMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const isSmall = window.Helper.isSmallScreen();

export default withRouter(BizTeamNavbar);

export const menuIconStyle = {
    fontSize: "30px",
};

function BizTeamNavbar({ history }) {
    const showMoreOptionsBtn = () => {
        const optArray = [
            {
                icon: <FontAwesomeIcon icon="sync-alt" style={menuIconStyle} />,
                text: "trocar app",
                callback: () => history.push("/painel-de-apps"),
            },
            {
                icon: <ExitToAppIcon style={menuIconStyle} />,
                text: "sair",
                callback: () => alert("sair"),
            },
        ];
        return (
            <ButtonMenu
                mainIcon="moreVert"
                optionsArray={optArray}
                whiteRipple
            />
        );
    };

    return (
        <header className="biz-team-navbar--root">
            <Img
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
            {showMoreOptionsBtn()}
        </header>
    );
}
