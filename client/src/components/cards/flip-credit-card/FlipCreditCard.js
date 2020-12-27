// reference: https://codepen.io/veronicadev/pen/VXqZgR
// The credit card should follow the interactive field inspired on netlify>
// https://app.netlify.com/teams/luisfebro/billing/general
import React from "react";
import "./_FlipCreditCard.scss";
import { brandedCardImgs } from "./brandedCardImgs";
import gotArrayThisItem from "../../../utils/arrays/gotArrayThisItem";

export default function FlipCreditCard({
    brand,
    cardNumber,
    cardFullName,
    cardVal,
    cardCvv,
}) {
    const finalCardNumber = cardNumber ? cardNumber : "**** **** **** ****";
    const finalCardFullName = cardFullName ? cardFullName : "Nome no cartão";
    const finalCardVal = cardVal
        ? cardVal && cardVal.replace(/\s/g, "")
        : "••/••";
    const finalCardCvv = cardCvv ? cardCvv : "•••";

    const numberLength = cardNumber && cardNumber.length;

    const firstChar = numberLength && Number(cardNumber.charAt(0));
    const secondChar = numberLength && Number(cardNumber.charAt(1));
    const firstTwoChar = numberLength && Number(cardNumber.slice(0, 2));
    const firstThreeChar = numberLength && Number(cardNumber.slice(0, 3));

    const isVisa = numberLength >= 2 && firstChar === 4;
    const isMasterCard =
        numberLength >= 2 && secondChar <= 5 && secondChar >= 1;
    const isAmex =
        numberLength >= 2 && (firstTwoChar === 34 || firstTwoChar === 37);
    const dinersList = ["301", "305", "36", "38"];
    const isDiners =
        numberLength >= 2 &&
        gotArrayThisItem(
            dinersList,
            firstThreeChar && firstThreeChar.toString()
        );
    const eloList = ["509", "36", "63"];
    const isElo =
        numberLength >= 2 &&
        gotArrayThisItem(eloList, firstThreeChar && firstThreeChar.toString());
    const isAura = numberLength >= 2 && firstTwoChar === 50;

    const isCardValid =
        brand ||
        isVisa ||
        isMasterCard ||
        isAmex ||
        isDiners ||
        isElo ||
        isAura;

    const handleBrandCardSrc = () => {
        if (isVisa) return brandedCardImgs.visa;
        if (isMasterCard) return brandedCardImgs.mastercard;
        if (isAmex) return brandedCardImgs.amex;
        if (isDiners) return brandedCardImgs.diners;
        if (isElo) return brandedCardImgs.elo;
        if (isAura) return brandedCardImgs.aura;
        return brandedCardImgs[brand];
    };

    const showFront = () => (
        <div className={`card__front card__part ${!isCardValid && "disabled"}`}>
            {!isCardValid ? (
                <div className="card-brand"></div>
            ) : (
                <img
                    className="card-brand"
                    width={65}
                    height={40}
                    src={handleBrandCardSrc()}
                    alt="marca cartão"
                />
            )}
            <img
                className="card__square front"
                src="/img/icons/credit-card/chip.png"
                alt="chip cartão"
            />
            <p className="card_numer">{finalCardNumber}</p>
            <p className="card-holder text-default m-0">{finalCardFullName}</p>
            <p className="card-val-date text-default m-0">
                VAL <span className="val">{finalCardVal}</span>
            </p>
        </div>
    );

    const showBack = () => (
        <div className="card__back card__part">
            <div className="card__black-line"></div>
            <div className="card__back-content">
                <div className="card__secret">
                    <p className="card__secret--last">{finalCardCvv}</p>
                </div>
                <section className="card__back-square">
                    <div className="d-flex mx-3 justify-content-around align-items-center">
                        <img
                            className="card__square mr-3"
                            src="/img/icons/credit-card/chip.png"
                        />
                        <p className="text-card m-0">
                            Este cartão é pessoal e intrasferível.
                            <br />
                            Cartão via Fiddelize.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );

    const flipCard = () => {
        const cardElem = document.querySelector(".card");
        cardElem.classList.toggle("flipped");
    };

    return (
        <section className="card" onClick={flipCard}>
            {showFront()}
            {showBack()}
        </section>
    );
}
