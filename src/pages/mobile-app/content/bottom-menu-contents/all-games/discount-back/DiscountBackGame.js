import { Fragment } from "react";
import useData, { useBizData } from "init";
import { Load } from "components/code-splitting/LoadableComp";
import GamesGalleryBtn from "../games-gallery-btn/GamesGalleryBtn";
import CartRace from "./cart-race/CartRace";

export const AsyncDiscountTicket = Load({
    loader: () =>
        import(
            "./ticket/DiscountTicket" /* webpackChunkName: "discount-ticket-comp-lazy" */
        ),
});

export default function DiscountBackGame({ didUserScroll }) {
    const { themeSColor: colorS, themeBackColor: colorBack } = useBizData();
    const { adminGame, currPoints } = useData();

    const { targetPoints, perc } = adminGame.discountBack;
    const didBeatGame = currPoints >= targetPoints;
    const accuMoney = getAccuMoney(currPoints, perc);
    const ticketAmount = didBeatGame
        ? accuMoney
        : getAccuMoney(targetPoints, perc);

    const showTicket = () => (
        <Fragment>
            {didBeatGame ? (
                <section className="text-center font-weight-bold text-normal animated fadeInUp">
                    Com seu saldo de{" "}
                    <span className="text-title">{currPoints} pts,</span>
                    <br />
                    você ganha:
                </section>
            ) : (
                <section className="text-center font-weight-bold text-normal animated fadeInUp">
                    A cada{" "}
                    <span className="text-title">{targetPoints} pts,</span>
                    <br />
                    você ganha:
                </section>
            )}
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
            {didUserScroll && (
                <Fragment>
                    <section className="my-5 container-center">
                        <GamesGalleryBtn
                            colorS={colorS}
                            colorBack={colorBack}
                        />
                    </section>
                </Fragment>
            )}
        </section>
    );
}

// HELPERS
function getAccuMoney(amount, perc) {
    return (perc / 100) * amount;
}
// END HELPERS
