import { useState } from "react";
import useContext from "context";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import InstructionBtn from "components/buttons/InstructionBtn";
import { updateUser } from "api/frequent";
import useData, { useBizData } from "init";
import getGameCardData from "pages/dashboard-client-admin/dash-app/buy-games/buy-games-card/getGameCardData";
import "pages/dashboard-client-admin/dash-app/buy-games/buy-games-card/_Card.scss";

const isSmall = window.Helper.isSmallScreen();

export default function GameCard({ data, closeModal }) {
    const [loading, setLoading] = useState(false);
    const { userId, adminGame, role } = useData();
    const { perc } = adminGame.discountBack;
    const { setCurrGame, currGame } = useContext();
    const { themeBackColor, themePColor, themeSColor, bizName } = useBizData();
    const { gameName, on } = data;
    const isAdminPanel = role === "cliente-admin";

    const isCurrGame = gameName === currGame;
    const isDisabled = !on;

    const { nameBr, icon, concept } = getGameCardData({
        gameName,
        isDisabled,
        bizName,
        discountPerc: perc,
    });

    const showCTA = () => (
        <ButtonFab
            title={loading ? "iniciando..." : "acessar"}
            variant="extended"
            size="small"
            position="relative"
            backgroundColor={`var(--themeS--${themeSColor})`}
            onClick={async () => {
                setLoading(true);
                await updateUser(userId, "cliente", {
                    "clientUserData.games.currGame": gameName,
                });
                setCurrGame(gameName);
                closeModal();
                setLoading(false);
            }}
        />
    );

    const showDisabledBadge = () => (
        <section className="deactivated-badge text-pill text-small font-weight-bold">
            desativado
            <style jsx>
                {`
                    .deactivated-badge {
                        background: grey;
                        padding: 5px 10px;
                    }
                `}
            </style>
        </section>
    );

    const showCurrGameBadge = () => (
        <p className="default-game-badge animated fadeInUp delay-1s">
            JOGO ATUAL <DoneOutlineIcon />
            <style jsx>
                {`
                    .default-game-badge {
                        position: absolute;
                        top: -5px;
                        left: -5px;
                        padding: 2px 10px;
                        color: var(--themeSLight);
                        font: bold 0.7rem var(--mainFont), sans-serif;
                        background: var(--themeP);
                        border-radius: 30px;
                        white-space: nowrap !important;
                    }
                `}
            </style>
        </p>
    );

    const showFooter = () => (
        <section className="card-footer">
            {isCurrGame && showCurrGameBadge()}
            <p
                className="desc font-weight-bold"
                style={{
                    color: isDisabled
                        ? "#808080cf"
                        : `var(--themeSDark--${themePColor})`,
                }}
            >
                {nameBr}
            </p>
            <div className="container-center">
                {isDisabled ? showDisabledBadge() : showCTA()}
            </div>
        </section>
    );

    const showAboutBtn = () => {
        const text = `
            <p class="text-center">${nameBr && nameBr.toUpperCase()}</p>
            ${concept}
            <br />
            <br />
            STATUS: disponível.
        `;
        if (isDisabled) return null;

        return (
            <InstructionBtn
                mode="tooltip"
                text={text}
                tooltipProps={{ disablePortal: true }}
            />
        );
    };

    return (
        <main
            className="col-6 mx-auto mb-4" // not using  col-md-4  col-lg-3 since it is in a modal, only 2 columns of 6 / 6 from 12
        >
            <section
                className="position-relative shadow-babadoo card--root"
                style={{
                    margin: !isSmall && isAdminPanel ? "0 130px" : undefined,
                }}
            >
                <div className="about-btn position-absolute">
                    {showAboutBtn()}
                </div>
                <div
                    className="img-container p-4 p-sm-3"
                    style={{
                        background: `var(--themeSLight--${themeBackColor})`,
                    }}
                >
                    {icon}
                </div>
                {showFooter()}
                <style jsx>
                    {`
                        .about-btn {
                            top: -15px;
                            right: -10px;
                        }
                    `}
                </style>
            </section>
        </main>
    );
}
// END HELPERS
