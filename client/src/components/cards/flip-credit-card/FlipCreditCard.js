// reference: https://codepen.io/veronicadev/pen/VXqZgR
// The credit card should follow the interactive field inspired on netlify>
// https://app.netlify.com/teams/luisfebro/billing/general
import React from "react";
import "./_FlipCreditCard.scss";

export default function FlipCreditCard({ cardNumber, cardFullName, cardVal }) {
    const finalCardNumber = cardNumber ? cardNumber : "**** **** **** ****";
    const finalCardFullName = cardFullName ? cardFullName : "Nome no cartão";
    const finalCardVal = cardVal
        ? cardVal && cardVal.replace(/\s/g, "")
        : "••/••";

    const showFront = () => (
        // disabled
        <div className="card__front card__part">
            <img
                className="card-brand"
                width={65}
                height={40}
                src="/img/icons/credit-card/brands/visa.png"
                alt="marca cartão"
            />
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
                    <p className="card__secret--last">•••</p>
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
        console.log("cardElem", cardElem);
        cardElem.classList.toggle("flipped");
    };

    return (
        <section className="card" onClick={flipCard}>
            {showFront()}
            {showBack()}
        </section>
    );
}
