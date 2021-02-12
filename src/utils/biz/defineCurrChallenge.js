
export default function defineCurrChallenge(totalPurchasePrize) {
    return !totalPurchasePrize ? 1 : totalPurchasePrize + 1;
}