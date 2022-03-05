import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RevenueForm from "./RevenueForm";

export default function AddRevenueBtn({ handleNewRevenueCard, mainData }) {
    const [newRevenue, setNewRevenue] = useState(false);

    const switchRevenuePanel = (newVal) => {
        setNewRevenue(newVal);
    };

    const showCTA = () => (
        <ButtonFab
            title="Adicionar Receita"
            backgroundColor="var(--themeSDark)"
            onClick={() => switchRevenuePanel(true)}
            position="relative"
            variant="extended"
            size="large"
        />
    );

    const showRevenueForm = () => (
        <RevenueForm
            switchRevenuePanel={switchRevenuePanel}
            handleNewRevenueCard={handleNewRevenueCard}
            mainData={mainData}
        />
    );

    return (
        <section>
            <div className="my-5 container-center">
                {newRevenue ? showRevenueForm() : showCTA()}
            </div>
        </section>
    );
}
