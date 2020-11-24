import React from "react";
import FlipCreditCard from "../../../components/cards/flip-credit-card/FlipCreditCard";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
// Use the 3D card with the flip animation from flipCreditCard.
/*
<FlipCreditCard />
 */

export default function VirtualCard() {
    const showCard = () => (
        <section className="container-center-col px-2">
            <main className="animated fadeInUp">
                <ThreeDFlipCard name="Luis Febro" score={150} />
            </main>
            <div className="animated fadeIn delay-3s mt-5">
                <ButtonFab
                    title="Aplicar pontos"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    return <section>{showCard()}</section>;
}
