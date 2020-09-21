const init = require("./init");
const transactions = require("./transactions");
const {
    getCompoundInterest,
    getSuggestPrice,
} = require("../../utils/number/getCompoundInterest");
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
VISA, MASTERCARD, AMEX, DINERS, HIPERCARD, AURA, ELO, PLENOCARD, PERSONALCARD, JCB, DISCOVER, BRASILCARD, FORTBRASIL, CARDBAN, VALECARD, CABAL, MAIS, AVISTA, GRANDCARD e SOROCRED

TAXAS:
Recebimento em 14 dias (Plano Atual):
4.99% à vista.
4.99% parcelado.
+ Valor fixo de R$ 0,40 por venda

p.e Para pagamento de R$ 100, tem taxa de R$ 5.99 (4.99% + R$ 0,40), sobra R$ 94.61

Recebimento em 30 dias:
2.19% à vista.
3.79% parcelado.

Valor mínimo por parcela: R$ 5,00.

Vendas com a bandeira Diners serão pagas somente em 30 dias.

Transferência para conta bancária
1 solicitação gratuita por dia.
A partir da 2ª solicitação no dia, será cobrada uma tarifa de R$ 3,50 por solicitação.

O PagSeguro trabalha com juros montantes compostos em relação a venda parcelada, no qual cobre juros sobre juros, conforme quantidade de parcelas.

O comprador pode pagar parcelado no cartão até 18 vezes.
Sendo as duas primeiras cobradas pelo vendedor e as demais para o comprador.
*/

const getPagseguroPay = (paidValue, options = {}) => {
    const { noFeeMonthlyInstallments = 2, totalInstallments = 1 } = options;

    const PERC_14_DAYS = 0.0499; // taxa de intermediação
    const FIXED_VALUE = 0.4;
    const INSTALLMENT_RATE = 0.0299; // Taxa de parcelamento vendedor 2,99% ao mês
    const PAID_BIZ_INSTALLMENT = 2;

    let installmentAmount = 0;
    let suggestPrice = paidValue;
    let monthlyInstallBizRate = 0;

    if (totalInstallments >= PAID_BIZ_INSTALLMENT) {
        const bizCharge = PAID_BIZ_INSTALLMENT - 1;
        monthlyInstallBizRate = getCompoundInterest(
            paidValue,
            bizCharge,
            INSTALLMENT_RATE
        );
        installmentAmount =
            getCompoundInterest(
                paidValue,
                totalInstallments - bizCharge,
                INSTALLMENT_RATE
            ) - monthlyInstallBizRate;
        suggestPrice = getSuggestPrice(paidValue, totalInstallments);
    }

    let rate = PERC_14_DAYS * paidValue + FIXED_VALUE + installmentAmount;

    const receivable = paidValue - rate;

    return {
        rate: rate.toFixed(2),
        monthlyInstallBizRate,
        receivable: receivable.toFixed(2),
        suggestPrice: suggestPrice.toFixed(2),
    };
};
// const simulation = getPagseguroPay(100, { totalInstallments: 18 });

module.exports = {
    init,
    transactions,
};

// exports.generateBoleto = (req, res) => {
//     //https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email=__seu_email__
// // &token=__seu_token__
// }
