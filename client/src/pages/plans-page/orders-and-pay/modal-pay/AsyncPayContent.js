import React, { useState, useEffect } from "react";
// import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import { ShowTitle } from "../../../../components/buttons/premium/feature-pages/DefaultProComps";
import "./_PayContent.scss";

/*
IMPORTANT:
As chamadas para os meios de pagamento do Checkout Transparente deverão ser efetuadas para o endpoint abaixo utilizando o método POST:
POST https://ws.pagseguro.uol.com.br/v2/transactions?{{credenciais}}

 */

export default function AsyncPayContent({ modalData }) {
    const { authToken, PagSeguro } = modalData; // n1 notes about PagSeguro Methods
    const [payMethods, setPayMethods] = useState({});
    const [senderHash, setSenderHash] = useState("");

    console.log("senderHash", senderHash);
    console.log("payMethods", payMethods);

    useEffect(() => {
        PagSeguro.setSessionId(authToken);
        PagSeguro.getPaymentMethods({
            amount: 500.0,
            success: function (response) {
                // n2
                setPayMethods(response.paymentMethods);
            },
            error: function (response) {
                console.log("Callback para chamadas que falharam", response);
            },
            complete: function (response) {
                console.log("Callback para todas chamadas", response);
            },
        });

        const fetchHash = setTimeout(() => getSenderHash(), 5000);

        return () => {
            clearTimeout(fetchHash);
        };
    }, []);

    function getSenderHash() {
        PagSeguro.onSenderHashReady(function (response) {
            if (response.status == "error") {
                console.log(response.message);
                return false;
            }
            // LESSON: { ...data, something: set } does not work on an asyncronous response, ...data can not be read from outside and returns undefined.
            const hash = response.senderHash;
            setSenderHash(hash);
        });
    }

    const showPayWatermarks = () => (
        <section className="d-flex justify-content-around">
            <p className="paycontent--watermarks shadow-elevation-black">
                Conexão segura
            </p>
            <section className="container-center-col">
                <p
                    className="position-relative m-0 shadow-elevation-black text-left text-white font-weight-bold"
                    style={{ left: "10px" }}
                >
                    protegido por:
                </p>
                <img
                    className="shadow-elevation-black"
                    src="/img/icons/pay/logo-pagseguro-uol.png"
                    width={160}
                    height={30}
                    alt="pagamento processado via PagSeguro Transparente"
                />
            </section>
        </section>
    );

    return (
        <section>
            <ShowTitle title="Fiddelize Invista" />
            <p className="my-5 text-center text-purple text-normal">
                {authToken}
            </p>
            {showPayWatermarks()}
        </section>
    );
}

/* COMMENTS
n1: METHODS
1. onSenderHashReady.
OBRIGATÓRIO PARA TODOS OS MEIOS DE PAGAMENTO.
A lib possui um método chamado getSenderHash que encontra-se depreciado, utilize o novo método onSenderHashReady para obter o hash identificador do comprador.
O senderHash é um identificador com os dados do comprador baseado naquela determinada sessão, garantindo a segurança da venda.
O método onSenderHashReady possui algumas dependências , por isso, recomendamos que o mesmo não seja executado no onLoad da página ou mesmo onClick no evento "Finalizar Compra". Você pode executá-lo, por exemplo, no momento em que o cliente seleciona o campo destinado ao "Nome completo do comprador".

2. getPaymentMethods
Esse método recebe opcionalmente o valor da transação e retorna um JSON contendo os meios de pagamento disponíveis, compatíveis com o valor informado. Caso não seja informado o valor, será retornado todos os meios de pagamento.

n2:
Observe que os meios de pagamento Balance e Deposit são retornados, porém atualmente não podem ser implementados.
*/
