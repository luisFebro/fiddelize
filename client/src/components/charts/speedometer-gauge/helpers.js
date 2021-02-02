import repeat from "../../../utils/arrays/repeat";

export const getBadZoneList = (value) => {
    const lastDeg = -95;
    const lastValue = -100;

    const valueToDegList = {};

    valueToDegList[`${lastValue}`] = lastDeg;
    repeat(99).forEach((a, i) => {
        const currOrder = i + 1;
        valueToDegList[`${lastValue + currOrder}`] =
            lastDeg + (currOrder - 2.5);
    });

    const finalValue = valueToDegList[value];
    if (finalValue <= -95) return -95;
    return Math.floor(finalValue - 10);
};

export const getOkZoneList = (value) => {
    const lastDeg = 90;
    const lastValue = 100;

    const valueToDegList = {};

    valueToDegList[`${lastValue}`] = lastDeg;
    repeat(99).forEach((a, i) => {
        const currOrder = i + 1;
        valueToDegList[`${lastValue - currOrder}`] =
            lastDeg - (currOrder - 2.5);
    });

    const finalValue = valueToDegList[value];
    if (finalValue > 95) return 90;
    return Math.floor(finalValue);
};

export const getTextStatus = (value, isShortened) => {
    if (value < 0)
        return {
            title: isShortened ? "Ruim" : "Precisa Melhorias",
            advice:
                "Há problemas de atendimento, produtos ou serviços. Dica: veja se há relatos de compras negativos, mande mensagem para os clientes para resolver problemas pendentes o quanto antes e tente ganhar seus clientes insatisfeitos ;)",
            icon: "heart-broken",
        };
    if (value >= 0 && value < 30)
        return {
            title: "Bom",
            advice:
                "O objetivo é ter uma pontuação acima de zero. Saiba que a maioria das empresas estão nesta área de 0 - 30 pontos. É um desafio fidelizar boa parte dos clientes. Curiosidade: De 400 empresas analisadas em diversas indústrias, a média foi somente 16 pontos",
            icon: "flag-checkered",
        };
    if (value >= 30 && value < 70)
        return {
            title: "Ótimo",
            advice:
                "Seu negócio está indo ótimo em conquistar clientes. O negócio tem mais clientes felizes do que insatisfeitos.",
            icon: "trophy",
        };
    if (value >= 70)
        return {
            title: "Excelente",
            advice:
                "Seus clientes estão amando seu negócio. Continue fazendo o que está fazendo! Com muitos promotores, você ganha Marketing boca a boca, que leva a mais clientes e vendas. Curiosidade: 70 pontos é a média da empresa Apple.",
            icon: "heart",
        };
};

export const getBadOrGoodStatus = (value) => {
    if (value < 0) return "bad";
    if (value >= 0) return "good";
};

export const convertValueToDeg = (value) => {
    if (value === 0) return 0;
    if (value === undefined) return -90;

    const status = getBadOrGoodStatus(value);
    if (status === "bad") {
        return getBadZoneList(value);
    }
    return getOkZoneList(value);
};
