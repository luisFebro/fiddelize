import React from "react";
import FlipCreditCard from "../../../components/cards/flip-credit-card/FlipCreditCard";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import useData from "../../../hooks/useData";
import useAPI, { readTempScoreList } from "../../../hooks/api/useAPI";
// Use the 3D card with the flip animation from flipCreditCard.
/*
<FlipCreditCard />
 */

export default function VirtualCard() {
    const [name] = useData(["name"]);
    const createdAt = new Date();

    const { data: cardsData } = useAPI({
        url: readTempScoreList(),
    });
    console.log("cardsData", cardsData);

    const showCard = () =>
        name !== "..." && (
            <section className="container-center-col px-2 full-height">
                <main className="animated fadeInUp">
                    <ThreeDFlipCard
                        name={name}
                        createdAt={createdAt}
                        score={150}
                    />
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
