import { useState } from "react";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import NewTransactionForm from "./NewTransactionForm";

export default function AddTransactionBtn({ mainData }) {
    const [newCost, setNewCost] = useState(false);

    const switchTransactionPanel = (newVal) => {
        setNewCost(newVal);
    };

    const showCTA = () => (
        <ButtonFab
            title="Adicionar"
            backgroundColor="var(--expenseRed)"
            onClick={() => switchTransactionPanel(true)}
            position="relative"
            variant="extended"
            size="large"
        />
    );

    const showNewTransactionForm = () => (
        <NewTransactionForm
            switchTransactionPanel={switchTransactionPanel}
            mainData={mainData}
        />
    );

    return (
        <section>
            <div className="my-5 container-center">
                {newCost ? showNewTransactionForm() : showCTA()}
            </div>
        </section>
    );
}
