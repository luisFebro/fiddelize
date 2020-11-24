// reference: https://codepen.io/veronicadev/pen/VXqZgR
// The credit card should follow the interactive field inspired on netlify>
// https://app.netlify.com/teams/luisfebro/billing/general
import React from "react";
import "./_FlipCreditCard.scss";

export default function FlipCreditCard() {
    const showFront = () => (
        <div className="card__front card__part">
            <img
                className="card__front-square card__square"
                src="/img/icons/credit-card/chip.png"
            />
            <p className="card_numer">**** **** **** 6258</p>
            <div className="card__space-75">
                <span className="card__label">Card holder</span>
                <p className="card__info">John Doe</p>
            </div>
            <div className="card__space-25">
                <span className="card__label">Expires</span>
                <p className="card__info">10/25</p>
            </div>
        </div>
    );

    const showBack = () => (
        <div className="card__back card__part">
            <div className="card__black-line"></div>
            <div className="card__back-content">
                <div className="card__secret">
                    <p className="card__secret--last">420</p>
                </div>
                <img
                    className="card__back-square card__square"
                    src="/img/icons/credit-card/chip.png"
                />
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
