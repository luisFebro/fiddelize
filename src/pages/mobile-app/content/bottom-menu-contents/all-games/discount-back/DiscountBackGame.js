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

    const mainTxt = didBeatGame ? (
        <section className="text-center font-weight-bold text-normal animated fadeInUp">
            Você bateu <span className="text-title">{targetPoints} PTS,</span>
            <br />e ganhou:
        </section>
    ) : (
        <section className="text-center font-weight-bold text-normal animated fadeInUp">
            Acumule <span className="text-title">{targetPoints} PTS,</span>
            <br />e ganhe:
        </section>
    );

    const showTicket = () => (
        <Fragment>
            {mainTxt}
            <AsyncDiscountTicket
                targetPoints={targetPoints}
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
                className="animated fadeInUp faster"
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
    const gameDataFromUser = adminGame && adminGame.discountBack;

    useEffect(() => {
        (async () => {
            const isAppZone = window.location.href.includes("/app");

            const cliDataFromClubMaker = await getVar(
                "clientAdminData",
                "pre_register"
            );
            const discountBackClubMaker =
                cliDataFromClubMaker && cliDataFromClubMaker.games.discountBack;

            if (discountBackClubMaker && !isAppZone) {
                const thisPerc = discountBackClubMaker.perc;
                const thisTargetPoints = discountBackClubMaker.targetPoints;
                return setGameData({
                    perc: thisPerc,
                    targetPoints: thisTargetPoints,
                });
            }

            return null;
        })();

        if (gameDataFromUser)
            setGameData({
                perc: gameDataFromUser.perc,
                targetPoints: gameDataFromUser.targetPoints,
            });

        // eslint-disable-next-line
    }, []);
}
// END HOOKS

// HELPERS
function getAccuMoney(amount, perc) {
    return (perc / 100) * amount;
}
// END HELPERS

/*

const accuMoney = didBeatGame
    ? ticketAmount
    : getAccuMoney(currPoints, perc);

 */
