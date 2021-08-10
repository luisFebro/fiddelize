import { Fragment } from "react";
import useData from "init";
import { Load } from "components/code-splitting/LoadableComp";
import CartRace from "./cart-race/CartRace";
import GameCTAs from "../ctas/GameCTAs";

export const AsyncDiscountTicket = Load({
    loader: () =>
        import(
            "./ticket/DiscountTicket" /* webpackChunkName: "discount-ticket-comp-lazy" */
        ),
});

export default function DiscountBackGame({ didUserScroll, needClick }) {
    const { currPoints } = useData();
    let { adminGame } = useData();
    adminGame = adminGame || { discountBack: { perc: 10, targetPoints: 300 } };

    const { perc, targetPoints } = adminGame.discountBack;
    const didBeatGame = currPoints >= targetPoints;
    const ticketAmount = getAccuMoney(targetPoints, perc);
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
            />
            {didUserScroll && <GameCTAs needClick={needClick} />}
        </section>
    );
}

// HELPERS
function getAccuMoney(amount, perc) {
    return (perc / 100) * amount;
}
// END HELPERS
