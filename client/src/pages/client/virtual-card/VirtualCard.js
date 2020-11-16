import React from "react";
import FlipCreditCard from "../../../components/cards/flip-credit-card/FlipCreditCard";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";

// Use the 3D card with the flip animation from flipCreditCard.
/*
<FlipCreditCard />
 */

export default function VirtualCard() {
    const showCard = () => (
        <div className="mt-5">
            <ThreeDFlipCard />
        </div>
    );

    return (
        <section className="text-hero text-white font-weight-bold">
            I am the Virtual Card Page
            {showCard()}
        </section>
    );
}
