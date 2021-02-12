import React from "react";
import BizForm from "./BizForm";
import useScrollUp from "../../../hooks/scroll/useScrollUp.js";

export default function BizInfo({ history }) {
    useScrollUp();

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <h1 className="text-title">Novo App</h1>
            <p className="text-white text-normal mx-3 mb-5">
                Vamos começar conhecendo um pouco sobre seu projeto.
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <div style={{ marginBottom: 150 }}>
                <BizForm history={history} />
            </div>
        </section>
    );
}
