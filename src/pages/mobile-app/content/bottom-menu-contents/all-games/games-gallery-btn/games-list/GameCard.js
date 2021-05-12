import { useState } from "react";
import useContext from "context";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import InstructionBtn from "components/buttons/InstructionBtn";
import { updateUser } from "api/frequent";
import useData, { useBizData } from "init";
import "./_GameCard.scss";

export default function GameCard({ data, closeModal }) {
    const [loading, setLoading] = useState(false);
    const { userId } = useData();
    const { setCurrGame, currGame } = useContext();
    const { themeBackColor, themePColor, themeSColor, bizName } = useBizData();
    const { gameName, on } = data;

    const isCurrGame = gameName === currGame;
    const isDisabled = !on;

    const { nameBr, icon, concept } = getGameCardData({
        gameName,
        isDisabled,
        bizName,
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
            <InstructionBtn mode="tooltip" text={text} tooltipProps={null} />
        );
    };

    return (
        <main
            className="col-6 mx-auto mb-4" // not using  col-md-4  col-lg-3 since it is in a modal, only 2 columns of 6 / 6 from 12
        >
            <section className="position-relative shadow-babadoo bank-card--root">
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

function getGameCardData({ gameName, isDisabled, bizName }) {
    if (gameName === "targetPrize") {
        return {
            nameBr: "Prêmio Alvo",
            concept: `Acumule pontos e troque por um prêmio da ${
                bizName && bizName.toUpperCase()
            } ao completar uma meta em pontos`,
            icon: (
                <FontAwesomeIcon
                    icon="gift"
                    style={{
                        height: "100%",
                        width: "100%",
                        color: isDisabled ? "#cad3c87d" : "#ff0",
                    }}
                />
            ),
        };
    }
    if (gameName === "discountBack") {
        return {
            nameBr: "Desconto Retornado",
            concept:
                "Seu dinheiro é retornado em forma de 5% de desconto acumulado em cada compra. Seus pontos são convertidos em um cupom de desconto ao alcançar a meta de resgate em pontos.",
            icon: (
                <LoyaltyIcon
                    style={{
                        height: "100%",
                        width: "100%",
                        color: isDisabled ? "#cad3c87d" : "#ff0",
                    }}
                />
            ),
        };
    }
    if (gameName === "raffleTicket") return {};

    return {};
}
// END HELPERS
