import getAPI, { finishCheckout } from "api";
import getFilterDate from "utils/dates/getFilterDate";

const filter = getFilterDate();

const testValue = undefined; // IMPORTANT: set this to undefined after testing

export default async function goFinishCheckout(props) {
    // common data
    const { selectedMethod, senderHash, modalData } = props;
    // Reminder: all other payment methods from selected, they will be automatically undefined here.

    const {
        userId,
        name,
        sandboxMode,
        senderEmail,
        senderCPF,
        senderAreaCode,
        senderPhone,
        senderBirthday,
        reference,
        itemDescription,
        itemAmount,
        itemList,
        firstDueDate,
        referrer,
    } = modalData;

    const params = {
        userId,
    };

    const isBoleto = selectedMethod === "boleto";
    const isCreditCard = selectedMethod === "creditCard";
    const isBankDebit = selectedMethod === "eft";
    const isPix = selectedMethod === "pix";

    let body = {
        paymentMethod: selectedMethod,
        senderHash,
        reference,
        itemId: reference,
        senderName: name,
        senderEmail: sandboxMode
            ? "teste.fiddelize@sandbox.pagseguro.com.br"
            : senderEmail,
        senderCPF,
        senderAreaCode,
        senderPhone,
        itemAmount1: testValue || itemAmount,
        itemDescription1: `${itemDescription
            .replace(/ç/gi, "c")
            .replace("null", "pro")}`,
        filter,
        itemList,
        // bank debit
        bankName: isBankDebit ? props.bankName : undefined,
        // boleto
        firstDueDate: isBoleto ? firstDueDate : undefined,
        // credit card
        noInterestInstallmentQuantity: props.noInterestInstallmentQuantity,
        creditCardToken: props.creditCardToken,
        installmentQuantity: props.installmentQuantity,
        installmentValue: testValue || props.installmentValue,
        installmentDesc: props.installmentDesc, // only for fiddelize system
        installmentTotalAmount: props.installmentTotalAmount, // only for fiddelize since the total amount should the original value, otherwise PagSeguro will thrown an errow as an invalid value
        creditCardHolderName:
            props.creditCardHolderName &&
            props.creditCardHolderName.toLowerCase(),
        cc: props.cc,
        oneClickInvest: isCreditCard ? props.oneClickInvest : undefined,
        creditCardHolderBirthDate: isCreditCard ? senderBirthday : undefined,
        creditCardHolderCPF: isCreditCard ? senderCPF : undefined,
        creditCardHolderAreaCode: isCreditCard ? senderAreaCode : undefined,
        creditCardHolderPhone: isCreditCard ? senderPhone : undefined,
        brand: props.brand,
        // split
        referrer,
    };

    if (isPix) {
        body = {
            paymentMethod: selectedMethod,
            reference,
            senderName: name,
            senderCPF,
            filter,
            itemAmount1: testValue || itemAmount,
            itemList,
            // split
            referrer,
        };
    }

    return await getAPI({
        method: "post",
        url: finishCheckout(),
        params,
        body,
        trigger: true,
        timeout: 60000,
    });
}
