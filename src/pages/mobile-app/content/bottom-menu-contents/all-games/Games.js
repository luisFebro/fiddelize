import useContext from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Load } from "components/code-splitting/LoadableComp";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import useData from "init";
import CasinoIcon from "@material-ui/icons/Casino";
import PollIcon from "@material-ui/icons/Poll";

// games
export const AsyncTargetPrizeGame = Load({
    loader: () =>
        import(
            "./target-prize/TargetPrizeGame" /* webpackChunkName: "target-prize-game-comp-lazy" */
        ),
});

export const AsyncDiscountBackGame = Load({
    loader: () =>
        import(
            "./discount-back/DiscountBackGame" /* webpackChunkName: "discount-back-game-comp-lazy" */
        ),
});
// end games

export default function Games() {
    const {
        didUserScroll,
        isPreviewMode = false,
        gameClubPreview,
        currGame: game,
    } = useContext();
    const currGame = handleCurrGame({ isPreviewMode, game, gameClubPreview });

    const { userGame } = useData();
    const pointGames = ["targetPrize", "discountBack"];
    const arePointGames = pointGames.includes(currGame);

    const { icon, nameBr } = getGameData(currGame, userGame);
    let { challN = 1 } = getGameData(currGame, userGame);
    challN = isPreviewMode ? 1 : challN;

    if ((!userGame && !isPreviewMode) || !arePointGames)
        return (
            <p className="text-center py-5 text-subtitle text-shadow text-white">
                Nunhum jogo com pontos ativado.
            </p>
        );

    const showTitle = () => (
        <section className="animated fadeIn py-4">
            <h2 className="text-subtitle font-weight-bold text-center text-white text-shadow">
                {icon}
                {nameBr}
                <span className="position-relative d-block text-title">
                    n.º {challN}
                </span>
            </h2>
        </section>
    );

    return (
        <section>
            {didUserScroll ? showTitle() : <div className="pb-2" />}
            {currGame === "targetPrize" && (
                <AsyncTargetPrizeGame didUserScroll={didUserScroll} />
            )}
            {currGame === "discountBack" && (
                <AsyncDiscountBackGame
                    didUserScroll={didUserScroll}
                    needClick={!isPreviewMode}
                />
            )}
            {currGame === "topCustomers" && null}
            {currGame === "raffleTicket" && null}
        </section>
    );
}

// HELPERS
function handleCurrGame({ game, isPreviewMode, gameClubPreview }) {
    if (gameClubPreview) return gameClubPreview;
    if (isPreviewMode) return "discountBack";
    return game;
}

function getGameData(currGame, games) {
    if (currGame === "targetPrize") {
        return {
            nameBr: "Prêmio Alvo",
            icon: (
                <FontAwesomeIcon
                    icon="gift"
                    className="mr-2"
                    style={{ fontSize: 45 }}
                />
            ),
            challN: games ? games.targetPrize.challN : "...",
        };
    }

    if (currGame === "discountBack") {
        return {
            nameBr: "Desconto Retornado",
            icon: <LoyaltyIcon className="mr-2" style={{ fontSize: 45 }} />,
            challN: games ? games.discountBack.challN : "...",
        };
    }

    if (currGame === "raffleTicket") {
        return {
            nameBr: "Bilhete Premiado",
            icon: <CasinoIcon className="mr-2" style={{ fontSize: 45 }} />,
            challN: games ? games.raffleTicket.challN : "...",
        };
    }

    if (currGame === "topCustomers") {
        return {
            nameBr: "Clientes Tops",
            icon: <PollIcon className="mr-2" style={{ fontSize: 45 }} />,
            challN: games ? games.raffleTicket.challN : "...",
        };
    }

    return {};
}
// END HELPERS
