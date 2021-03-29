import "./_BizTeamNavbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withRouter } from "react-router-dom";
import Img from "../../../../components/Img";
import ButtonMenu from "../../../../components/buttons/material-ui/button-menu/ButtonMenu";
import { disconnect } from "../../../../hooks/useAuthUser";
import useData from "../../../../hooks/useData";

const isSmall = window.Helper.isSmallScreen();

export const menuIconStyle = {
    fontSize: "30px",
};

function BizTeamNavbar({ history }) {
    const [agentJob] = useData(["agentJob"]);
    const isDev = agentJob === "dev";

    const showMoreOptionsBtn = () => {
        let optArray = [
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
                icon: <ExitToAppIcon style={menuIconStyle} />,
                text: "sair",
                callback: () => {
                    (async () => {
                        await disconnect();
                    })();
                },
            },
        ];

        if (!isDev) {
            delete optArray[1];
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
        </header>
    );
}

export default withRouter(BizTeamNavbar);
