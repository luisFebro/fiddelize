import { useState, useEffect } from "react";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
import CartRace from "pages/mobile-app/content/bottom-menu-contents/all-games/discount-back/cart-race/CartRace.js";
import convertToReal from "utils/numbers/convertToReal";

export default function OnlineDiscountBack({ currPoints, adminGame }) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const [dataRef, setDataRef] = useState(null);

    const targetPoints = adminGame && adminGame.targetPoints;
    const targetMoney = adminGame && adminGame.targetMoney;

    const numberOptions = {
        trigger: true,
        callback: setShowMoreComps,
    };

    useEffect(() => {
        const ref = document.querySelector(".online-points-area");
        setDataRef(ref);
    }, []);

    useAnimateNumber(dataRef, currPoints || 0, numberOptions);

    const txtColor = "white";

    const showCoinsArea = () => (
        <section className="text-subtitle text-white text-center">
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

    const mainTxt = (
        <section className="text-white text-shadow text-center font-weight-bold text-normal animated fadeInUp">
            Acumule <span className="text-title">{targetPoints} PTS,</span>
            <br />e ganhe desconto de R$ {convertToReal(targetMoney)} no pedido
        </section>
    );

    return (
        <section>
            {showCoinsArea()}
            {mainTxt}
            <div
                style={{
                    margin: "70px 0",
                }}
            >
                <CartRace
                    className="animated fadeInUp faster"
                    targetPoints={targetPoints}
                    perc={50}
                    isOnline
                    currPoints={currPoints}
                />
            </div>
        </section>
    );
}

/*

const mainTxt = didBeatGame ? (
    <section className="text-center font-weight-bold text-normal animated fadeInUp">
        Você bateu <span className="text-title">{targetPoints} PTS,</span>
        <br />e ganhou:
    </section>
) : (
    <section className="text-center font-weight-bold text-normal animated fadeInUp">
        Acumule <span className="text-title">{targetPoints} PTS,</span>
        <br />e ganhe:
    </section>
);

 */
