import React, { useState } from "react";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

const AsyncBoleto = Load({
    loader: () =>
        import(
            "./boleto/AsyncBoleto" /* webpackChunkName: "boleto-pay-method-page-lazy" */
        ),
});

const AsyncDebit = Load({
    loader: () =>
        import(
            "./debit/AsyncDebit" /* webpackChunkName: "debit-pay-method-page-lazy" */
        ),
});

const AsyncCredit = Load({
    loader: () =>
        import(
            "./credit/AsyncCredit" /* webpackChunkName: "credit-pay-method-page-lazy" */
        ),
});

const pickPayMethod = (payMethod, modalData) => {
    if (payMethod === "No Boleto") return <AsyncBoleto modalData={modalData} />;
    if (payMethod === "No Débito") return <AsyncDebit modalData={modalData} />;
    if (payMethod === "No Crédito")
        return <AsyncCredit modalData={modalData} />;
};

export default function PayMethodsBtn({ modalData, method = "No Boleto" }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPayMethod = pickPayMethod(method, modalData);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="medium"
                title="Esta aqui"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncPayMethod}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
