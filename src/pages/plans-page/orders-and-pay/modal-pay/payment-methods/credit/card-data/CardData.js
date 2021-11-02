import { Fragment, useState, useEffect } from "react";
import FlipCreditCard from "components/cards/flip-credit-card/FlipCreditCard";
import handleChange from "utils/form/use-state/handleChange";
import cardNumberMask from "utils/validation/masks/cardNumberMask";
import cardExpiresMask from "utils/validation/masks/cardExpiresMask";
import useBrand from "./hooks/useBrand";
// comps
import CardNumber from "./comps/CardNumber";
import CardFullName from "./comps/CardFullName";
import CardValAndCvv from "./comps/CardValAndCvv";
import BriefAndValue from "./comps/BriefAndValue";
import SuccessfulCcPay from "./comps/SuccessFulCcPay";

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "#fff",
        color: "var(--themeP)",
        fontSize: "25px",
        fontWeight: "bold",
        fontFamily: "var(--mainFont)",
        textAlign: "center",
        padding: "15px 0px",
    },
});

export default function CardData({
    setWatermark,
    amount,
    description,
    modalData,
    oneClickInvest,
    loadingInvest,
}) {
    const [currComp, setCurrComp] = useState("cardNumber");
    const [data, setData] = useState({
        cardBrand: "",
        cardNumber: "",
        maxCardNumberLength: "",
        cardFullName: "",
        cardVal: "",
        cardCvv: "",
        cvvSize: "",
        flipCard: false,
        payMethod: "cash", // or installment
        installmentQuantity: null,
        installmentDesc: "à vista",
        installmentTotalAmount: null,
        amountPerInstallment: null,
        oneClickInvest: false,
        isOneClickRemoved: false, // when user click on "excluir" btn
        hideCard: false, // for successful transacion only
    });

    const {
        maxCardNumberLength,
        cardFullName,
        cardBrand,
        cardVal,
        cardCvv,
        cvvSize,
        flipCard,
        payMethod,
        installmentTotalAmount,
        isOneClickRemoved,
        hideCard,
    } = data;
    let { cardNumber } = data;

    const isOneClickInvest = !isOneClickRemoved && Boolean(oneClickInvest);
    useEffect(() => {
        if (isOneClickInvest) {
            const {
                cardHolder,
                cvv,
                cardNumber,
                expirationYear,
                expirationMonth,
            } = oneClickInvest;
            const expYear = expirationYear && expirationYear.slice(-2);
            const thisCardVal = `${expirationMonth} / ${expYear}`;

            setCurrComp("briefAndValue");
            setData({
                ...data,
                cardNumber,
                cardFullName: cardHolder,
                cardVal: thisCardVal,
                cardCvv: cvv,
                oneClickInvest: true,
            });
        }
    }, [isOneClickInvest]);

    const maskCardNumber = cardNumberMask(cardNumber);
    const maskCardVal = cardExpiresMask(cardVal);
    cardNumber = cardNumber && cardNumber.replace(/\s/g, "");

    useBrand(cardNumber, { setData, cardNumber });

    const styles = getStyles();

    if (loadingInvest) {
        return (
            <p className="my-5 text-center text-p text-subtitle font-weight-bold">
                Carregando cartão...
            </p>
        );
    }

    return (
        <Fragment>
            {!hideCard && (
                <Fragment>
                    {isOneClickInvest && (
                        <p className="text-center text-p font-weight-bold text-normal">
                            Cartão salvo
                        </p>
                    )}
                    <FlipCreditCard
                        brand={cardBrand}
                        cardNumber={maskCardNumber}
                        cardFullName={cardFullName}
                        cardVal={maskCardVal}
                        cardCvv={cardCvv}
                        cvvSize={cvvSize}
                        flipCard={flipCard}
                        isOneClick={isOneClickInvest}
                    />
                </Fragment>
            )}
            <section className="mt-4">
                {currComp === "cardNumber" && (
                    <CardNumber
                        styles={styles}
                        cardNumber={maskCardNumber}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        setWatermark={setWatermark}
                        data={data}
                        maxCardNumberLength={maxCardNumberLength}
                        modalData={modalData}
                    />
                )}
                {currComp === "fullName" && (
                    <CardFullName
                        styles={styles}
                        cardFullName={cardFullName}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        setWatermark={setWatermark}
                        data={data}
                        modalData={modalData}
                    />
                )}
                {currComp === "valAndCvv" && (
                    <CardValAndCvv
                        styles={styles}
                        cardVal={maskCardVal}
                        cardCvv={cardCvv}
                        cvvSize={cvvSize}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        data={data}
                        setWatermark={setWatermark}
                        modalData={modalData}
                    />
                )}
                {currComp === "briefAndValue" && (
                    <BriefAndValue
                        amount={amount}
                        brand={cardBrand}
                        description={description}
                        setMainData={setData}
                        payMethod={payMethod}
                        installmentTotalAmount={installmentTotalAmount}
                        setCurrComp={setCurrComp}
                        mainData={data}
                        modalData={modalData}
                        isOneClick={isOneClickInvest}
                    />
                )}
                {currComp === "successfulCCPay" && (
                    <SuccessfulCcPay setMainData={setData} />
                )}
            </section>
        </Fragment>
    );
}
