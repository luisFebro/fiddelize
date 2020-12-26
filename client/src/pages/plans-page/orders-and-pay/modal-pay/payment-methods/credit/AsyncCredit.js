import React, { useState, useEffect, Fragment } from "react";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import usePayMethods from "../helpers/usePayMethods";
import CardData from "./card-data/CardData";

export default function AsyncCredit({ modalData }) {
    const [data, setData] = useState({
        cardNumber: "",
    });
    const { cardNumber, cardName, cvvSize } = data;

    const {
        responseData,
        processing,
        handleSelected,
        setPayMethods,
        authToken,
        getSenderHash,
        itemDescription,
        itemAmount,
        adminName,
        PagSeguro,
    } = modalData;

    const options = {
        PagSeguro,
        handleSelected,
        getSenderHash,
        authToken,
    };
    const cardsAvailable = usePayMethods("CREDIT_CARD", itemAmount, options);

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showMsgProcessing = () => (
        <section
            id="PayContent--boleto-msg"
            className="container-center-col mx-3 full-height my-4 text-subtitle font-weight-bold text-purple text-left"
        >
            Some loading Msg
        </section>
    );

    const showAvailableCards = () => (
        <section
            className="mt-5"
            style={{
                marginBottom: "150px",
            }}
        >
            {!cardsAvailable ? (
                <p className="text-normal text-purple font-weight-bold">
                    Vericando disponíveis...
                </p>
            ) : (
                <p className="text-normal text-purple font-weight-bold">
                    Cartões disponíveis:
                </p>
            )}
            <section className="container-center">
                {cardsAvailable &&
                    cardsAvailable.map((card) => (
                        <section key={card.name}>
                            <img
                                width={68}
                                height={30}
                                src={card.image}
                                alt={card.name}
                            />
                        </section>
                    ))}
            </section>
        </section>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            <CardData PagSeguro={PagSeguro} />
            {showAvailableCards()}
            <ShowPayWatermarks needAnima={false} />
        </section>
    );
}
