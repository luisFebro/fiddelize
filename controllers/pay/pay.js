const checkout = require("./checkout");
const transparentCheckout = require("./transparentCheckout");
/* NOTAS
1.
Comprador Teste:
Email: c82394317961096588498@sandbox.pagseguro.com.br
Senha: 1188g5251aD87F1P

2.
Cartão de crédito de testes:
N*: 4111111111111111
Bandeira: VISA
Validade: 12/2030
CVV: 123

3.
Independentemente do formato de dados utilizado, a codificação de caracteres padrão para a integração é a ISO-8859-1. Tome o cuidado de sempre enviar os dados com este encoding de caracteres. Os dados enviados pelo PagSeguro sempre estarão neste encoding.

4. Modalidades permitidas através do PagSeguro
Crédito (Parcelado Vendedor / também conhecido como parcelado Loja ou Sem Juros);
Bandeiras: MasterCard (Crédito e Débito); VISA (Crédito e Débito); ELO (Crédito e Débito Cabal (Crédito e Débito); Hiper (Hipercard) (Crédito e Débito); Dinners; BrasilCard; Aura; Up; PersonalCard; SoroCred; ValeCard; Mais!;
*/

module.exports = {
    checkout,
    transparentCheckout,
};

// exports.generateBoleto = (req, res) => {
//     //https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email=__seu_email__
// // &token=__seu_token__
// }
