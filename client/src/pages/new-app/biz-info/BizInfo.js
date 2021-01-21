import React from "react";
import BizForm from "./BizForm";

export default function BizInfo() {
    const showTitle = () => (
        <div className="text-center text-white my-4">
            <h1 className="text-title">Novo App</h1>
            <p className="text-white text-normal mx-3 mb-5">
                Vamos começar conhecendo um pouco sobre seu trabalho.
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <div style={{ marginBottom: 150 }}>
                <BizForm />
            </div>
        </section>
    );
}
