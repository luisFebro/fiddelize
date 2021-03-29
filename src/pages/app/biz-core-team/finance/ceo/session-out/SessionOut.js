import AddTransactionBtn from "../add-transaction-btn/AddTransactionBtn";
import SessionOutList from "./session-out-list/SessionOutList";

export default function SessionOut({ handleBalance }) {
    async function handleNewTransactionCard(newCard) {
        // await handleNewCostValue(newCard.value);
        // await setNewCardSet((prevCardSet) => [newCard, ...prevCardSet]);
    }

    const mainData = {
        type: "out",
        handleNewTransactionCard,
        handleBalance,
    };

    return (
        <section className="text-purple">
            <h2 className="text-subtitle font-weight-bold text-center">
                Histórico Despesas
            </h2>
            <div className="container-center">
                <AddTransactionBtn mainData={mainData} />
            </div>
            <SessionOutList mainData={mainData} />
        </section>
    );
}
