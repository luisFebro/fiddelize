exports.getPayCategoryType = (type) => {
    if (type === "boleto") return "boleto";
    if (type === "creditCard") return "crédito";
    if (type === "eft") return "débito";
};

// LESSON: while testing, do not forget to switch to paid status!
exports.getTransactionStatusTypes = (codeNum) => {
    if (codeNum === "1") return "pendente";
    if (codeNum === "2") return "em análise";
    if (codeNum === "3") return "pago";
    if (codeNum === "4") return "disponível";
    if (codeNum === "5") return "em disputa";
    if (codeNum === "6") return "devolvido";
    if (codeNum === "7") return "cancelado";
    if (codeNum === "8") return "debitado";
    if (codeNum === "9") return "em retenção";
};

// Tipos de meio de pagamentos e seus códigos
// 1   Cartão de crédito: o comprador escolheu pagar a transação com cartão de crédito.
// 2   Boleto: o comprador optou por pagar com um boleto bancário.
// 3   Débito online (TEF): o comprador optou por pagar a transação com débito online de algum dos bancos conveniados.
// 4   Saldo PagSeguro: o comprador optou por pagar a transação utilizando o saldo de sua conta PagSeguro.
// 5   Oi Paggo *: o comprador escolheu pagar sua transação através de seu celular Oi.
// 7   Depósito em conta: o comprador optou por fazer um depósito na conta corrente do PagSeguro. Ele precisará ir até uma agência bancária, fazer o depósito, guardar o comprovante e retornar ao PagSeguro para informar os dados do pagamento. A transação será confirmada somente após a finalização deste processo, que pode levar de 2 a 13 dias úteis.

// 6. Código identificador do meio de pagamento.
// 101 Cartão de crédito Visa.
// 102 Cartão de crédito MasterCard.
// 103 Cartão de crédito American Express.
// 104 Cartão de crédito Diners.
// 105 Cartão de crédito Hipercard.
// 106 Cartão de crédito Aura.
// 107 Cartão de crédito Elo.
// 108 Cartão de crédito PLENOCard.
// 109 Cartão de crédito PersonalCard.
// 110 Cartão de crédito JCB.
// 111 Cartão de crédito Discover.
// 112 Cartão de crédito BrasilCard.
// 113 Cartão de crédito FORTBRASIL.
// 114 Cartão de crédito CARDBAN.
// 115 Cartão de crédito VALECARD.
// 116 Cartão de crédito Cabal.
// 117 Cartão de crédito Mais!.
// 118 Cartão de crédito Avista.
// 119 Cartão de crédito GRANDCARD.
// 120 Cartão de crédito Sorocred.
// 122 Cartão de crédito Up Policard.
// 123 Cartão de crédito Banese Card.
// 201 Boleto Bradesco.
// 202 Boleto Santander. ****
// 301 Débito online Bradesco.
// 302 Débito online Itaú.
// 303 Débito online Unibanco.
// 304 Débito online Banco do Brasil.
// 305 Débito online Banco Real.
// 306 Débito online Banrisul.
// 307 Débito online HSBC.
// 401 Saldo PagSeguro.
// 501 Oi Paggo.
// 701 Depósito em conta - Banco do Brasil
exports.getPaymentMethod = (codeNum) => {
    if (codeNum === "202") return "boleto santander";
};
