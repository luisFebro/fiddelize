function handlePaymentDetails({
    currPayMethod,
    currDetails,
    escrow,
    creditorFees,
}) {
    const isCreditCard = currPayMethod === "cartão crédito";
    let installmentFee = "";
    if (isCreditCard) {
        const [instaFound] = creditorFees.installmentFeeAmount;
        installmentFee = `installmentFee:${instaFound};`;
    }

    let escrowEndDate = "";
    if (escrow) {
        const [escrowFoundDate] = escrow;
        escrowEndDate = `escrowEndDate:${escrowFoundDate};`;
    }

    // RATE X FEE
    // RATE - taxa - (valor fixo) a FIXED price paid or charged for something, especially goods or services.
    // FEE - cota - (valor percentual) a payment made to a professional person or to a professional or public body in exchange for advice or services.
    const [rateAmount] = creditorFees.intermediationRateAmount;
    const [feeAmount] = creditorFees.intermediationFeeAmount;

    return (
        currDetails +
        `rateAmount:${rateAmount};feeAmount:${feeAmount};` +
        escrowEndDate +
        installmentFee
    );
}

module.exports = handlePaymentDetails;
