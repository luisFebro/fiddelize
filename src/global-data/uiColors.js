export const uiColors = [
    {
        id: "defaultS",
        ptColorName: "azul cyan",
        hexValue: "var(--mainCyan)",
        isDefault: true,
    },
    {
        id: "pink",
        ptColorName: "rosa",
        hexValue: "var(--mainPink)",
        isDefault: false,
    },
    {
        id: "purple",
        ptColorName: "roxo",
        hexValue: 'var(--mainPurple)',
        isDefault: false,
    },
    {
        id: "red",
        ptColorName: "vermelho",
        hexValue: "var(--expenseRed)",
        isDefault: false,
    },
    {
        id: "orange",
        ptColorName: "laranja",
        hexValue: "var(--mainOrange)",
        isDefault: false,
    },
    {
        id: "black",
        ptColorName: "preto",
        hexValue: "var(--mainDark)",
        isDefault: false,
    },
    {
        id: "white",
        ptColorName: "branco",
        hexValue: "var(--mainWhite)",
        isDefault: false,
    },
    {
        id: "blue",
        ptColorName: "azul",
        hexValue: "var(--lightBlue)",
        isDefault: false,
    },
    {
        id: "green",
        ptColorName: "verde",
        hexValue: 'var(--incomeGreen)',
        isDefault: false,
    },
    {
        id: "brown",
        ptColorName: "marrom",
        hexValue: 'var(--mainBrown)',
        isDefault: false,
    },
    {
        id: "yellow",
        ptColorName: "amarelo",
        hexValue: "var(--mainYellow)",
        isDefault: false,
    },
];

export const translateColorToPtBr = color => {
    const foundColor = uiColors.find(c => c.id === color);
    if(!foundColor) return "";
    return foundColor.ptColorName;
}

export const translateColorToEng = cor => {
    const foundColor = uiColors.find(c => c.ptColorName === cor);
    if(!foundColor) return "";
    return foundColor.id;
}

// Next colors:
// grey