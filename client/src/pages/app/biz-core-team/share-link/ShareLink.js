import React from "react";

export default function ShareLink() {
    const memberId = "ana";

    return (
        <div className="position-relative container-center-col">
            <span className="mt-2 text-white text-small text-center font-weight-bold">
                Seu link de divulgação:
            </span>
            <p
                className="m-0 mt-1 text-pill main-font d-table"
                style={{ backgroundColor: "var(--themePLight)" }}
            >
                fiddelize.com.br/convite-por/{memberId}
            </p>
        </div>
    );
}
