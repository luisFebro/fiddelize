/*
IMPORTANTE:
Sua aplicação deve estar apta para suportar tempo de resposta de até 1 minuto, pois a dependendo da quantidade de boletos a serem gerados, sua aplicação pode retornar time out enquanto ainda os boletos estiverem sendo gerados no PagSeguro.
Para cada boleto, os clientes precisam pagar R$ 1.00 para cobrir custos de gestão de risco

Por onde gero a segunda via do boleto e gerencio meus boletos?
Através do portal do cliente do PagSeguro.

Quantos boletos são permitidos gerar de uma única vez?
O limite é de 12 boletos.
 */

function generateBoleto(req, res) {
    return "hello";
}

module.exports = {
    generateBoleto,
};
