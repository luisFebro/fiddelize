const removeDiacritics = require('./removeDiacritics');
// This will be the SKU
const generateRefCode = productName => {
    productName = removeDiacritics(productName);
    let abbrev = productName.split(" ").map(each => {
        return each.substr(0, 1).toUpperCase();
    });

    return abbrev.join("");
};

module.exports = generateRefCode;

/* COMMENTS
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

Sendo assim, todos os outros produtos devem seguir a mesma lógica e sequência: fabricante, coleção, modelo, tamanho e cor. Para alguém de fora da empresa, essa sequência não terá significado, porém, para a equipe que trabalha com os códigos diariamente, o SKU será comum.
*/