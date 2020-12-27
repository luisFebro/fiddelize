import React, { Fragment, useState } from "react";
import FlipCreditCard from "../../../../../../../components/cards/flip-credit-card/FlipCreditCard";
import handleChange from "../../../../../../../utils/form/use-state/handleChange";
import cardNumberMask from "../../../../../../../utils/validation/masks/cardNumberMask";
import cardExpiresMask from "../../../../../../../utils/validation/masks/cardExpiresMask";
import useBrand from "./hooks/useBrand";
import CardNumber from "./comps/CardNumber";
import CardFullName from "./comps/CardFullName";
import CardValAndCvv from "./comps/CardValAndCvv";

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

export default function CardData({ PagSeguro }) {
    const [currComp, setCurrComp] = useState("cardNumber");
    const [data, setData] = useState({
        cardBrand: "",
        cardNumber: "",
        cardFullName: "",
        cardVal: "",
        cardCvv: "",
        cvvSize: "",
    });
    const {
        cardNumber,
        cardFullName,
        cardBrand,
        cardVal,
        cardCvv,
        cvvSize,
    } = data;
    console.log("cvvSize", cvvSize);
    console.log("cardBrand", cardBrand);
    const maskCardNumber = cardNumberMask(cardNumber);
    const maskCardVal = cardExpiresMask(cardVal);

    useBrand(cardNumber, { setData, PagSeguro });

    const styles = getStyles();

    const handleCardConclusion = () => {
        alert("hello");
    };

    return (
        <Fragment>
            <FlipCreditCard
                brand={cardBrand}
                cardNumber={maskCardNumber}
                cardFullName={cardFullName}
                cardVal={maskCardVal}
                cardCvv={cardCvv}
            />
            <section className="mt-4">
                {currComp === "cardNumber" && (
                    <CardNumber
                        styles={styles}
                        cardNumber={maskCardNumber}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        data={data}
                    />
                )}
                {currComp === "fullName" && (
                    <CardFullName
                        styles={styles}
                        cardFullName={cardFullName}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        data={data}
                    />
                )}
                {currComp === "valAndCvv" && (
                    <CardValAndCvv
                        styles={styles}
                        cardVal={maskCardVal}
                        cardCvv={cardCvv}
                        handleChange={handleChange}
                        setData={setData}
                        setCurrComp={setCurrComp}
                        data={data}
                        handleCardConclusion={handleCardConclusion}
                    />
                )}
            </section>
            <p className="text-center text-normal">{cardBrand}</p>
            <p className="text-center text-normal">{cvvSize}</p>
        </Fragment>
    );
}
