import { useState, useEffect } from "react";
import useAnimateNumber from "hooks/animation/useAnimateNumber";

export default function OnlineDiscountBack({ currPoints }) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const [dataRef, setDataRef] = useState(null);

    const numberOptions = {
        trigger: true,
        callback: setShowMoreComps,
    };

    useEffect(() => {
        const ref = document.querySelector(".online-points-area");
        setDataRef(ref);
    }, []);

    useAnimateNumber(dataRef, currPoints, numberOptions);

    const txtColor = "white";

    const showCoinsArea = () => (
        <section className="text-subtitle mt-3 text-white text-center">
            <span
                className={`animated fadeInUp d-block mb-3 text-title ${txtColor}`}
            >
                Saldo:
            </span>
            <div className="d-flex justify-content-center">
                <p className={`online-points-area m-0 text-hero ${txtColor}`}>
                    ...
                </p>
                {showMoreComps ? (
                    <section className="position-relative">
                        <span className={`animated fadeIn ml-2 ${txtColor}`}>
                            <img
                                className="pts-coin"
                                width={50}
                                height={50}
                                src="/img/app-pts-coin.png"
                                alt="moeda digital pts para benefícios"
                            />
                            <style jsx>
                                {`
                                    .pts-coin {
                                        filter: drop-shadow(
                                            0.001em 0.001em 0.18em grey
                                        );
                                    }
                                `}
                            </style>
                        </span>
                    </section>
                ) : (
                    <span className={`ml-2 ${txtColor}`}>Pontos</span>
                )}
            </div>
        </section>
    );

    return <section>{showCoinsArea()}</section>;
}
