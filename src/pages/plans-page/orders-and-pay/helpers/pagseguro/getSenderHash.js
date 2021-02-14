// 1. onSenderHashReady.
// OBRIGATÓRIO PARA TODOS OS MEIOS DE PAGAMENTO.
// A lib possui um método chamado getSenderHash que encontra-se depreciado, utilize o novo método onSenderHashReady para obter o hash identificador do comprador.
// (fingerprint) gerado pelo JavaScript do PagSeguro.
// O senderHash  é um identificador com os dados do comprador baseado naquela determinada sessão, garantindo a segurança da venda.
// O método onSenderHashReady possui algumas dependências , por isso, recomendamos que o mesmo não seja executado no onLoad da página ou mesmo onClick no evento "Finalizar Compra". Você pode executá-lo, por exemplo, no momento em que o cliente seleciona o campo destinado ao "Nome completo do comprador".

export default async function getSenderHash() {
    const PagSeguro = window.PagSeguroDirectPayment;

    const run = (resolve, reject) => {
        PagSeguro.onSenderHashReady((response) => {
            if (response.status == "error") {
                reject(response);
            }
            // LESSON: { ...data, something: set } does not work on an asyncronous response, ...data can not be read from outside and returns undefined.
            resolve(response.senderHash);
        });
    };

    return new Promise(run);
}
