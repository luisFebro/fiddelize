export default function defineCurrChallenge(clientUserData) {
    let challenge = clientUserData && clientUserData.purchaseHistory[0] && clientUserData.purchaseHistory[0].challengeN;
    if(!challenge) return 0;

    return challenge === 1
    ? 1
    : challenge - 1
}