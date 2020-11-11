import React from "react";

export default function ScoreCustomer({ customerName }) {
    return (
        <section className="animated slideInRight">
            <p className="text-hero text-center text-white">
                Olá, {customerName}
            </p>
        </section>
    );
}
