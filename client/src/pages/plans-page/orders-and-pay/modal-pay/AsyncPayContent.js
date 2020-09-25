import React, { useState, useEffect } from "react";
import "./_PayContent.scss";
import PayCategories from "./payment-methods/PayCategories";
// import { Load } from "../../../../components/code-splitting/LoadableComp";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";
import useAPI, { finishCheckout } from "../../../../hooks/api/useAPI";
import { useProfile, useAppSystem } from "../../../../hooks/useRoleData";
import { ShowPayWatermarks } from "./comps/GlobalComps";
// import scrollIntoView from '../../../../utils/document/scrollIntoView';

const AsyncBoleto = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./payment-methods/boleto/AsyncBoleto" /* webpackChunkName: "boleto-comp-lazy" */
        ),
});

/*
IMPORTANT:
As chamadas para os meios de pagamento do Checkout Transparente deverão ser efetuadas para o endpoint abaixo utilizando o método POST:
POST https://ws.pagseguro.uol.com.br/v2/transactions?{{credenciais}}
 */

const getPayMethod = (selected) => {
    if (!selected) return "boleto";

    if ("No Boleto") return "boleto";
    if ("No Cartão") return "creditCard";
    if ("No Débito") return "eft";
};

export default function AsyncPayContent({ modalData }) {
    const {
        sandboxMode,
        authToken,
        reference,
        itemDescription,
        itemAmount,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail,
        PagSeguro,
        firstDueDate,
    } = modalData; // n1 notes about PagSeguro Methods
    const [payMethods, setPayMethods] = useState({});
    const [senderHash, setSenderHash] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { businessId } = useAppSystem();
    const { name: adminName } = useProfile();

    const handleSelected = (selection) => {
        setSelectedCategory(selection);
    };

    const params = {
        userId: businessId,
        senderHash,
        reference,
        senderName: adminName,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail: sandboxMode
            ? `teste@sandbox.pagseguro.com.br`
            : senderEmail,
        paymentMethod: getPayMethod(selectedCategory),
        itemId: reference,
        itemAmount1: itemAmount,
        itemDescription1: `${itemDescription.replace(
            /ç/gi,
            "c"
        )}R$ ${itemAmount}`,
        firstDueDate,
    };

    const { data, loading } = useAPI({
        method: "post",
        url: finishCheckout(),
        params,
        needAuth: true,
        trigger: senderHash && selectedCategory,
        timeout: 30000,
    });

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

    const methodsModalData = {
        processing: loading,
        responseData: data,
        authToken,
        getSenderHash,
        handleSelected,
        setPayMethods,
        itemDescription,
        itemAmount,
        adminName,
        PagSeguro,
    };

    return (
        <section>
            {showTitle()}
            {showSubtitle()}
            <PayCategories modalData={methodsModalData} />
            <ShowPayWatermarks />
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

/* ARCHIVES
const handleView = (targetCategory) => {
        let elem = "";
        if(targetCategory === "No Boleto") elem = "#PayContent--boleto-msg";
        // if("No Cartão") return "creditCard";
        // if("No Débito") return "eft";

        var element = document.querySelector(elem)
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        // scrollIntoView(elem, { mainContainer: "#mainContainer-PayContent" });
    }

 */
