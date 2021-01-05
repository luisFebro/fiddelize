import React, { useState, useEffect } from "react";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import CardData from "./card-data/CardData";
import useAPI, {
    checkOneClickInvest,
} from "../../../../../../hooks/api/useAPI";
import { decryptCreditCard } from "../../../../../../utils/security/creditCard";
import "./_AsyncCredit.scss";

export default function AsyncCredit({ modalData }) {
    const [watermark, setWatermark] = useState(true);
    const [oneClickInvest, setOneClickInvest] = useState(null);

    const { data: dataInvest, loading: loadingInvest } = useAPI({
        url: checkOneClickInvest(modalData.userId),
    });

    useEffect(() => {
        if (loadingInvest) return;
        if (dataInvest) {
            (async () => {
                const encoded = dataInvest;
                const ccData = await decryptCreditCard(encoded);
                setOneClickInvest(ccData);
            })();
        } else {
            setOneClickInvest(false);
        }
    }, [dataInvest, loadingInvest]);

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
                oneClickInvest={oneClickInvest}
                loadingInvest={loadingInvest}
            />
            {watermark && <ShowPayWatermarks needAnima={false} />}
        </section>
    );
}
