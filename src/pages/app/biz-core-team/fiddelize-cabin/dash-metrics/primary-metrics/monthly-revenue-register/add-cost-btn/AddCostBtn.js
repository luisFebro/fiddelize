import { useState } from "react";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import CostForm from "./CostForm";

export default function AddCostBtn({ handleNewCostCard, mainData }) {
    const [newCost, setNewCost] = useState(false);

    const switchCostPanel = (newVal) => {
        setNewCost(newVal);
    };

    const showCTA = () => (
        <ButtonFab
            title="Adicionar Receita"
            backgroundColor="var(--themeSDark)"
            onClick={() => switchCostPanel(true)}
            position="relative"
            variant="extended"
            size="large"
        />
    );

    const showCostForm = () => (
        <CostForm
            switchCostPanel={switchCostPanel}
            handleNewCostCard={handleNewCostCard}
            mainData={mainData}
        />
    );

    return (
        <section>
            <div className="my-5 container-center">
                {newCost ? showCostForm() : showCTA()}
            </div>
        </section>
    );
}
