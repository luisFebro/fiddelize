import { useState } from "react";
import SessionInList from "./session-in-list/SessionInList";
import AddTransactionBtn from "../add-transaction-btn/AddTransactionBtn";

export default function SessionIn({ handleBalance }) {
    const [newCardSet, setNewCardSet] = useState([]);

    async function handleNewTransactionCard(newCard) {
        await setNewCardSet((prevCardSet) => [newCard, ...prevCardSet]);
    }

    const mainData = {
        type: "in",
        handleNewTransactionCard,
        handleBalance,
        newCardSet,
    };

    return (
        <section className="animated fadeIn text-purple">
            <h2 className="text-subtitle font-weight-bold text-center">
                Histórico Ganhos
            </h2>
            <div className="container-center">
                <AddTransactionBtn mainData={mainData} />
            </div>
            <SessionInList mainData={mainData} />
        </section>
    );
}
