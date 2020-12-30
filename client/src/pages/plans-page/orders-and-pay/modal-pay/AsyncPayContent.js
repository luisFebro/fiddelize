import React, { useState, useEffect } from "react";
import "./_PayContent.scss";
import PayCategories from "./payment-methods/PayCategories";
// import { Load } from "../../../../components/code-splitting/LoadableComp";
import useAPI, { finishCheckout } from "../../../../hooks/api/useAPI";
import { useAppSystem } from "../../../../hooks/useRoleData";
import { ShowPayWatermarks } from "./comps/GlobalComps";
import getFilterDate from "../../../../utils/dates/getFilterDate";
import handleRenewalDays from "./helpers/handleRenewalDays";
import useData from "../../../../hooks/useData";
import { MAX_INSTALLMENT_NO_INTEREST } from "./payment-methods/credit/card-data/helpers/getInstallments";
// import scrollIntoView from '../../../../utils/document/scrollIntoView';

const filter = getFilterDate();
/*
IMPORTANT:
As chamadas para os meios de pagamento do Checkout Transparente deverão ser efetuadas para o endpoint abaixo utilizando o método POST:
POST https://ws.pagseguro.uol.com.br/v2/transactions?{{credenciais}}
 */

export default function AsyncPayContent({ modalData }) {
    const {
        handleCancel,
        sandboxMode,
        reference,
        itemDescription,
        itemAmount,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail, // LESSON: sender email can not be admin's email (mr.fe...)
        PagSeguro,
        firstDueDate,
        ordersStatement,
        renewalDaysLeft,
        renewalReference,
        isSingleRenewal,
    } = modalData; // n1 notes about PagSeguro Methods

    const [payMethodData, setPayMethodData] = useState({
        selectedMethod: null,
        senderHash: "",
        // credit card
        creditCardToken: "",
        installmentQuantity: "1",
        installmentValue: "",
        creditCardHolderName: "",
    });
    const {
        selectedMethod,
        senderHash,
        creditCardToken,
        installmentQuantity,
        installmentValue,
        creditCardHolderName,
    } = payMethodData;

    const [renewalData, setRenewalData] = useState({
        newRenewalDaysLeft: null,
        renewalCurrDays: null,
        renewalReady: false,
    });
    const { newRenewalDaysLeft, renewalCurrDays, renewalReady } = renewalData;

    const isCreditCard = selectedMethod === "creditCard";
    const isBoleto = selectedMethod === "boleto";
    const isOnlineDebt = selectedMethod === "eft";

    useEffect(() => {
        handleRenewalDays({
            setRenewalData,
            ordersStatement,
            renewalDaysLeft,
            renewalReference,
            isSingleRenewal,
            reference,
        });
    }, [
        reference,
        renewalReference,
        renewalDaysLeft,
        isSingleRenewal,
        ordersStatement,
    ]);

    const { businessId } = useAppSystem();
    const [adminName, firstAdminName] = useData(["name", "firstName"]);

    const handleDataMethod = (dataPay) => {
        setPayMethodData((prev) => ({
            ...prev,
            ...dataPay,
        }));
    };

    const params = {
        userId: businessId,
    };

    const body = {
        senderHash,
        reference,
        senderName: adminName,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderEmail: sandboxMode
            ? `teste@sandbox.pagseguro.com.br`
            : senderEmail,
        paymentMethod: selectedMethod,
        itemId: reference,
        itemAmount1: itemAmount,
        itemDescription1: `${itemDescription
            .replace(/ç/gi, "c")
            .replace("null", "pro")}R$ ${itemAmount}`,
        ordersStatement,
        filter,
        renewalDaysLeft: newRenewalDaysLeft,
        renewalCurrDays,
        isSingleRenewal,
        renewalReference: renewalReference ? renewalReference : undefined,
        // boleto
        firstDueDate: isBoleto ? firstDueDate : undefined,
        // credit card
        creditCardToken: isCreditCard ? creditCardToken : undefined,
        installmentQuantity: isCreditCard ? installmentQuantity : undefined,
        installmentValue: isCreditCard ? installmentValue : undefined,
        creditCardHolderName: isCreditCard ? creditCardHolderName : undefined,
        noInterestInstallmentQuantity: isCreditCard
            ? MAX_INSTALLMENT_NO_INTEREST
            : undefined,
        creditCardHolderCPF: isCreditCard ? senderCPF : undefined,
        creditCardHolderBirthDate: isCreditCard ? "27/10/1987" : undefined,
        creditCardHolderAreaCode: isCreditCard ? senderAreaCode : undefined,
        creditCardHolderPhone: isCreditCard ? senderPhone : undefined,
    };

    const { data, loading } = useAPI({
        method: "post",
        url: finishCheckout(),
        params,
        body,
        needAuth: true,
        trigger:
            renewalReady &&
            senderCPF &&
            ordersStatement &&
            senderHash &&
            selectedMethod &&
            adminName !== "...",
        timeout: 60000,
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
                {firstAdminName}, selecione a sua forma de investir favorita.
            </p>
        </div>
    );

    const methodsModalData = {
        handleCancel,
        processing: loading,
        responseData: data,
        handleDataMethod,
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

/* ARCHIVES
// FOR TESTING
<p className="text-break text-normal mx-2 my-5">
    {JSON.stringify(params)}
</p>

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
