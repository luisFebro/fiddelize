import React, { useState } from "react";
import "./_BizTeamNavbar.scss";
import Img from "../../../../components/Img";
import ButtonMenu from "../../../../components/buttons/material-ui/button-menu/ButtonMenu";
import SendIcon from "@material-ui/icons/Send";

const isSmall = window.Helper.isSmallScreen();

export default function BizTeamNavbar() {
    const showMoreOptionsBtn = () => {
        const optArray = [
            {
                icon: <SendIcon />,
                text: "trocar conta",
                callback: () => alert("trocar conta"),
            },
            {
                icon: <SendIcon />,
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
