import React from "react";
import QrCodeScannerBtn from "./receipt-qr-code-scanner/QrCodeScannerBtn";

export default function BenefitsContent() {
    const showTitleAndSub = () => (
        <div className="mt-3 text-center text-purple mx-3">
            <h1 className="text-subtitle font-weight-bold">
                Benefícios da
                <br />
                clientela
            </h1>
            <h2
                className="text-normal"
                style={{
                    lineHeight: "25px",
                }}
            >
                Todos os clientes aptos a receber benefícios aparecem
                automaticamente aqui.
            </h2>
        </div>
    );

    return (
        <section>
            {showTitleAndSub()}
            <div className="mt-3 d-flex justify-content-end mr-3">
                <QrCodeScannerBtn />
            </div>
        </section>
    );
}
