import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withRouter } from "react-router-dom";
import Img from "components/Img";
import ButtonMenu from "components/buttons/material-ui/button-menu/ButtonMenu";
import disconnect from "auth/disconnect";
import useData from "init";
import { IS_DEV } from "config/clientUrl";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import "./_BizTeamNavbar.scss";

const AsyncNotifyUsersContent = Load({
    loader: () =>
        import(
            "./notify-users/NotifyUsersContent" /* webpackChunkName: "notify-users-full-page-lazy", webpackMode: "lazy" */
        ),
});

const isSmall = window.Helper.isSmallScreen();

export const menuIconStyle = {
    fontSize: "30px",
};

function BizTeamNavbar({ history }) {
    const [agentJob] = useData(["agentJob"]);
    const [notifyUsers, setNotifyUsers] = useState(false);
    const isDev = IS_DEV || agentJob === "dev";

    const showMoreOptionsBtn = () => {
        const optArray = [
            {
                icon: <FontAwesomeIcon icon="sync-alt" style={menuIconStyle} />,
                text: "trocar app",
                callback: () => history.push("/painel-de-apps"),
            },
            {
                icon: (
                    <FontAwesomeIcon
                        icon="money-bill-alt"
                        style={menuIconStyle}
                    />
                ),
                text: "Salário CEO",
                callback: () =>
                    history.push("/t/app/nucleo-equipe/financeiro/ceo"),
            },
            {
                icon: <FontAwesomeIcon icon="comment" style={menuIconStyle} />,
                text: "Notificar usuários",
                callback: () => {
                    setNotifyUsers(true);
                },
            },
            {
                icon: <ExitToAppIcon style={menuIconStyle} />,
                text: "sair",
                callback: () => {
                    disconnect({ msg: true });
                },
            },
        ];

        if (!isDev) {
            delete optArray[1];
            delete optArray[2];
        }

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
            {notifyUsers && (
                <ModalFullContent
                    contentComp={<AsyncNotifyUsersContent />}
                    fullOpen={notifyUsers}
                    setFullOpen={setNotifyUsers}
                    needIndex={false}
                />
            )}
        </header>
    );
}

export default withRouter(BizTeamNavbar);
