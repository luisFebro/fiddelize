import React, { Fragment, useState } from "react";
import FlipCreditCard from "../../../../../../../components/cards/flip-credit-card/FlipCreditCard";
import handleChange from "../../../../../../../utils/form/use-state/handleChange";
import cardNumberMask from "../../../../../../../utils/validation/masks/cardNumberMask";
import cardExpiresMask from "../../../../../../../utils/validation/masks/cardExpiresMask";
import useBrand from "./hooks/useBrand";
import CardNumber from "./comps/CardNumber";
import CardFullName from "./comps/CardFullName";
import CardValAndCvv from "./comps/CardValAndCvv";
import BriefAndValue from "./comps/BriefAndValue";

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
    PagSeguro,
    setWatermark,
    amount,
    description,
    modalData,
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
        installmentDesc: "",
        installmentTotalAmount: null,
    });
    let {
        cardNumber,
        maxCardNumberLength,
        cardFullName,
        cardBrand,
        cardVal,
        cardCvv,
        cvvSize,
        flipCard,
        payMethod,
        installmentTotalAmount,
    } = data;

    const maskCardNumber = cardNumberMask(cardNumber);
    const maskCardVal = cardExpiresMask(cardVal);
    cardNumber = cardNumber && cardNumber.replace(" ", "");

    useBrand(cardNumber, { setData, PagSeguro });

    const styles = getStyles();

    // const handleCardConclusion = () => {
    //     alert("hello");
    // };

    return (
        <Fragment>
            <FlipCreditCard
                brand={cardBrand}
                cardNumber={maskCardNumber}
                cardFullName={cardFullName}
                cardVal={maskCardVal}
                cardCvv={cardCvv}
                cvvSize={cvvSize}
                flipCard={flipCard}
            />
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
                        PagSeguro={PagSeguro}
                        amount={amount}
                        brand={cardBrand}
                        description={description}
                        setMainData={setData}
                        payMethod={payMethod}
                        installmentTotalAmount={installmentTotalAmount}
                        setCurrComp={setCurrComp}
                    />
                )}
            </section>
        </Fragment>
    );
}
