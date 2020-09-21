function getCompoundInterest(
    total = 100,
    totalInstallments = 2,
    monthlyRate = 0.0299
) {
    const installmentAmount = total / totalInstallments;
    const rateBase = 1 + monthlyRate;

    let presentValueTransaction = 0;
    let period = 1;
    for (period; period <= totalInstallments; period++) {
        presentValueTransaction += installmentAmount / rateBase ** period;
    }
    const finalRate = total - presentValueTransaction;
    return Number(finalRate.toFixed(2));
}

// according to PagSeguro Simulator: https://pagseguro.uol.com.br/installment/simulation.jhtml
const getFactor = (totalInst) => {
    if (totalInst === 1) return 1;
    if (totalInst === 2) return 1.0451;
    if (totalInst === 3) return 1.0604;
    if (totalInst === 4) return 1.0759;
    if (totalInst === 5) return 1.1072;
    if (totalInst === 6) return 1.1231;
    if (totalInst === 7) return 1.1231;
    if (totalInst === 8) return 1.1392;
    if (totalInst === 9) return 1.1554;
    if (totalInst === 10) return 1.1717;
    if (totalInst === 11) return 1.1882;
    if (totalInst === 12) return 1.2048;
    if (totalInst === 13) return 1.2216;
    if (totalInst === 14) return 1.2385;
    if (totalInst === 15) return 1.2556;
    if (totalInst === 16) return 1.2728;
    if (totalInst === 17) return 1.2902;
    if (totalInst === 18) return 1.3077;
};

const getSuggestPrice = (total, totalInstallments = 1) => {
    const multiplyFactor = getFactor(totalInstallments);
    return total * multiplyFactor;
};

module.exports = {
    getCompoundInterest,
    getSuggestPrice,
};
