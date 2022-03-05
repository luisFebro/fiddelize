import { useState } from "react";
import MonthlyRevenueList from "./monthly-revenue-list/MonthlyRevenueList";
import AddRevenueBtn from "./add-revenue-btn/AddRevenueBtn";

export default function MonthlyRevenueRegisterContent({
    currMonth = "...",
    handleNewRevenueValue,
    mainData,
}) {
    const [newCardSet, setNewCardSet] = useState([]);

    const allTimeCostAvgAmount = mainData && mainData.allTimeCostAvgAmount;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Histórico de Receitas
                <br />
                de {currMonth}
            </p>
        </div>
    );

    async function handleNewRevenueCard(newCard) {
        await handleNewRevenueValue(newCard.value);
        await setNewCardSet((prevCardSet) => [newCard, ...prevCardSet]);
    }

    return (
        <section>
            {showTitle()}
            <AddRevenueBtn
                handleNewRevenueCard={handleNewRevenueCard}
                mainData={mainData}
            />
            <MonthlyRevenueList
                newCardSet={newCardSet}
                allTimeCostAvgAmount={allTimeCostAvgAmount}
            />
        </section>
    );
}
