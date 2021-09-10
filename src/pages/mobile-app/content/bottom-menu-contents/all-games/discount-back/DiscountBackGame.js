import { Fragment, useState, useEffect } from "react";
import useData from "init";
import { Load } from "components/code-splitting/LoadableComp";
import getVar from "init/var";
import CartRace from "./cart-race/CartRace";
import GameCTAs from "../ctas/GameCTAs";

export const AsyncDiscountTicket = Load({
    loader: () =>
        import(
            "./ticket/DiscountTicket" /* webpackChunkName: "discount-ticket-comp-lazy" */
        ),
});

export default function DiscountBackGame({ didUserScroll, needClick }) {
    const [gameData, setGameData] = useState({
        perc: 1,
        targetPoints: "...",
    });
    const { perc, targetPoints } = gameData;
    const { currPoints = 100 } = useData();
    const { adminGame } = useData();

    useSetGameData({ adminGame, setGameData });

    const didBeatGame = targetPoints !== "..." && currPoints >= targetPoints;
    const ticketAmount =
        targetPoints !== "..." ? getAccuMoney(targetPoints, perc) : 0;
    const accuMoney = didBeatGame
        ? ticketAmount
        : getAccuMoney(currPoints, perc);

    const showTicket = () => (
        <Fragment>
            <section className="text-center font-weight-bold text-normal animated fadeInUp">
                A cada <span className="text-title">{targetPoints} PTS,</span>
                <br />
                você ganha:
            </section>
            <AsyncDiscountTicket
                ticketAmount={ticketAmount}
                didBeatGame={didBeatGame}
                perc={perc}
            />
        </Fragment>
    );

    return (
        <section className="text-white text-shadow">
            {didUserScroll && showTicket()}
            <CartRace
                className="mt-5 animated fadeInUp faster"
                accuMoney={accuMoney}
                targetPoints={targetPoints}
                perc={perc}
                currPoints={currPoints}
            />
            {didUserScroll && <GameCTAs needClick={needClick} />}
        </section>
    );
}

// HOOKS
function useSetGameData({ adminGame, setGameData }) {
    useEffect(() => {
        (async () => {
            const cliDataFromClubMaker = await getVar(
                "clientAdminData",
                "pre_register"
            );
            const discountBackClubMaker =
                cliDataFromClubMaker && cliDataFromClubMaker.games.discountBack;
            if (discountBackClubMaker) {
                const thisPerc = discountBackClubMaker.perc;
                const thisTargetPoints = discountBackClubMaker.targetPoints;
                return setGameData({
                    perc: thisPerc,
                    targetPoints: thisTargetPoints,
                });
            }

            return null;
        })();

        const gameDataFromUser =
            adminGame && adminGame.discountBack && adminGame.discountBack;

        if (gameDataFromUser)
            setGameData({
                perc: gameDataFromUser.perc,
                targetPoints: gameDataFromUser.targetPoints,
            });

        // eslint-disable-next-line
    }, [adminGame]);
}
// END HOOKS

// HELPERS
function getAccuMoney(amount, perc) {
    return (perc / 100) * amount;
}
// END HELPERS
