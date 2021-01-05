import React, { useState } from "react";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

const AsyncBoleto = Load({
    loading: true,
    loader: () =>
        import(
            "./boleto/AsyncBoleto" /* webpackChunkName: "boleto-pay-method-page-lazy" */
        ),
});

const AsyncDebit = Load({
    loading: true,
    loader: () =>
        import(
            "./debit/AsyncDebit" /* webpackChunkName: "debit-pay-method-page-lazy" */
        ),
});

const AsyncCredit = Load({
    loading: true,
    loader: () =>
        import(
            "./credit/AsyncCredit" /* webpackChunkName: "credit-pay-method-page-lazy" */
        ),
});

const AsyncPix = Load({
    loading: true,
    loader: () =>
        import(
            "./pix/AsyncPix" /* webpackChunkName: "pix-pay-method-page-lazy" */
        ),
});

const pickPayMethod = (payMethod, modalData) => {
    if (payMethod === "Cartão de Crédito")
        return <AsyncCredit modalData={modalData} />;
    if (payMethod === "Pix") return <AsyncPix modalData={modalData} />;
    if (payMethod === "Boleto Automático")
        return <AsyncBoleto modalData={modalData} />;
    if (payMethod === "Débito Bancário")
        return <AsyncDebit modalData={modalData} />;
};

export default function PayMethodsBtn({ modalData, method = "No Boleto" }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { isProUser, handleCancel } = modalData;

    const AsyncPayMethod = pickPayMethod(method, modalData);

    const handleFullOpen = () => {
        setFullOpen(true);
        isProUser && handleCancel(); // remove curr order.
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
                needIndex={false}
            />
        </section>
    );
}
