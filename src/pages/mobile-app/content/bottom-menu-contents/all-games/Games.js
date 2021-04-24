import useContext from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Load } from "components/code-splitting/LoadableComp";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
// games
export const AsyncTargetPrizeGame = Load({
    loader: () =>
        import(
            "./target-prize/TargetPrizeGame" /* webpackChunkName: "target-prize-game-comp-lazy" */
        ),
});

export const AsyncDiscountBack = Load({
    loader: () =>
        import(
            "./discount-back/DiscountBack" /* webpackChunkName: "discount-back-game-comp-lazy" */
        ),
});
// end games

export default function Games() {
    const { selectedTxtStyle, currChall, didUserScroll } = useContext();

    // for cli-admin
    // const games = [
    //     {
    //         active: true,
    //         name: "targetPrize"
    //     },
    //     {
    //         active: true,
    //         name: "discountBack",
    //         data: "discountGoal:30.50;discountPerc:5;"
    //     }
    // ];

    // for cli-user
    const games = {
        targetPrize: {
            challN: 6,
        },
        discountBack: {
            challN: 1,
        },
        raffleTicket: {},
    };

    const gameType = "discountBack"; // targetPrize, discountBack, raffleTicket
    const { icon, title, challN } = getGameBrTitle(gameType, games);

    const showTitle = () => (
        <section className="animated fadeIn py-4">
            <h2
                className={`text-subtitle font-weight-bold text-center ${selectedTxtStyle}`}
            >
                {icon}
                {title}
                <br />
                <span className="text-title">n.º {challN || currChall}</span>
            </h2>
        </section>
    );

    if (!gameType)
        return (
            <div className="my-3 text-normal text-center text-white text-shadow">
                ...
            </div>
        );

    return (
        <section>
            {didUserScroll ? showTitle() : <div className="pb-2" />}
            {gameType === "targetPrize" && (
                <AsyncTargetPrizeGame didUserScroll={didUserScroll} />
            )}
            {gameType === "discountBack" && (
                <AsyncDiscountBack didUserScroll={didUserScroll} />
            )}
            {gameType === "raffleTicket" && null}
        </section>
    );
}

// HELPERS
function getGameBrTitle(gameType, games) {
    if (gameType === "targetPrize") {
        return {
            title: "Prêmio Alvo",
            icon: (
                <FontAwesomeIcon
                    icon="gift"
                    className="mr-3"
                    style={{ fontSize: 35 }}
                />
            ),
            challN: games ? games.targetPrize.challN : "...",
        };
    }

    if (gameType === "discountBack") {
        return {
            title: "Desconto Retornado",
            icon: <LoyaltyIcon className="mr-3" style={{ fontSize: 35 }} />,
            challN: games ? games.discountBack.challN : "...",
        };
    }

    if (gameType === "raffleTicket") {
        return {
            title: "Bilhete Premiado",
            icon: null,
            challN: games ? games.raffleTicket.challN : "...",
        };
    }

    return {};
}
// END HELPERS
