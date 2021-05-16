import { Fragment } from "react";
import useData, { useBizData } from "init";
import GamesGalleryBtn from "../games-gallery-btn/GamesGalleryBtn";
import CartRace from "./cart-race/CartRace";
import { Load } from "components/code-splitting/LoadableComp";

export const AsyncDiscountTicket = Load({
    loader: () =>
        import(
            "./ticket/DiscountTicket" /* webpackChunkName: "discount-ticket-comp-lazy" */
        ),
});

export default function DiscountBackGame({ didUserScroll }) {
    const { adminGame } = useData();
    const { themeSColor: colorS, themeBackColor: colorBack } = useBizData();
    const { targetPoints, perc } = adminGame.discountBack;

    const showTicket = () => (
        <Fragment>
            <section className="text-center font-weight-bold text-normal animated fadeInUp">
                A cada <span className="text-title">{targetPoints} pts,</span>
                <br />
                você ganha:
            </section>
            <AsyncDiscountTicket eachBuyPerc={perc} />
        </Fragment>
    );

    return (
        <section className="text-white text-shadow">
            {didUserScroll && showTicket()}
            <CartRace className="mt-5 animated fadeInUp faster" />
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
