import React, { useState, useEffect } from "react";
import "./_PayContent.scss";
import PayCategories from "./payment-methods/PayCategories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Load } from "../../../../components/code-splitting/LoadableComp";

const AsyncBoleto = Load({
    loader: () =>
        import(
            "./payment-methods/boleto/AsyncBoleto" /* webpackChunkName: "boleto-comp-lazy" */
        ),
});

export const faStyle = {
    fontSize: "25px",
    color: "var(--themeP)",
};

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

    // useEffect(() => {
    //     PagSeguro.setSessionId(authToken);
    //     PagSeguro.getPaymentMethods({
    //         amount: undefined, // returns all methods if not defined.
    //         success: function (response) {
    //             // n2
    //             setPayMethods(response.paymentMethods);
    //         },
    //         error: function (response) {
    //             console.log("Callback para chamadas que falharam", response);
    //         },
    //         complete: function (response) {
    //             console.log("Callback para todas chamadas", response);
    //         },
    //     });

    //     const fetchHash = setTimeout(() => getSenderHash(), 5000);

    //     return () => {
    //         clearTimeout(fetchHash);
    //     };
    // }, []);

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showSubtitle = () => (
        <div className="mx-2 my-5">
            <p className="text-subtitle main-font text-purple text-center font-weight-bold">
                Selecione a sua forma de investir favorita.
            </p>
        </div>
    );

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
            <div className="d-flex paycontent--safe-msg">
                <section className="d-flex align-items-cnter position-relative">
                    <FontAwesomeIcon
                        icon="lock"
                        className="mr-2"
                        style={faStyle}
                    />
                    <p
                        className="text-purple font-weight-bold text-small"
                        style={{ lineHeight: "20px" }}
                    >
                        Ambiente
                        <br />
                        Seguro
                    </p>
                </section>
            </div>
            <section className="animated fadeInUp delay-3s pagseguro-mark container-center-col">
                <p
                    className="position-relative m-0 shadow-elevation-black text-left text-white font-weight-bold"
                    style={{ left: "10px" }}
                >
                    protegido pelo
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
            {showTitle()}
            {showSubtitle()}
            <PayCategories />
            <AsyncBoleto />
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
