import getAPI, { finishCheckout } from "../../../../../utils/promises/getAPI";
import getFilterDate from "../../../../../utils/dates/getFilterDate";

const filter = getFilterDate();

export default async function goFinishCheckout(props) {
    // common data
    const { selectedMethod, senderHash, modalData } = props;
    // Reminder: all other payment methods from selected, they will be automatically undefined here.

    const {
        userId,
        userName,
        sandboxMode,
        senderEmail,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderBirthday,
        reference,
        itemDescription,
        itemAmount,
        ordersStatement,
        renewalCurrDays,
        isSingleRenewal,
        firstDueDate,
        renewalDaysLeft,
        renewalReference,
    } = modalData;

    const params = {
        userId,
    };

    const isBoleto = selectedMethod === "boleto";
    const isCreditCard = selectedMethod === "creditCard";
    const isBankDebit = selectedMethod === "eft";

    const body = {
        paymentMethod: selectedMethod,
        senderHash,
        reference,
        itemId: reference,
        senderName: userName,
        senderEmail: sandboxMode
            ? `teste@sandbox.pagseguro.com.br`
            : senderEmail,
        senderCPF,
        senderAreaCode,
        senderPhone,
        itemAmount1: itemAmount,
        itemDescription1: `${itemDescription
            .replace(/ç/gi, "c")
            .replace("null", "pro")}R$ ${itemAmount}`,
        filter,
        ordersStatement,
        // renewal
        renewalCurrDays,
        isSingleRenewal,
        renewalDaysLeft,
        renewalReference,
        // bank debit
        bankName: isBankDebit ? props.bankName : undefined,
        // boleto
        firstDueDate: isBoleto ? firstDueDate : undefined,
        // credit card
        noInterestInstallmentQuantity: props.noInterestInstallmentQuantity,
        creditCardToken: props.creditCardToken,
        installmentQuantity: props.installmentQuantity,
        installmentValue: props.installmentValue,
        installmentDesc: props.installmentDesc, // only for fiddelize system
        creditCardHolderName: props.creditCardHolderName,
        cc: props.cc,
        oneClickInvest: isCreditCard ? props.oneClickInvest : undefined,
        creditCardHolderBirthDate: isCreditCard ? senderBirthday : undefined,
        creditCardHolderCPF: isCreditCard ? senderCPF : undefined,
        brand: props.brand,
    };

    return await getAPI({
        method: "post",
        url: finishCheckout(),
        params,
        body,
        trigger: true,
        timeout: 60000,
    }).catch((err) => err);
}

/*
trigger: renewalReady &&
         senderCPF &&
         ordersStatement &&
         senderHash &&
         selectedMethod &&
         userName !== "...",
 */
