//
import generateAlphaNumeric from "./generateAlphaNumeric";
import removeDiacritics from "./removeDiacritics";
// SKU (Stock Keeping Unit - Unidade de Manuntenção de Estoque)

// code exemple: GO-Q3-1F3C2DEW (plano-quantidade-id)
const getPlan = (plan) => {
    if (typeof plan !== "string") return;

    if (plan.toLowerCase() === "ouro") return "OU";
    if (plan.toLowerCase() === "prata") return "PR";
    if (plan.toLowerCase() === "bronze") return "BR";

    return "BR";
};

const getPeriod = (per) => {
    if (per === "yearly") return "A";
    if (per === "monthly") return "M";
};

const getQuantity = (total) => {
    return `Q${total}`;
};

const getServiceSKU = (options = {}) => {
    const { plan = "gold", total = 0, period } = options;

    const SKU = [
        getPlan(plan),
        getQuantity(total),
        getPeriod(period),
        generateAlphaNumeric(7, "A#"),
    ];
    return SKU.join("-");
};

const getProductSKU = (productName) => {
    productName = removeDiacritics(productName);
    let abbrev = productName.split(" ").map((each) => {
        return each.substr(0, 1).toUpperCase();
    });

    return abbrev.join("");
};

export { getProductSKU, getServiceSKU };

/* COMMENTS
ideally generate the SKU on the orders page right before payment.
n1: ABOUT SKU
O código SKU deve trazer em sua numeração algumas informações sobre o produto, o que torna mais simples a sua identificação. As informações contidas podem ser:

tamanho do material;
cor;
tipo de produto;
quem fabricou;
tipo de produto;
embalagem.
Com essa referência, o produto pode ser encontrado facilmente dentro do armazém, os inventários podem ser feitos com mais agilidade e assertividade, todas as operações relacionadas à saída e entrada dos materiais na empresa podem ser vinculadas a essa identidade, trazendo inúmeros benefícios.

Continuando o exemplo da empresa de vestuário. Digamos que você queira criar um código para uma coleção de camisetas que acabou de chegar. Uma camiseta do fabricante X, da coleção número 10, modelo gola V, que seja do tamanho 12 e da cor branca, poderia ser nomeada como: CX-10-GV-12-BRA.

PLAN-GO-Q3-123cd
Sendo assim, todos os outros produtos devem seguir a mesma lógica e sequência: fabricante, coleção, modelo, tamanho e cor. Para alguém de fora da empresa, essa sequência não terá significado, porém, para a equipe que trabalha com os códigos diariamente, o SKU será comum.
*/
