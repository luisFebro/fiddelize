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

export default function MainBuyGames() {
    const [comp, setComp] = useState(null);

    return (
        <section>
            {!comp && <BuyGamesList setComp={setComp} />}
            {comp === "targetPrize" && (
                <AsyncTargetPrizeOptions setComp={setComp} />
            )}
            {comp === "discountBack" && (
                <AsyncDiscountBackOptions setComp={setComp} />
            )}
        </section>
    );
}
