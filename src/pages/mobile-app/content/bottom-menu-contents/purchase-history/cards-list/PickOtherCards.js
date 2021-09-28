import { Load } from "components/code-splitting/LoadableComp";

export const AsyncInOutCard = Load({
    loader: () =>
        import(
            "./card-types/InOutCard" /* webpackChunkName: "in-out-card-lazy" */
        ),
});

export const AsyncTargetPrizeCard = Load({
    loader: () =>
        import(
            "./card-types/TargetPrizeCard" /* webpackChunkName: "target-prize-card-lazy" */
        ),
});

export const AsyncDiscountBackCard = Load({
    loader: () =>
        import(
            "./card-types/DiscountBackCard" /* webpackChunkName: "discount-back-card-lazy" */
        ),
});

export default function PickOtherCards({ historyData, colorP }) {
    const { gameType, cardType } = historyData;
    if (cardType === "in" || cardType === "out" || cardType === "expired")
        return <AsyncInOutCard historyData={historyData} colorP={colorP} />;
    if (cardType === "benefit" && gameType === "targetPrize")
        return (
            <AsyncTargetPrizeCard historyData={historyData} colorP={colorP} />
        );
    if (cardType === "benefit" && gameType === "discountBack")
        return (
            <AsyncDiscountBackCard historyData={historyData} colorP={colorP} />
        );
}
