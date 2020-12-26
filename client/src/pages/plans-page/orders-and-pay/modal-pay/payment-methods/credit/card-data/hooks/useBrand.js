import React, { useEffect } from "react";
import getBrand from "../helpers/getBrand";

export default function useBrand(cardNumber, { setData, PagSeguro }) {
    useEffect(() => {
        const go = async () => {
            const cardData = await getBrand(cardNumber, { PagSeguro });
            if (cardData) {
                const { name, cvvSize } = cardData;
                console.log("cvvSize", cvvSize);
                console.log("name", name);
                setData((prev) => ({
                    ...prev,
                    cardBrand: name,
                    cvvSize,
                }));
            }
        };

        const needRun = !cardNumber || (cardNumber && cardNumber.length >= 6);
        needRun && go();
    }, [cardNumber]);
}
