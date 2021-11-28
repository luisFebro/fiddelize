import useData, { useBizData } from "init";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CasinoIcon from "@material-ui/icons/Casino";
import PollIcon from "@material-ui/icons/Poll";

export const gameIconsStore = {
    targetPrize: <FontAwesomeIcon style={{ fontSize: 40 }} icon="gift" />,
    discountBack: <LoyaltyIcon style={{ fontSize: 50 }} />,
    raffleTicket: <CasinoIcon style={{ fontSize: 50 }} />,
    topCustomers: <PollIcon style={{ fontSize: 50 }} />,
};

export const gameBrNameStore = {
    targetPrize: "Prêmio Alvo",
    discountBack: "Desconto Retornado",
    topCustomers: "Clientes Tops",
    raffleTicket: "Bilhete Premiado",
};

export const selectBrBenefitType = (game) => {
    if (game === "discountBack") return "vale";
    if (game === "targetPrize") return "prêmio";
    return "benefício";
};

// userGame data example
// const userGamesTest = {
//     targetPrize: {
//         challN: 5,
//     },
//     discountBack: {
//         challN: 3,
//     },
//     raffleTicket: {
//         challN: 1,
//     },
//     topCustomers: {
//         challN: 1,
//     },
// };

export default function GamesBadge({ userGame = {} }) {
    const { adminGame } = useData();
    const { themePColor } = useBizData();

    const { availableGames } = adminGame;
    const gamesCount = availableGames ? availableGames.length : 0;

    const gamesList = [];
    availableGames.forEach((gameName) => {
        const challN =
            userGame[gameName] && userGame[gameName].challN
                ? userGame[gameName].challN
                : 1;

        return gamesList.push({
            gameName,
            challN,
            icon: gameIconsStore[gameName],
        });
    });

    return (
        <section className="games-badge-inside--root container-center">
            <section className="badge d-table shadow-elevation-white text-white text-shadow">
                <div className="d-flex position-relative">
                    {gamesList.map((g) => (
                        <div
                            key={g.gameName}
                            className="core mx-2 badge container-center text-normal font-weight-bold"
                        >
                            {g.icon}
                            {gamesCount === 1 && " Desafio "}n.º {g.challN}
                        </div>
                    ))}
                </div>
            </section>
            <style jsx>
                {`
                    .games-badge-inside--root .badge {
                        background: var(--themePDark--${themePColor});
                        border-radius: 25px;
                        padding: 1px 5px;
                    }

                    .games-badge-inside--root .core svg {
                        margin-right: 0.5rem;
                        font-size: 35px;
                    }
                `}
            </style>
        </section>
    );
}
