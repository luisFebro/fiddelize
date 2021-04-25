import useContext from "context";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import Tooltip from "components/tooltips/Tooltip";
import "./_GameCard.scss";

export default function GameCard({
    isDisabled = false,
    isCurrGame = false,
    data,
    setMainData,
}) {
    const { colorBack, colorP, colorS, bizName } = useContext();

    const { name } = data;

    const { nameBr, icon, concept } = getGameCardData({
        gameName: name,
        isDisabled,
        bizName,
    });

    const showCTA = (gameName) => (
        <ButtonFab
            title="acessar"
            variant="extended"
            size="small"
            position="relative"
            backgroundColor={`var(--themeS--${colorS})`}
            onClick={() => {
                setMainData({
                    currGame: gameName,
                });
            }}
        />
    );

    const showDisabledBadge = () => (
        <section
            className="my-3 text-pill text-small font-weight-bold"
            style={{
                background: "grey",
            }}
        >
            desativado
        </section>
    );

    const showCurrGameBadge = () => (
        <p className="default-game-badge">
            JOGO ATUAL <DoneOutlineIcon />
        </p>
    );

    const showFooter = () => (
        <section className="card-footer">
            <p
                className="desc font-weight-bold"
                style={{
                    color: isDisabled
                        ? "#808080cf"
                        : `var(--themeSDark--${colorP})`,
                }}
            >
                {nameBr}
            </p>
            {isCurrGame && showCurrGameBadge()}
            <div className="container-center">
                {isDisabled ? showDisabledBadge() : showCTA(name)}
            </div>
        </section>
    );

    const coreCard = (
        <section className="shadow-babadoo bank-card--root">
            <div
                className="img-container p-4 p-sm-3"
                style={{
                    background: `var(--themeSLight--${colorBack})`,
                }}
            >
                {icon}
            </div>
            {showFooter()}
        </section>
    );

    return (
        <section
            className="col-6 mx-auto mb-4" // not using  col-md-4  col-lg-3 since it is in a modal, only 2 columns of 6 / 6 from 12
        >
            <Tooltip
                disabled={isDisabled}
                padding="10px"
                whiteSpace
                width={325}
                needArrow
                text={`
                    <p class="text-center">${nameBr && nameBr.toUpperCase()}</p>
                    ${concept}
                    <br />
                    <br />
                    STATUS: disponível.
                `}
                element={coreCard}
                backgroundColor={`var(--themeS--${colorS})`}
                colorS={colorS}
            />
        </section>
    );
}

// HELPERS
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
