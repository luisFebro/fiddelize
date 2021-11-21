import { useState } from "react";
import MonthlyCostsList from "./monthly-costs-list/MonthlyCostsList";
import AddCostBtn from "./add-cost-btn/AddCostBtn";

export default function MonthlyCostRegisterContent({
    currMonth = "...",
    handleNewCostValue,
    mainData,
}) {
    const [newCardSet, setNewCardSet] = useState([]);

    const allTimeCostAvgAmount = mainData && mainData.allTimeCostAvgAmount;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Histórico de Custos
                <br />
                de {currMonth}
            </p>
        </div>
    );

    async function handleNewCostCard(newCard) {
        await handleNewCostValue(newCard.value);
        await setNewCardSet((prevCardSet) => [newCard, ...prevCardSet]);
    }

    return (
        <section>
            {showTitle()}
            <AddCostBtn
                handleNewCostCard={handleNewCostCard}
                mainData={mainData}
            />
            <MonthlyCostsList
                newCardSet={newCardSet}
                allTimeCostAvgAmount={allTimeCostAvgAmount}
            />
        </section>
    );
}
