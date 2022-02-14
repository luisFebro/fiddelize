import { useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import BuyGamesList from "./BuyGamesList";

export const AsyncTargetPrizeOptions = Load({
    loader: () =>
        import(
            "./target-prize/TargetPrizeOptions" /* webpackChunkName: "target-prize-comp-lazy" */
        ),
});

export const AsyncDiscountBackOptions = Load({
    loader: () =>
        import(
            "./discount-back/DiscountBackOptions" /* webpackChunkName: "discount-back-comp-lazy" */
        ),
});

export const AsyncBalloonPopOptions = Load({
    loader: () =>
        import(
            "./balloon-pop/BalloonPopOptions" /* webpackChunkName: "balloon-pop-comp-lazy" */
        ),
});

export default function MainBuyGames({ isDigitalMenu = false }) {
    const [comp, setComp] = useState({
        name: "",
        props: {},
    });
    const { name, props } = comp;

    return (
        <section>
            {!name && (
                <BuyGamesList
                    isDigitalMenu={isDigitalMenu}
                    setComp={setComp}
                    {...props}
                />
            )}
            {name === "targetPrize" && (
                <AsyncTargetPrizeOptions setComp={setComp} {...props} />
            )}
            {name === "discountBack" && (
                <AsyncDiscountBackOptions setComp={setComp} {...props} />
            )}
            {name === "balloonPop" && (
                <AsyncBalloonPopOptions setComp={setComp} {...props} />
            )}
        </section>
    );
}
