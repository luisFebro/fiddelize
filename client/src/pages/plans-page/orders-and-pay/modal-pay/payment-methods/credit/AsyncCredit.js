import React, { useState, useEffect, Fragment } from "react";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import usePayMethods from "../helpers/usePayMethods";
import CardData from "./card-data/CardData";

export default function AsyncCredit({ modalData }) {
    const [watermark, setWatermark] = useState(true);

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
                    {cardsAvailable ? cardsAvailable.length : 0} cartões
                    disponíveis:
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
            <CardData PagSeguro={PagSeguro} setWatermark={setWatermark} />
            {showAvailableCards()}
            {watermark && <ShowPayWatermarks needAnima={false} />}
        </section>
    );
}
