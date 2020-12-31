import React, { useState, useEffect, Fragment } from "react";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import CardData from "./card-data/CardData";

export default function AsyncCredit({ modalData }) {
    const [watermark, setWatermark] = useState(true);

    const { itemDescription, itemAmount } = modalData;

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            <CardData
                setWatermark={setWatermark}
                modalData={modalData}
                amount={itemAmount}
                description={itemDescription}
            />
            {watermark && <ShowPayWatermarks needAnima={false} />}
        </section>
    );
}
