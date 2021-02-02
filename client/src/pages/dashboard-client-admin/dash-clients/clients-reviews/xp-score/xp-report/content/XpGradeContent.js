import React, { Fragment } from "react";

export default function XpGradeContent() {
    const showTitle = () => (
        <div className="my-4">
            <h1
                className="text-subtitle text-purple text-center font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Nota XP
            </h1>
            <p
                className="text-small text-purple text-center"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                A nota XP é a média geral da{" "}
                <strong>experiência de compra</strong> avaliada por todos seus
                clientes. O objetivo é manter uma nota acima de 6.
            </p>
        </div>
    );

    return (
        <Fragment>
            <section className="mx-3">{showTitle()}</section>
        </Fragment>
    );
}
